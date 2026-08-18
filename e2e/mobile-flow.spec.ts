import { test, expect } from '@playwright/test'

import { gotoReady } from './helpers'

/**
 * The whole point of the responsive work: a person on the smallest phone we
 * support can actually build and export a resume, not merely view a page that
 * happens to fit.
 *
 * Runs at an iPhone 6s browser viewport (375x553, which is 375x667 of screen
 * minus Safari's chrome) with touch enabled.
 */
test.use({
  viewport: { width: 375, height: 553 },
  hasTouch: true,
  isMobile: true,
  deviceScaleFactor: 2,
})

test.describe('Building a resume on an iPhone 6s', () => {
  test('completes the flow from empty draft to a downloaded PDF', async ({ page }) => {
    await gotoReady(page, '/create')

    // ---- Basic information ----
    await expect(page.getByRole('heading', { level: 1, name: 'Basic information' })).toBeVisible()
    await page.getByPlaceholder('Jane Doe').fill('Avery Lin')
    await page.getByPlaceholder('jane@example.com').fill('avery@example.com')
    await page.getByPlaceholder('+1 (555) 123-4567').fill('+250 700 000 000')
    await page.getByPlaceholder('City, State').fill('Kigali, Rwanda')
    await page
      .getByPlaceholder('A short paragraph describing your professional background and goals.')
      .fill('Product designer with eight years of practice across fintech and health.')
    await page.getByRole('button', { name: 'Save section' }).click()
    await expect(page.getByText('Basic information saved')).toBeVisible()

    // ---- Work experience ----
    // The "Next:" prefix is hidden on small screens, and the section pills read
    // "2Work experience", so an exact match picks out the footer button.
    await page.getByRole('button', { name: 'Work experience', exact: true }).click()
    await expect(page.getByRole('heading', { level: 1, name: 'Work experience' })).toBeVisible()
    await page.getByRole('button', { name: 'Add role' }).click()

    await page.getByLabel('Job title', { exact: false }).first().fill('Lead Product Designer')
    await page.getByLabel('Company', { exact: false }).first().fill('Holloway Financial')
    await page.getByLabel('Bullet point 1').first().fill('Raised activation 38% in two quarters.')
    await page.getByLabel('Bullet point 2').first().fill('Coached three designers.')

    // ---- Straight through to style and export ----
    await gotoReady(page, '/settings')
    await expect(page.getByRole('tab', { name: /styling/i })).toBeVisible()

    await page.getByRole('tab', { name: /preview/i }).click()
    const paper = page.locator('article').first()
    await expect(paper).toBeVisible()
    await expect(paper).toContainText('Avery Lin')

    // The A4 page is wider than the phone, so it scrolls inside its own tray
    // rather than pushing the page sideways.
    const bodyOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    )
    expect(bodyOverflow).toBeLessThanOrEqual(1)

    // ---- Export ----
    await page.getByRole('tab', { name: /export/i }).click()
    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: /download pdf/i }).click()
    const download = await downloadPromise
    expect(download.suggestedFilename()).toMatch(/\.pdf$/)
  })

  test('keeps every control reachable without sideways scrolling', async ({ page }) => {
    for (const path of ['/', '/create', '/settings']) {
      await page.goto(path)
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      )
      expect(overflow, `${path} should not scroll sideways`).toBeLessThanOrEqual(1)
    }
  })
})
