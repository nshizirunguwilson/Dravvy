#!/usr/bin/env node
/**
 * Holds every screen of the app to every device in the ladder.
 *
 * For each device and each screen this:
 *   1. loads the app at that device's real browser viewport,
 *   2. checks the page does not scroll sideways,
 *   3. checks nothing is pushed or clipped outside the viewport,
 *   4. checks every control is big enough to hit with a thumb,
 *   5. checks no two controls overlap,
 *   6. checks no visible text drops below a legible size,
 *   7. runs axe-core for real accessibility violations,
 *   8. captures the screen as evidence.
 *
 *   npm run proof:responsive
 */
import { AxeBuilder } from '@axe-core/playwright'
import { chromium } from 'playwright'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { devices, screens } from './fixtures/devices.mjs'
import { fixture } from './fixtures/styling-matrix.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'docs/responsive-proof')
const baseURL = process.env.PROOF_URL ?? 'http://localhost:3100'

/**
 * Minimum hit area. WCAG 2.2 sets 24x24 as the AA floor (2.5.8); Apple and
 * Material both ask for 44x44 on touch. Touch devices are held to 44, pointer
 * devices to the WCAG floor.
 */
const TOUCH_TARGET = 44
const POINTER_TARGET = 24

/** Below this, body text stops being comfortably readable on a phone. */
const MIN_FONT_PX = 12

const CONTROL_SELECTOR = [
  'button',
  'a[href]',
  'input:not([type="hidden"])',
  'select',
  'textarea',
  '[role="button"]',
  '[role="tab"]',
  '[role="radio"]',
  '[role="combobox"]',
  '[role="switch"]',
].join(',')

const THEMES = ['light', 'dark']

const seed = (page, { builderStep = 0, settingsStep = 0 }, theme) =>
  page.evaluate(
    ([state, builder, settings, mode]) => {
      window.localStorage.setItem('resume-store', JSON.stringify({ state, version: 0 }))
      window.localStorage.setItem(
        'ui-store',
        JSON.stringify({
          state: { activeSection: builder, activeSettingsSection: settings },
          version: 0,
        }),
      )
      window.localStorage.setItem('dravvy-theme', mode)
    },
    [fixture, builderStep, settingsStep, theme],
  )

