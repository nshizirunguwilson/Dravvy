import type { Metadata } from 'next'
import { Fraunces, Inter_Tight, JetBrains_Mono } from 'next/font/google'

import './globals.css'
import { Toaster } from 'sonner'
import { ErrorBoundary } from '@/components/error-boundary'

const sans = Inter_Tight({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

const display = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  style: ['normal', 'italic'],
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Dravvy — A resume, set in print.',
  description:
    'A browser-only resume builder. Walk through nine sections, choose a styling, see a true A4 preview, export as PDF or DOCX.',
  keywords: ['resume', 'cv', 'builder', 'pdf', 'docx', 'a4', 'editorial'],
  authors: [{ name: 'Dravvy' }],
  openGraph: {
    title: 'Dravvy — A resume, set in print.',
    description: 'A browser-only resume builder with a true A4 preview.',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sans.variable} ${display.variable} ${mono.variable}`}
    >
      <body className="min-h-screen bg-paper text-ink antialiased">
        <ErrorBoundary>
          {children}
          <Toaster
            position="bottom-right"
            closeButton
            toastOptions={{
              unstyled: false,
              classNames: {
                toast:
                  'bg-page text-ink-12 border border-rule shadow-page rounded-md font-sans text-[14px]',
                title: 'font-medium text-ink-12',
                description: 'text-ink-7',
                actionButton: 'bg-ink-12 text-paper rounded-sm',
                cancelButton: 'bg-paper-deep text-ink-9 rounded-sm',
                closeButton: 'border border-rule bg-paper text-ink-7',
                success: '[&_[data-icon]]:text-positive',
                error: '[&_[data-icon]]:text-negative',
              },
            }}
          />
        </ErrorBoundary>
      </body>
    </html>
  )
}
