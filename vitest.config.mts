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
      include: [
        'src/lib/utils.ts',
        'src/lib/utils/progress.ts',
        'src/lib/validations/resume.ts',
        'src/store/**',
        'src/hooks/useHydration.ts',
        'src/components/brand.tsx',
        'src/components/error-boundary.tsx',
        'src/components/progress-tracker.tsx',
        'src/components/ui/button.tsx',
        'src/components/ui/input.tsx',
        'src/components/ui/label.tsx',
        'src/components/ui/progress.tsx',
        'src/components/ui/textarea.tsx',
      ],
      exclude: ['src/**/*.d.ts', 'src/**/*.test.{ts,tsx}'],
      thresholds: {
        statements: 90,
        branches: 85,
        functions: 90,
        lines: 90,
      },
    },
  },
})
