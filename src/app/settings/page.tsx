'use client'

import * as React from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'

import { StylingForm } from '@/components/styling-form'
import { ResumePreview } from '@/components/resume-preview'
import { ExportForm } from '@/components/export-form'
import { Button } from '@/components/ui/button'
import { Wordmark } from '@/components/brand'
import { useUIStore } from '@/store/useUIStore'
import { cn } from '@/lib/utils'

const sections = [
  { id: 'styling', label: 'Styling', folio: 'X', helper: 'Choose typeface, accent, separator and rhythm.' },
  { id: 'preview', label: 'Preview', folio: 'XI', helper: 'A4 page, dimensioned to the millimetre.' },
  { id: 'export', label: 'Export', folio: 'XII', helper: 'PDF for printing, DOCX for editing.' },
] as const

type SectionId = (typeof sections)[number]['id']

export default function SettingsPage() {
  const activeSection = useUIStore((s) => s.activeSettingsSection)
  const setActiveSection = useUIStore((s) => s.setActiveSettingsSection)
  const reduce = useReducedMotion()

  const safeIndex = Math.min(activeSection, sections.length - 1)
  const current = sections[safeIndex]

  const goNext = () => safeIndex < sections.length - 1 && setActiveSection(safeIndex + 1)
  const goPrev = () => safeIndex > 0 && setActiveSection(safeIndex - 1)

  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-30 border-b border-rule bg-paper/90 backdrop-blur-[2px]">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6 md:px-10">
          <Link href="/" aria-label="Dravvy">
            <Wordmark size="sm" />
          </Link>
          <p className="font-mono text-spec uppercase tracking-[0.16em] text-ink-6">
            Imprint · <span className="text-ink-9">Style &amp; export</span>
          </p>
          <Link
            href="/create"
            className="text-caption text-ink-9 underline-offset-[6px] hover:underline"
          >
            ← Back to editor
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16">
        {/* Page heading */}
        <div className="mb-12 grid grid-cols-12 gap-x-10 gap-y-6 border-b border-rule pb-10">
          <div className="col-span-12 lg:col-span-8">
            <p className="font-mono text-spec uppercase tracking-[0.18em] text-ink-6">
              Imprint
            </p>
            <h1 className="mt-4 font-display text-h1 leading-[1.02] tracking-[-0.026em] text-ink-12">
              The final pass — <span className="font-display-italic">style and send.</span>
            </h1>
          </div>
          <p className="col-span-12 max-w-md self-end text-caption italic text-ink-7 lg:col-span-4">
            {current.helper}
          </p>
        </div>

        {/* Editorial tab nav — text-only with animated underline */}
        <nav
          aria-label="Settings sections"
          className="mb-10 flex items-end gap-10 border-b border-rule"
        >
          {sections.map((section, index) => {
            const active = section.id === current.id
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(index)}
                className={cn(
                  'group relative -mb-px flex items-baseline gap-3 pb-4 transition-colors',
                  active ? 'text-ink-12' : 'text-ink-7 hover:text-ink-12',
                )}
              >
                <span className="font-mono text-spec uppercase tracking-[0.16em] text-ink-6 num-tabular">
                  {section.folio}
                </span>
                <span className="font-display text-[20px] font-medium leading-none tracking-tight">
                  {section.label}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    'pointer-events-none absolute inset-x-0 bottom-[-1px] h-px origin-left bg-ink-12 transition-transform duration-200',
                    active ? 'scale-x-100' : 'scale-x-0',
                  )}
                />
              </button>
            )
          })}
        </nav>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.section
            key={current.id}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.2, 0.7, 0.2, 1] }}
          >
            {renderStep(current.id)}
          </motion.section>
        </AnimatePresence>

        {/* Footer nav */}
        <div className="mt-16 flex items-center justify-between border-t border-rule pt-7">
          <div>
            {safeIndex > 0 ? (
              <Button onClick={goPrev} variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span>{sections[safeIndex - 1].label}</span>
              </Button>
            ) : (
              <span className="font-mono text-spec uppercase tracking-[0.14em] text-ink-5">
                Imprint open
              </span>
            )}
          </div>
          {safeIndex < sections.length - 1 ? (
            <Button onClick={goNext} variant="default" size="lg" className="gap-3">
              <span>{sections[safeIndex + 1].label}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <span className="font-mono text-spec uppercase tracking-[0.14em] text-ink-5">
              End of folio
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function renderStep(id: SectionId) {
  switch (id) {
    case 'styling':
      return <StylingForm />
    case 'preview':
      return <ResumePreview />
    case 'export':
      return <ExportForm />
  }
}
