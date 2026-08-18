import { defineConfig, devices } from '@playwright/test'

/**
 * End-to-end tests run against a locally started dev server, with no external
 * services, no deployment. CI starts the same server on its runner.
 */
export default defineConfig({
  testDir: './e2e',
  // Compiles every route once, serially, before the workers race for them.
  globalSetup: './e2e/global-setup.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    // Dedicated port so e2e never collides with another dev server on 3000.
    baseURL: 'http://localhost:3100',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // Every iPhone and iPad in the device ladder runs Safari, so verifying
    // only Chromium proved the app on a browser most of those users never use.
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'npm run dev -- -p 3100',
    url: 'http://localhost:3100',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
