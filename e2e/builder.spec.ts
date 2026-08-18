import { test, expect } from '@playwright/test'

import { gotoReady } from './helpers'

test.describe('Resume builder', () => {
  test('opens on the basic information section', async ({ page }) => {
    await gotoReady(page, '/create')
    await expect(
      page.getByRole('heading', { level: 1, name: 'Basic information' }),
    ).toBeVisible()
    await expect(page.getByText(/Step 1 of 9/)).toBeVisible()
  })

  test('advances to the next section via the footer button', async ({ page }) => {
    await gotoReady(page, '/create')
    await page.getByRole('button', { name: /next:\s*work experience/i }).click()
    await expect(
      page.getByRole('heading', { level: 1, name: 'Work experience' }),
    ).toBeVisible()
  })
})
