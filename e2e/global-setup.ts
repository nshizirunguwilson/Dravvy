import type { FullConfig } from '@playwright/test'

/**
 * Warms every route before the workers start.
 *
 * The e2e suite runs against `next dev`, which compiles a route the first time
 * it is requested. With four workers racing to be first, that one-off compile
 * landed inside a test's timeout and showed up as a flake. Paying it once here,
 * serially, keeps the failures real.
 */
const ROUTES = ['/', '/create', '/settings']

export default async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0]?.use?.baseURL ?? 'http://localhost:3100'
  const deadline = Date.now() + 240_000

  for (const route of ROUTES) {
    const url = `${baseURL}${route}`
    process.stdout.write(`warming ${route} ... `)
    for (;;) {
      try {
        const response = await fetch(url)
        if (response.ok) {
          await response.text()
          process.stdout.write('ok\n')
          break
        }
      } catch {
        /* server still coming up */
      }
      if (Date.now() > deadline) {
        throw new Error(`Timed out warming ${url}`)
      }
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }
}
