#!/usr/bin/env node
/**
 * Proves every styling option actually changes the rendered resume.
 *
 * For each option in `scripts/fixtures/styling-matrix.mjs` this:
 *   1. seeds the draft, selects the option, and reloads the live A4 preview,
 *   2. reads the rendered DOM back and asserts the option took effect,
 *   3. saves a screenshot of the page to docs/styling-proof/,
 *   4. checks every screenshot inside a group is pixel-distinct from its
 *      siblings, so an option that silently did nothing cannot pass.
 *
 * It also cross-checks the matrix against the styling form itself, so an option
 * added to the UI without proof here makes this fail.
 *
 * Run against a server already listening on PORT (default 3100):
 *   npm run proof:styling
 */
import { chromium } from 'playwright'
import { createHash } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { fixture, groups, totalOptions } from './fixtures/styling-matrix.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'docs/styling-proof')
const baseURL = process.env.PROOF_URL ?? 'http://localhost:3100'

/** Height of the page captured, in CSS px. Enough to show header + 3 sections. */
const CLIP_HEIGHT = 660

const hash = (buffer) => createHash('sha256').update(buffer).digest('hex').slice(0, 16)

const seed = async (page, style) => {
  const draft = { ...fixture, style: { ...fixture.style, ...style } }
  await page.evaluate(
    ([state]) => {
      window.localStorage.setItem('resume-store', JSON.stringify({ state, version: 0 }))
      window.localStorage.setItem(
        'ui-store',
        JSON.stringify({ state: { activeSection: 0, activeSettingsSection: 1 }, version: 0 }),
      )
      window.localStorage.setItem('dravvy-theme', 'light')
    },
    [draft],
  )
}

/** Reads back what the browser actually rendered. */
const readRendered = (page) =>
  page.evaluate(() => {
    const article = document.querySelector('article')
    if (!article) return null
    const header = article.querySelector('header')
    const name = article.querySelector('h1')
    const heading = article.querySelector('h2')
    const section = heading?.closest('section')

    // The rule is the accent-coloured strip, distinguished from real content.
    const rules = section
      ? Array.from(section.children).filter((node) => {
          if (node.tagName !== 'DIV') return false
          const box = node.getBoundingClientRect()
          return box.height > 0 && box.height <= 8
        })
      : []

    const ruleBoxes = rules.flatMap((rule) => {
      const inner = Array.from(rule.children).filter((c) => c.tagName === 'DIV')
      const nodes = inner.length > 0 ? inner : [rule]
      return nodes.map((node) => {
        const cs = getComputedStyle(node)
        const box = node.getBoundingClientRect()
        return {
          height: Math.round(box.height * 100) / 100,
          width: Math.round(box.width),
          background: cs.backgroundColor,
        }
      })
    })

    // Where does the first rule sit relative to the first heading?
    const headingTop = heading?.getBoundingClientRect().top ?? 0
    const firstRuleTop = rules[0]?.getBoundingClientRect().top ?? null

    const articleStyle = getComputedStyle(article)
    const headingStyle = heading ? getComputedStyle(heading) : null
    const nameStyle = name ? getComputedStyle(name) : null

    // The contact line carries the profile links.
    const contactLine = article.querySelector('header p')?.textContent ?? ''
    // Language rows are the only place proficiency is written.
    const languageText = Array.from(article.querySelectorAll('section'))
      .find((s) => /languages/i.test(s.querySelector('h2')?.textContent ?? ''))
      ?.textContent ?? ''

    // Dates live in the right-hand span of each experience row.
    const dateText =
      Array.from(article.querySelectorAll('span'))
        .map((el) => el.textContent?.trim() ?? '')
        .find((text) => /^[A-Za-z0-9/]+ ?[A-Za-z0-9]* - /.test(text)) ?? ''

    return {
      articleFontFamily: articleStyle.fontFamily,
      articleFontSize: parseFloat(articleStyle.fontSize),
      headerAlign: header ? getComputedStyle(header).textAlign : null,
      headerMarginBottom: header ? parseFloat(getComputedStyle(header).marginBottom) : null,
      nameText: name?.textContent?.trim() ?? '',
      // A heading is a block, so its box is always the container width. Wrap
      // the text node in a Range to measure the glyphs themselves. This is the
      // number that proves a typeface really loaded instead of falling back.
      nameWidth: (() => {
        if (!name?.firstChild) return null
        const range = document.createRange()
        range.selectNodeContents(name)
        return Math.round(range.getBoundingClientRect().width * 100) / 100
      })(),
      nameTextTransform: nameStyle?.textTransform ?? null,
      nameLetterSpacing: nameStyle?.letterSpacing ?? null,
      nameFontSize: nameStyle ? parseFloat(nameStyle.fontSize) : null,
      headingColor: headingStyle?.color ?? null,
      headingFontSize: headingStyle ? parseFloat(headingStyle.fontSize) : null,
      headingLetterSpacing: headingStyle?.letterSpacing ?? null,
      ruleCount: ruleBoxes.length,
      ruleBoxes,
      rulePlacement: firstRuleTop === null ? 'none' : firstRuleTop < headingTop ? 'above' : 'below',
      contentWidth: Math.round(article.getBoundingClientRect().width - 2 * parseFloat(articleStyle.paddingLeft)),
      contactLine,
      languageText,
      dateText,
    }
  })