/** Everything measured inside the page, in one pass. */
const measure = (page, controlSelector, minFont) =>
  page.evaluate(
    ([selector, minFontPx]) => {
      const width = window.innerWidth
      const height = window.innerHeight
      const doc = document.documentElement

      const describe = (el) => {
        const id = el.id ? `#${el.id}` : ''
        const cls =
          typeof el.className === 'string' && el.className
            ? `.${el.className.trim().split(/\s+/).slice(0, 2).join('.')}`
            : ''
        const text = (el.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 40)
        return `${el.tagName.toLowerCase()}${id}${cls}${text ? ` "${text}"` : ''}`
      }

      const visible = (el) => {
        const cs = getComputedStyle(el)
        if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') return false
        const r = el.getBoundingClientRect()
        return r.width > 0 && r.height > 0
      }

      /**
       * The sr-only pattern (1px box, clipped) hides a control from sight while
       * keeping it in the tree. A hidden file input is opened by a visible
       * button, so the button is the real target and the input is not one.
       */
      const screenReaderOnly = (el) => {
        const cs = getComputedStyle(el)
        const clipped = cs.clip === 'rect(0px, 0px, 0px, 0px)' || cs.clipPath === 'inset(50%)'
        const r = el.getBoundingClientRect()
        return clipped && r.width <= 2 && r.height <= 2
      }

      /** Is this element inside something that is allowed to scroll sideways? */
      const insideScroller = (el) => {
        let node = el.parentElement
        while (node && node !== doc) {
          const cs = getComputedStyle(node)
          if (/(auto|scroll)/.test(cs.overflowX) || /(auto|scroll)/.test(cs.overflow)) return true
          node = node.parentElement
        }
        return false
      }

      // ---- 1. Does the document itself scroll sideways? ----
      const documentOverflow = Math.max(0, doc.scrollWidth - width)

      // ---- 2. Anything sticking out of the viewport? ----
      const escapees = []
      for (const el of document.body.querySelectorAll('*')) {
        if (!visible(el)) continue
        const cs = getComputedStyle(el)
        if (cs.position === 'fixed') continue
        const r = el.getBoundingClientRect()
        const overRight = r.right - width
        const overLeft = -r.left
        if (overRight > 1 || overLeft > 1) {
          if (insideScroller(el)) continue
          escapees.push({
            el: describe(el),
            overflowRight: Math.round(overRight),
            overflowLeft: Math.round(overLeft),
          })
        }
      }

      // ---- 3. Hit areas ----
      const controls = []
      for (const el of document.querySelectorAll(selector)) {
        if (!visible(el)) continue
        if (screenReaderOnly(el)) continue
        const r = el.getBoundingClientRect()
        // A checkbox or radio is activated by its whole label, so the label
        // is the real target. Measure that instead of the 20px box.
        let box = r
        if (el.tagName === 'INPUT' && (el.type === 'checkbox' || el.type === 'radio')) {
          const owner =
            el.closest('label') ||
            (el.id ? document.querySelector(`label[for="${CSS.escape(el.id)}"]`) : null)
          if (owner) box = owner.getBoundingClientRect()
        }

        controls.push({
          el: describe(el),
          w: Math.round(box.width * 10) / 10,
          h: Math.round(box.height * 10) / 10,
          x: r.x,
          y: r.y,
          right: r.right,
          bottom: r.bottom,
          // Overlap needs hit-testing, which only works above the fold.
          onScreen: r.bottom > 0 && r.top < height,
          // A link inside a sentence is exempt from the target rule, per
          // WCAG 2.5.8's inline exception.
          inline: el.tagName === 'A' && getComputedStyle(el).display.includes('inline'),
        })
      }

      // ---- 4. Overlapping controls ----
      const overlaps = []
      for (let i = 0; i < controls.length; i += 1) {
        for (let j = i + 1; j < controls.length; j += 1) {
          const a = controls[i]
          const b = controls[j]
          if (!a.onScreen || !b.onScreen) continue
          const ox = Math.min(a.right, b.right) - Math.max(a.x, b.x)
          const oy = Math.min(a.bottom, b.bottom) - Math.max(a.y, b.y)
          if (ox > 2 && oy > 2) {
            // Nested controls (a button wrapping an icon) are not a collision.
            const aEl = document.elementFromPoint(a.x + a.w / 2, a.y + a.h / 2)
            const bEl = document.elementFromPoint(b.x + b.w / 2, b.y + b.h / 2)
            if (aEl && bEl && (aEl.contains(bEl) || bEl.contains(aEl))) continue
            overlaps.push({ a: a.el, b: b.el, byX: Math.round(ox), byY: Math.round(oy) })
          }
        }
      }

      // ---- 5. Text too small to read ----
      const tiny = []
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
      const seen = new Set()
      let node = walker.nextNode()
      while (node) {
        const text = node.textContent?.trim() ?? ''
        if (text.length > 1) {
          const el = node.parentElement
          if (el && !seen.has(el) && visible(el)) {
            seen.add(el)
            const size = parseFloat(getComputedStyle(el).fontSize)
            if (size < minFontPx) {
              tiny.push({ el: describe(el), fontSize: size })
            }
          }
        }
        node = walker.nextNode()
      }

      return {
        viewport: { width, height },
        documentOverflow,
        escapees: escapees.slice(0, 12),
        escapeeCount: escapees.length,
        controls: controls.map(({ el, w, h, inline }) => ({ el, w, h, inline })),
        overlaps: overlaps.slice(0, 8),
        overlapCount: overlaps.length,
        tiny: tiny.slice(0, 8),
        tinyCount: tiny.length,
      }
    },
    [controlSelector, minFont],
  )

