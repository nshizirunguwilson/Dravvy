import type { Metadata, Viewport } from 'next'
import {
  Archivo,
  Arimo,
  Caladea,
  Carlito,
  EB_Garamond,
  Gelasio,
  Lato,
  Montserrat,
  Open_Sans,
  Outfit,
  Plus_Jakarta_Sans,
  Roboto,
  Tinos,
} from 'next/font/google'

import './globals.css'
import { AppToaster } from '@/components/app-toaster'
import { ErrorBoundary } from '@/components/error-boundary'
import { ServiceWorker } from '@/components/service-worker'
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
 * Every choice in the styling form gets a real webfont behind the system font
 * it names. Without this, a machine missing the system face falls through to
 * whatever fontconfig substitutes, and two different choices silently render
 * as the same thing. That is not hypothetical: Georgia and Times New Roman came
 * out identical on Linux until this was added.
 *
 * The open faces here are the metric-compatible equivalents of the proprietary
 * ones, so a machine that genuinely has Georgia or Cambria still uses it and
 * the layout does not shift:
 *
 *   Tinos    <- Times New Roman      Caladea  <- Cambria
 *   Gelasio  <- Georgia              Carlito  <- Calibri
 *   Arimo    <- Arial
 *
 * None are preloaded: a visitor only pays for the one typeface they pick.
 * Verified per option by `npm run proof:styling`, which measures the rendered
 * text width and fails if two typefaces come out identical.
 */
const resumeRoboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-resume-roboto',
  preload: false,
})

const resumeLato = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-resume-lato',
  preload: false,
})

const resumeOpenSans = Open_Sans({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-resume-open-sans',
  preload: false,
})

const resumeGaramond = EB_Garamond({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-resume-garamond',
  preload: false,
})

const resumeMontserrat = Montserrat({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-resume-montserrat',
  preload: false,
})

// Outfit publishes no true italic, so the browser synthesises the oblique used
// for company names and project tech lists. That is the normal fallback and is
// why no italic style is requested here.
const resumeOutfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-resume-outfit',
  preload: false,
})

const resumeTimes = Tinos({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-resume-times',
  preload: false,
})

const resumeGeorgia = Gelasio({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-resume-georgia',
  preload: false,
})

const resumeArial = Arimo({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-resume-arial',
  preload: false,
})

/**
 * Helvetica has no open metric clone that is not also an Arial clone, so the
 * genuine face is named first and Archivo, a different grotesque, sits behind
 * it. Without this, a machine with neither Helvetica nor Arial resolved both
 * options to the same substitute.
 */
const resumeHelvetica = Archivo({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-resume-helvetica',
  preload: false,
})

const resumeCambria = Caladea({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-resume-cambria',
  preload: false,
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
  resumeOutfit.variable,
  resumeTimes.variable,
  resumeGeorgia.variable,
  resumeArial.variable,
  resumeHelvetica.variable,
].join(' ')

/**
 * Absolute base for Open Graph and Twitter images. Without it Next resolves
 * them against localhost and every shared link previews as broken.
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  manifest: '/manifest.webmanifest',
  applicationName: 'Dravvy',
  appleWebApp: { capable: true, title: 'Dravvy', statusBarStyle: 'default' },
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
          <a
            href="#main-content"
            className="sr-only rounded-md bg-brand text-[14px] font-semibold text-brand-fg focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:inline-flex focus:min-h-[44px] focus:items-center focus:px-4 focus:py-3 focus:shadow-lg"
          >
            Skip to main content
          </a>
          <ServiceWorker />
          <ErrorBoundary>
            {children}
            <AppToaster />
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  )
}
