import type { Page } from '@playwright/test'

/**
 * Navigates and waits until React has actually hydrated.
 *
 * Before hydration the page is server-rendered HTML: typing into an input sets
 * its DOM value but no handler runs, so nothing reaches the store, and the
 * value is wiped on the first client render. Chromium hydrates fast enough to
 * hide this; WebKit does not, which is how it turned up.
 *
 * The theme toggle is the marker. Its label is generic until the client knows
 * which theme is live, so a specific label means React is running.
 */
export async function gotoReady(page: Page, path: string) {
  await page.goto(path)
  await page.getByRole('button', { name: /switch to (dark|light) theme/i }).waitFor({
    state: 'attached',
    timeout: 15_000,
  })
}
