import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'
import { Toaster } from 'sonner'
import { ErrorBoundary } from '@/components/error-boundary'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Dravvy — Resume Builder',
  description:
    'Draft, style, and export a professional resume in minutes. Multi-step builder with live preview and PDF or DOCX export.',
  keywords: ['resume', 'cv', 'builder', 'career', 'pdf', 'docx'],
  authors: [{ name: 'Dravvy' }],
  openGraph: {
    title: 'Dravvy — Resume Builder',
    description: 'Draft, style, and export a professional resume in minutes.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="font-sans">
        <ErrorBoundary>
          <main className="min-h-screen bg-gray-50 text-gray-900">{children}</main>
          <Toaster position="top-right" richColors closeButton />
        </ErrorBoundary>
      </body>
    </html>
  )
}
