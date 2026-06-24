import { test, expect } from '@playwright/test'

test.describe('Landing page', () => {
  test('shows the hero headline and primary CTA', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /actually want to send/i })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Build your resume' })).toBeVisible()
  })

  test('navigates to the builder from the hero CTA', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Build your resume' }).click()
    await expect(page).toHaveURL(/\/create$/)
    await expect(
      page.getByRole('heading', { level: 1, name: 'Basic information' }),
    ).toBeVisible()
  })
})
