import type { Metadata, Viewport } from 'next'
import {
  EB_Garamond,
  Lato,
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
 * Four of the ten choices in the styling form have no system installation to
 * fall back to on a typical machine, so without these they silently rendered
 * as something else. Loading them here makes the choice real. The remaining
 * six (Times New Roman, Georgia, Cambria, Garamond, Calibri, Arial,
 * Helvetica) ship with Windows or macOS and are used from the system.
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

const fontVariables = [
  sans.variable,
  resumeRoboto.variable,
  resumeLato.variable,
  resumeOpenSans.variable,
  resumeGaramond.variable,
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
