import { defineConfig } from 'vitest/config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  // Use the automatic JSX runtime so test files don't need to import React.
  esbuild: {
    jsx: 'automatic',
  },
  resolve: {
    alias: {
      '@': path.resolve(rootDir, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      // Scope coverage to the modules that are under unit test. Heavy view
      // components and the DOCX/PDF exporters are exercised by the export
      // smoke test instead, so they're intentionally out of this gate.
      // Everything with logic worth protecting. Route files and the two heavy
      // exporters are deliberately out: routes are covered end to end by
      // Playwright, and the PDF and DOCX pipelines by the export smoke test
      // and the styling proof, neither of which runs under jsdom.
      include: [
        'src/lib/**',
        'src/hooks/**',
        'src/store/**',
        'src/components/**',
      ],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.test.{ts,tsx}',
        'src/components/resume-pdf.tsx',
        'src/lib/resume-docx.ts',
        'src/components/service-worker.tsx',
        'src/components/app-toaster.tsx',
      ],
      thresholds: {
        statements: 90,
        branches: 85,
        functions: 90,
        lines: 90,
      },
    },
  },
})
