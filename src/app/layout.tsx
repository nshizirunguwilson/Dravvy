import type { Metadata, Viewport } from 'next'
import {
  Caladea,
  Carlito,
  EB_Garamond,
  Lato,
  Montserrat,
  Open_Sans,
  Plus_Jakarta_Sans,
  Roboto,
} from 'next/font/google'

import './globals.css'
import { AppToaster } from '@/components/app-toaster'
import { ErrorBoundary } from '@/components/error-boundary'
import { ThemeProvider } from '@/components/theme-provider'
import { THEME_COLORS, themeInitScript } from '@/lib/theme'

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

/**
 * Resume typefaces.
 *
 * Six of the ten choices in the styling form have no system installation to
 * fall back to on a typical machine, so without these they silently rendered
 * as some other face. Caladea and Carlito are the open, metric-compatible
 * equivalents of Cambria and Calibri, which ship only with Microsoft Office.
 *
 * Each is declared behind the real system font in the stack, so a machine that
 * genuinely has Cambria or Calibri still uses it. Verified per option by
 * `npm run proof:styling`, which measures the rendered text width and fails if
 * two typefaces come out identical.
 */
const resumeRoboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-resume-roboto',
})

const resumeLato = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-resume-lato',
})

const resumeOpenSans = Open_Sans({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-resume-open-sans',
})

const resumeGaramond = EB_Garamond({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-resume-garamond',
})

const resumeMontserrat = Montserrat({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-resume-montserrat',
})

const resumeCambria = Caladea({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-resume-cambria',
})

const resumeCalibri = Carlito({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-resume-calibri',
  // Next has no metric table for Carlito, and warns when it tries to build a
  // size-adjusted fallback. The stack already names Calibri ahead of it, which
  // is the metric match, so the automatic fallback adds nothing here.
  adjustFontFallback: false,
})

const fontVariables = [
  sans.variable,
  resumeRoboto.variable,
  resumeLato.variable,
  resumeOpenSans.variable,
  resumeGaramond.variable,
  resumeCambria.variable,
  resumeCalibri.variable,
  resumeMontserrat.variable,
].join(' ')

export const metadata: Metadata = {
  title: 'Dravvy: Resume builder, no account needed',
  description:
    'A browser-only resume builder. Walk through nine sections, pick a styling, see a true A4 preview, export as PDF or DOCX.',
  keywords: ['resume', 'cv', 'builder', 'pdf', 'docx', 'a4'],
  authors: [{ name: 'Dravvy' }],
  openGraph: {
    title: 'Dravvy: Resume builder, no account needed',
    description: 'Draft, style, and export a professional resume in minutes.',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: THEME_COLORS.light,
  colorScheme: 'light dark',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={fontVariables}>
      <head>
        {/* Paints the stored theme before first paint, so a dark-mode visitor
            never sees a white flash. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen bg-canvas font-sans text-slate-12 antialiased">
        <ThemeProvider>
          <ErrorBoundary>
            {children}
            <AppToaster />
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  )
}
