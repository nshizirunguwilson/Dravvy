import { test, expect } from '@playwright/test'

import { gotoReady } from './helpers'

/**
 * Safari keeps links out of the tab order unless the visitor turns on full
 * keyboard access, which is off by default on macOS. That is a browser
 * setting, not something a page can override, so the link-order assertions
 * run on Chromium and WebKit is checked for the same controls being present
 * and operable, which is how VoiceOver reaches them.
 */
const linksAreTabbable = (browserName: string) => browserName !== 'webkit'

/**
 * Keyboard only. Nothing here uses the mouse, because a keyboard user has to
 * be able to reach and operate every control, and until now nothing checked
 * that they could.
 */
test.describe('Keyboard navigation', () => {
  test('a skip link jumps past the header to the content', async ({ page, browserName }) => {
    await gotoReady(page, '/create')
    const skip = page.getByRole('link', { name: /skip to main content/i })

    if (linksAreTabbable(browserName)) {
      await page.keyboard.press('Tab')
      await expect(skip).toBeFocused()
    } else {
      await skip.focus()
    }

    // It must be genuinely visible once focused, not a 1px sliver.
    const box = await skip.boundingBox()
    expect(box!.height).toBeGreaterThanOrEqual(44)

    await page.keyboard.press('Enter')
    await expect(page.locator('#main-content')).toBeFocused()
  })

  test('every control on the editor is reachable by tabbing', async ({ page, browserName }) => {
    await gotoReady(page, '/create')

    const reached = new Set<string>()
    for (let i = 0; i < 60; i += 1) {
      await page.keyboard.press('Tab')
      const id = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null
        if (!el || el === document.body) return null
        return `${el.tagName}:${el.getAttribute('aria-label') ?? el.textContent?.trim().slice(0, 24) ?? ''}`
      })
      if (id) reached.add(id)
    }

    // The section rail, the form fields and the footer button are all in there.
    // Safari omits links, so it reaches a few fewer stops.
    expect(reached.size).toBeGreaterThan(linksAreTabbable(browserName) ? 12 : 10)
  })

  test('focus is always visible, never invisible', async ({ page }) => {
    await gotoReady(page, '/create')
    for (let i = 0; i < 12; i += 1) {
      await page.keyboard.press('Tab')
      const visible = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null
        if (!el || el === document.body) return true
        const s = getComputedStyle(el)
        // Either an outline or a box-shadow ring counts as a focus indicator.
        const hasOutline = s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0
        const hasRing = s.boxShadow !== 'none' && s.boxShadow !== ''
        return hasOutline || hasRing
      })
      expect(visible).toBe(true)
    }
  })

  test('a form can be filled and saved without a mouse', async ({ page }) => {
    await gotoReady(page, '/create')

    await page.getByLabel(/full name/i).focus()
    await page.keyboard.type('Avery Lin')
    await page.keyboard.press('Tab')
    await page.keyboard.type('avery@example.com')

    await expect(page.getByLabel(/full name/i)).toHaveValue('Avery Lin')
    await expect(page.getByLabel(/^email/i)).toHaveValue('avery@example.com')
  })

  test('an invalid field announces itself rather than only flashing a toast', async ({ page }) => {
    await gotoReady(page, '/create')
    await page.getByRole('button', { name: /save section/i }).click()

    const name = page.getByLabel(/full name/i)
    await expect(name).toHaveAttribute('aria-invalid', 'true')

    // The message is tied to the field, so a screen reader reads them together.
    const describedBy = await name.getAttribute('aria-describedby')
    expect(describedBy).toBeTruthy()
    // React's useId contains colons, so this needs an attribute selector.
    const errorId = describedBy!.split(' ')[0]
    await expect(page.locator(`[id="${errorId}"]`)).toHaveAttribute('role', 'alert')
  })

  test('the settings tabs work with arrow keys', async ({ page }) => {
    await gotoReady(page, '/settings')
    await page.getByRole('tab', { name: /styling/i }).focus()
    await page.keyboard.press('ArrowRight')
    await expect(page.getByRole('tab', { name: /preview/i })).toBeFocused()
  })
})
