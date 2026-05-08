import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'

import './globals.css'
import { Toaster } from 'sonner'
import { ErrorBoundary } from '@/components/error-boundary'

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Dravvy — Resume builder, no account needed',
  description:
    'A browser-only resume builder. Walk through nine sections, pick a styling, see a true A4 preview, export as PDF or DOCX.',
  keywords: ['resume', 'cv', 'builder', 'pdf', 'docx', 'a4'],
  authors: [{ name: 'Dravvy' }],
  openGraph: {
    title: 'Dravvy — Resume builder, no account needed',
    description: 'Draft, style, and export a professional resume in minutes.',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={sans.variable}>
      <body className="min-h-screen bg-canvas font-sans text-slate-12 antialiased">
        <ErrorBoundary>
          {children}
          <Toaster
            position="bottom-right"
            closeButton
            toastOptions={{
              classNames: {
                toast:
                  'bg-surface text-slate-12 border border-line shadow-md rounded-xl font-sans text-[14px]',
                title: 'font-semibold text-slate-12',
                description: 'text-slate-7',
                actionButton: 'bg-brand text-white rounded-md',
                cancelButton: 'bg-surface-2 text-slate-9 rounded-md',
                closeButton: 'border border-line bg-surface text-slate-7',
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
