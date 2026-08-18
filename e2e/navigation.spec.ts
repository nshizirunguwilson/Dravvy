import { test, expect } from '@playwright/test'

import { gotoReady } from './helpers'

test.describe('Builder ↔ settings navigation', () => {
  test('moves from the editor to style & export', async ({ page }) => {
    await gotoReady(page, '/create')
    await page.getByRole('link', { name: /style & export/i }).click()
    await expect(page).toHaveURL(/\/settings$/)
    await expect(
      page.getByRole('heading', { level: 1, name: 'Style and send.' }),
    ).toBeVisible()
  })

  test('returns to the editor from settings', async ({ page }) => {
    await gotoReady(page, '/settings')
    await page.getByRole('link', { name: /back to editor/i }).click()
    await expect(page).toHaveURL(/\/create$/)
    await expect(
      page.getByRole('heading', { level: 1, name: 'Basic information' }),
    ).toBeVisible()
  })
})
