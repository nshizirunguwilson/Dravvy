import { test, expect } from '@playwright/test'

import { gotoReady } from './helpers'

const rootClass = (page: import('@playwright/test').Page) =>
  page.evaluate(() => document.documentElement.className)

test.describe('Light and dark theme', () => {
  test('switches the whole page to dark and back', async ({ page }) => {
    await gotoReady(page, '/')

    await expect(page.locator('html')).not.toHaveClass(/dark/)
    await page.getByRole('button', { name: /switch to dark theme/i }).click()
    await expect(page.locator('html')).toHaveClass(/dark/)

    await page.getByRole('button', { name: /switch to light theme/i }).click()
    await expect(page.locator('html')).not.toHaveClass(/dark/)
  })

  test('remembers the choice across a reload with no flash of light', async ({ page }) => {
    await gotoReady(page, '/')
    await page.getByRole('button', { name: /switch to dark theme/i }).click()
    await expect(page.locator('html')).toHaveClass(/dark/)

    await page.reload({ waitUntil: 'commit' })
    // The blocking head script must have painted before anything renders.
    await expect(page.locator('html')).toHaveClass(/dark/)
    expect(await rootClass(page)).toContain('dark')
  })

  test('carries the choice across pages', async ({ page }) => {
    await gotoReady(page, '/')
    await page.getByRole('button', { name: /switch to dark theme/i }).click()

    await gotoReady(page, '/create')
    await expect(page.locator('html')).toHaveClass(/dark/)

    await gotoReady(page, '/settings')
    await expect(page.locator('html')).toHaveClass(/dark/)
  })

  test('paints a dark canvas, not just a class', async ({ page }) => {
    await gotoReady(page, '/')
    const light = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)

    await page.getByRole('button', { name: /switch to dark theme/i }).click()
    await expect(page.locator('html')).toHaveClass(/dark/)
    const dark = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)

    expect(dark).not.toBe(light)
    expect(await page.evaluate(() => document.documentElement.style.colorScheme)).toBe('dark')
  })

  test('offers the three-way selector on the settings page', async ({ page }) => {
    await gotoReady(page, '/settings')
    await expect(page.getByRole('radio', { name: 'Light' })).toBeVisible()
    await expect(page.getByRole('radio', { name: 'Dark' })).toBeVisible()
    await expect(page.getByRole('radio', { name: 'System' })).toBeVisible()

    await page.getByRole('radio', { name: 'Dark' }).click()
    await expect(page.locator('html')).toHaveClass(/dark/)
    await expect(page.getByRole('radio', { name: 'Dark' })).toHaveAttribute('aria-checked', 'true')
  })

  test('keeps the resume page white while the app is dark', async ({ page }) => {
    await gotoReady(page, '/settings')
    await page.getByRole('radio', { name: 'Dark' }).click()
    await page.getByRole('tab', { name: /preview/i }).click()

    const paper = page.locator('article').first()
    await expect(paper).toBeVisible()
    await expect(paper).toHaveCSS('background-color', 'rgb(255, 255, 255)')
  })
})