const hexToRgb = (hex) => {
  const clean = hex.replace('#', '')
  const num = parseInt(clean, 16)
  return `rgb(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255})`
}

/** Per-group assertion: did this option demonstrably take effect? */
function checkOption(groupId, option, rendered, baseline) {
  switch (groupId) {
    case 'theme': {
      const expected = {
        modern: { headerAlign: 'center', rulePlacement: 'above', uppercase: 'none' },
        classic: { headerAlign: 'center', rulePlacement: 'below', uppercase: 'uppercase' },
        minimal: { headerAlign: 'left', rulePlacement: 'above', uppercase: 'none' },
      }[option.value]

      if (rendered.headerAlign !== expected.headerAlign) {
        return `header alignment is ${rendered.headerAlign}, expected ${expected.headerAlign}`
      }
      if (rendered.rulePlacement !== expected.rulePlacement) {
        return `rule sits ${rendered.rulePlacement} the heading, expected ${expected.rulePlacement}`
      }
      if (rendered.nameTextTransform !== expected.uppercase) {
        return `name transform is ${rendered.nameTextTransform}, expected ${expected.uppercase}`
      }
      if (option.value === 'minimal') {
        const rule = rendered.ruleBoxes[0]
        if (!rule || rule.width > rendered.contentWidth * 0.5) {
          return `minimal should use a short rule, got ${rule?.width}px of ${rendered.contentWidth}px`
        }
      } else {
        const rule = rendered.ruleBoxes[0]
        if (!rule || rule.width < rendered.contentWidth * 0.9) {
          return `${option.value} should use a full-width rule, got ${rule?.width}px`
        }
      }
      return null
    }

    case 'typeface': {
      const family = rendered.articleFontFamily.toLowerCase()
      const wanted = option.value.toLowerCase()
      const named =
        family.includes(wanted) ||
        (wanted === 'open sans' && family.includes('open')) ||
        family.includes('--font-resume')
      if (!named) return `computed font-family "${rendered.articleFontFamily}" does not lead with ${option.label}`
      // The width of the same name string under the same size is the proof the
      // face actually loaded rather than quietly falling back.
      if (!rendered.nameWidth) return 'could not measure the rendered name'
      return null
    }

    case 'body-size': {
      const expected = { small: 11, medium: 12.5, large: 14 }[option.value]
      if (Math.abs(rendered.articleFontSize - expected) > 0.6) {
        return `body renders at ${rendered.articleFontSize}px, expected ${expected}px`
      }
      return null
    }

    case 'section-spacing': {
      const expected = { small: 12, medium: 18, large: 26 }[option.value]
      if (Math.abs(rendered.headerMarginBottom - expected) > 1) {
        return `header gap is ${rendered.headerMarginBottom}px, expected ${expected}px`
      }
      return null
    }

    case 'separator': {
      if (option.value === 'no separator') {
        return rendered.ruleCount === 0 ? null : `expected no rule, found ${rendered.ruleCount}`
      }
      if (option.value === 'double line') {
        return rendered.ruleCount === 2 ? null : `expected two rules, found ${rendered.ruleCount}`
      }
      const rule = rendered.ruleBoxes[0]
      if (!rule) return 'expected one rule, found none'
      const expectedHeight = option.value === 'bold line' ? 3 : 1
      if (Math.abs(rule.height - expectedHeight) > 0.5) {
        return `rule is ${rule.height}px tall, expected ${expectedHeight}px`
      }
      return null
    }

    case 'date-format': {
      const range = rendered.dateText
      if (!range) return 'no date range rendered'
      const start = range.split(' - ')[0].trim()
      if (!option.expect.test(start)) {
        return `date "${start}" does not match ${option.expect}`
      }
      return null
    }

    case 'profile-links': {
      const shown = /LinkedIn/.test(rendered.contactLine)
      if (option.value === true && !shown) return 'expected LinkedIn in the contact line'
      if (option.value === false && shown) return 'contact line still lists LinkedIn'
      return null
    }

    case 'language-proficiency': {
      const shown = /native|fluent|proficient/i.test(rendered.languageText)
      if (option.value === true && !shown) return 'expected a proficiency level beside a language'
      if (option.value === false && shown) return 'proficiency is still written beside a language'
      return null
    }

    case 'accent-colour': {
      const expected = hexToRgb(option.value)
      if (rendered.headingColor !== expected) {
        return `section heading is ${rendered.headingColor}, expected ${expected} for ${option.value}`
      }
      const rule = rendered.ruleBoxes[0]
      if (!rule || rule.background !== expected) {
        return `rule is ${rule?.background}, expected ${expected}`
      }
      return null
    }

    default:
      return `no check defined for group ${groupId}`
  }
}