async function main() {
  await fs.mkdir(outDir, { recursive: true })
  for (const entry of await fs.readdir(outDir)) {
    if (entry.endsWith('.jpg') || entry === 'manifest.json') await fs.rm(path.join(outDir, entry))
  }

  const browser = await chromium.launch()
  const results = []
  let failures = 0

  for (const device of devices) {
   for (const theme of THEMES) {
    const [width, height] = device.viewport
    const context = await browser.newContext({
      viewport: { width, height },
      // Layout is driven by CSS pixels, not density, so capture at 1x and keep
      // the evidence folder a sane size.
      deviceScaleFactor: 1,
      hasTouch: device.touch,
      isMobile: device.touch,
      colorScheme: theme,
    })
    const page = await context.newPage()
    await page.goto(`${baseURL}/`)

    for (const screen of screens) {
      await seed(page, screen, theme)
      await page.goto(`${baseURL}${screen.path}`, { waitUntil: 'networkidle' })
      // `document.fonts.ready` only settles fonts already in flight. The resume
      // faces are lazy (preload: false), so a face can still be swapping in
      // when the shot is taken, and two options momentarily share a fallback.
      // Force every declared face to download, then wait.
      await page.evaluate(async () => {
        await Promise.all([...document.fonts].map((f) => f.load().catch(() => {})))
        await document.fonts.ready
      })
      await page.waitForTimeout(200)

      const m = await measure(page, CONTROL_SELECTOR, MIN_FONT_PX)

      const minTarget = device.touch ? TOUCH_TARGET : POINTER_TARGET
      const small = m.controls.filter(
        (c) => !c.inline && (c.w < minTarget - 0.5 || c.h < minTarget - 0.5),
      )

      const axe = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze()
      const violations = axe.violations
        .filter((v) => v.impact === 'serious' || v.impact === 'critical')
        .map((v) => ({
          id: v.id,
          impact: v.impact,
          nodes: v.nodes.length,
          help: v.help,
          // Keep the offending elements, not just a count. Without these a
          // failure that only shows on another OS is undebuggable from here.
          detail: v.nodes.slice(0, 5).map((n) => ({
            target: n.target.join(' '),
            html: n.html.replace(/\s+/g, ' ').slice(0, 200),
            reason: (n.any[0]?.message ?? n.all[0]?.message ?? '').replace(/\s+/g, ' ').slice(0, 240),
          })),
        }))

      const problems = []
      if (m.documentOverflow > 1) problems.push(`page scrolls sideways by ${m.documentOverflow}px`)
      if (m.escapeeCount > 0) problems.push(`${m.escapeeCount} element(s) outside the viewport`)
      if (small.length > 0) problems.push(`${small.length} control(s) under ${minTarget}px`)
      if (m.overlapCount > 0) problems.push(`${m.overlapCount} overlapping control(s)`)
      if (m.tinyCount > 0) problems.push(`${m.tinyCount} text run(s) under ${MIN_FONT_PX}px`)
      if (violations.length > 0) {
        problems.push(`axe: ${violations.map((v) => `${v.id} x${v.nodes}`).join(', ')}`)
      }
      if (problems.length > 0) failures += 1

      const slug = `${device.id}--${screen.id}--${theme}`
      const shot = await page.screenshot({ type: 'jpeg', quality: 70 })
      await fs.writeFile(path.join(outDir, `${slug}.jpg`), shot)

      results.push({
        device: device.id,
        deviceLabel: device.label,
        deviceClass: device.class,
        theme,
        screen: screen.id,
        screenLabel: screen.label,
        viewport: m.viewport,
        screenSize: device.screen,
        touch: device.touch,
        file: `${slug}.jpg`,
        bytes: shot.length,
        pass: problems.length === 0,
        problems,
        detail: {
          documentOverflow: m.documentOverflow,
          escapees: m.escapees,
          smallestControl: m.controls.length
            ? Math.min(...m.controls.filter((c) => !c.inline).map((c) => Math.min(c.w, c.h)))
            : null,
          minTarget,
          smallControls: small.slice(0, 8),
          overlaps: m.overlaps,
          tiny: m.tiny,
          controlCount: m.controls.length,
          axeViolations: violations,
        },
      })

      const mark = problems.length ? 'FAIL' : 'ok  '
      console.log(`  ${mark} ${device.label} / ${screen.label} / ${theme} ${problems.join(' | ')}`)
    }

    await context.close()
   }
  }

  await browser.close()

  const manifest = {
    generatedAt: new Date().toISOString(),
    baseURL,
    devices: devices.length,
    screens: screens.length,
    themes: THEMES,
    checked: results.length,
    failures,
    thresholds: { touchTarget: TOUCH_TARGET, pointerTarget: POINTER_TARGET, minFontPx: MIN_FONT_PX },
    results,
  }
  await fs.writeFile(path.join(outDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`)

  console.log(`\n${results.length} device/screen combinations checked, ${failures} failure(s).`)
  console.log(`Evidence in ${path.relative(root, outDir)}/`)
  if (failures > 0) process.exitCode = 1
}

main().catch((err) => {
  console.error('Responsive proof failed:', err)
  process.exit(1)
})
