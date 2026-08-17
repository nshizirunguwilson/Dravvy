import { readFileSync } from 'node:fs'
import path from 'node:path'
import os from 'node:os'

import { test, expect, type Page } from '@playwright/test'

const fillBasics = async (page: Page) => {
  await page.getByPlaceholder('Jane Doe').fill('Avery Lin')
  await page.getByPlaceholder('jane@example.com').fill('avery@example.com')
  await page.getByPlaceholder('+1 (555) 123-4567').fill('+250700000000')
  await page.getByPlaceholder('City, State').fill('Kigali, Rwanda')
}

test.describe('Save and resume', () => {
  test('saves a progress file and loads it back after the draft is gone', async ({ page }) => {
    await page.goto('/create')
    await fillBasics(page)
    // Move a couple of steps in so we can prove the position is restored too.
    await page.getByRole('button', { name: /next:\s*work experience/i }).click()
    await expect(page.getByText(/Step 2 of 9/)).toBeVisible()

    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: /^save$/i }).click()
    const download = await downloadPromise

    const savedPath = path.join(os.tmpdir(), `dravvy-e2e-${Date.now()}.json`)
    await download.saveAs(savedPath)

    const contents = JSON.parse(readFileSync(savedPath, 'utf8'))
    expect(contents.format).toBe('dravvy.resume-progress')
    expect(contents.resume.contact.fullName).toBe('Avery Lin')
    expect(contents.progress.builderStep).toBe(1)

    // Wipe the browser, exactly as a visitor clearing site data would.
    await page.evaluate(() => window.localStorage.clear())
    await page.reload()
    await expect(page.getByPlaceholder('Jane Doe')).toHaveValue('')

    await page.getByLabel('Progress file').first().setInputFiles(savedPath)

    await expect(page.getByPlaceholder('Jane Doe')).toHaveValue('Avery Lin')
    await expect(page.getByPlaceholder('City, State')).toHaveValue('Kigali, Rwanda')
    await expect(page.getByText(/Step 2 of 9/)).toBeVisible()
  })

  test('previews the file before replacing the draft from settings', async ({ page }) => {
    await page.goto('/create')
    await fillBasics(page)

    await page.goto('/settings')
    await page.getByRole('tab', { name: /save file/i }).click()

    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: /save progress file/i }).click()
    const download = await downloadPromise
    const savedPath = path.join(os.tmpdir(), `dravvy-e2e-settings-${Date.now()}.json`)
    await download.saveAs(savedPath)

    await page.evaluate(() => window.localStorage.clear())
    await page.reload()
    await page.getByRole('tab', { name: /save file/i }).click()

    await page.getByLabel('Progress file').setInputFiles(savedPath)

    await expect(page.getByText('Avery Lin')).toBeVisible()
    await page.getByRole('button', { name: /replace my draft/i }).click()
    await expect(page.getByText(/draft restored/i)).toBeVisible()

    await page.goto('/create')
    await expect(page.getByPlaceholder('Jane Doe')).toHaveValue('Avery Lin')
  })

  test('refuses a file it did not write', async ({ page }) => {
    await page.goto('/settings')
    await page.getByRole('tab', { name: /save file/i }).click()

    await page.getByLabel('Progress file').setInputFiles({
      name: 'holiday-photos.json',
      mimeType: 'application/json',
      buffer: Buffer.from('{"hello":"world"}'),
    })

    await expect(page.locator('p[role="alert"]')).toContainText(/not saved by Dravvy/i)
    await expect(page.getByRole('button', { name: /replace my draft/i })).toHaveCount(0)
  })
})