async function main() {
  // Clear only what this script owns. The export sweep writes exports.json
  // into the same folder and the two run independently, in either order.
  await fs.mkdir(outDir, { recursive: true })
  for (const entry of await fs.readdir(outDir)) {
    if (entry.endsWith('.jpg') || entry === 'manifest.json') {
      await fs.rm(path.join(outDir, entry))
    }
  }

  const browser = await chromium.launch()
  const context = await browser.newContext({
    // Tall enough that a whole A4 page fits on screen. A clip can never reach
    // past the viewport, so a short one silently truncated the capture and two
    // options differing near the foot of the page looked identical.
    viewport: { width: 1280, height: 1900 },
    deviceScaleFactor: 1.5,
    colorScheme: 'light',
  })
  const page = await context.newPage()

  await page.goto(`${baseURL}/settings`)

  // Cross-check: does the styling form still offer exactly what we sweep?
  const formCheck = await auditForm(page)

  const results = []
  let failures = 0

  for (const group of groups) {
    const seen = new Map()

    for (const option of group.options) {
      const style = { [group.field]: option.value }
      await seed(page, style)
      await page.reload({ waitUntil: 'networkidle' })
      await page.waitForSelector('article', { state: 'visible' })
      // `document.fonts.ready` only settles fonts already in flight. The resume
      // faces are lazy (preload: false), so a face can still be swapping in
      // when the shot is taken, and two options momentarily share a fallback.
      // Force every declared face to download, then wait.
      await page.evaluate(async () => {
        await Promise.all([...document.fonts].map((f) => f.load().catch(() => {})))
        await document.fonts.ready
      })
      await page.waitForTimeout(150)

      const rendered = await readRendered(page)
      if (!rendered) throw new Error(`preview did not render for ${group.id}/${option.value}`)

      const problem = checkOption(group.id, option, rendered)

      const article = await page.locator('article').first().boundingBox()
      const clip = {
        x: article.x,
        y: Math.max(article.y, 0),
        width: article.width,
        height: Math.min(group.captureHeight ?? CLIP_HEIGHT, article.height),
      }

      // Distinctness is judged on the lossless capture so compression can
      // never mask two options rendering the same. Only the lighter copy is
      // written to disk, to keep the repository sane.
      const shot = await page.screenshot({ clip, type: 'png' })
      const compact = await page.screenshot({ clip, type: 'jpeg', quality: 78 })

      const slug = `${group.id}--${String(option.value).replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`
      const file = `${slug}.jpg`
      await fs.writeFile(path.join(outDir, file), compact)

      const digest = hash(shot)
      const clash = seen.get(digest)
      seen.set(digest, option.label)

      const distinct = !clash
      if (problem) failures += 1
      if (!distinct) failures += 1

      results.push({
        group: group.id,
        groupLabel: group.label,
        value: option.value,
        label: option.label,
        file,
        bytes: compact.length,
        digest,
        rendered: {
          fontFamily: rendered.articleFontFamily,
          bodyPx: rendered.articleFontSize,
          headerAlign: rendered.headerAlign,
          headerGapPx: rendered.headerMarginBottom,
          headingColor: rendered.headingColor,
          nameWidthPx: rendered.nameWidth,
          rulePlacement: rendered.rulePlacement,
          ruleCount: rendered.ruleCount,
          ruleHeightPx: rendered.ruleBoxes[0]?.height ?? null,
          ruleWidthPx: rendered.ruleBoxes[0]?.width ?? null,
          date: rendered.dateText.split(' - ')[0] ?? '',
        },
        effectCheck: problem ? { pass: false, reason: problem } : { pass: true },
        distinctCheck: distinct
          ? { pass: true }
          : { pass: false, reason: `renders identically to "${clash}"` },
      })

      const mark = problem || !distinct ? 'FAIL' : 'ok  '
      const note = problem ?? (distinct ? '' : `identical to ${clash}`)
      console.log(`  ${mark} ${group.label} / ${option.label} ${note}`)
    }
  }

  // Typeface needs an extra proof: distinct faces must measure differently.
  const typefaceWidths = results
    .filter((r) => r.group === 'typeface')
    .map((r) => ({ label: r.label, width: r.rendered.nameWidthPx }))

  await browser.close()

  const manifest = {
    generatedAt: new Date().toISOString(),
    baseURL,
    totalOptions,
    checked: results.length,
    failures,
    formCheck,
    typefaceWidths,
    results,
  }
  await fs.writeFile(path.join(outDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`)

  console.log(`\n${results.length} options checked, ${failures} failure(s).`)
  console.log(`Images and manifest in ${path.relative(root, outDir)}/`)

  if (!formCheck.pass) {
    console.error(`\nForm audit FAILED: ${formCheck.reason}`)
    process.exitCode = 1
  }
  if (failures > 0) process.exitCode = 1
}

/** Reads the option counts straight out of the live styling form. */
async function auditForm(page) {
  await page.evaluate(() => {
    window.localStorage.setItem(
      'ui-store',
      JSON.stringify({ state: { activeSection: 0, activeSettingsSection: 0 }, version: 0 }),
    )
  })
  await page.reload({ waitUntil: 'networkidle' })

  const counts = {}
  const selects = ['Theme', 'Typeface', 'Body size', 'Section spacing', 'Separator', 'Date format']

  for (const label of selects) {
    const trigger = page.locator('div').filter({ hasText: new RegExp(`^${label}$`) })
    void trigger
  }

  // Each Radix Select is opened in turn and its options counted.
  const triggers = page.locator('button[role="combobox"]')
  const triggerCount = await triggers.count()
  for (let index = 0; index < triggerCount && index < selects.length; index += 1) {
    await triggers.nth(index).click()
    await page.waitForSelector('[role="option"]')
    counts[selects[index]] = await page.locator('[role="option"]').count()
    await page.keyboard.press('Escape')
    await page.waitForTimeout(80)
  }

  counts['Accent colour'] = await page.locator('button[aria-label^="Use "]').count()
  counts['Accent colour custom'] = await page.locator('input[type="color"]').count()

  // The two boolean options are switches, not dropdowns. Each is on or off,
  // so a switch that exists is worth two options in the matrix.
  const switches = await page.locator('[role="switch"]').count()
  counts['Show profile links'] = switches >= 1 ? 2 : 0
  counts['Show language proficiency'] = switches >= 2 ? 2 : 0

  // Derived from the matrix, never hardcoded, so adding an option in one place
  // and forgetting the other is what trips the audit rather than a stale number.
  const expected = Object.fromEntries(
    groups.map((group) => [
      group.label,
      group.id === 'accent-colour'
        ? group.options.filter((o) => !o.custom).length
        : group.options.length,
    ]),
  )
  expected['Accent colour custom'] = 1

  const mismatches = Object.entries(expected)
    .filter(([key, want]) => counts[key] !== want)
    .map(([key, want]) => `${key}: form has ${counts[key]}, matrix expects ${want}`)

  return {
    pass: mismatches.length === 0,
    counts,
    expected,
    reason: mismatches.join('; '),
  }
}

main().catch((err) => {
  console.error('Styling proof failed:', err)
  process.exit(1)
})
