'use client'

import * as React from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'

import { StylingForm } from '@/components/styling-form'
import { ResumePreview } from '@/components/resume-preview'
import { ExportForm } from '@/components/export-form'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Wordmark } from '@/components/brand'
import { useUIStore } from '@/store/useUIStore'

const sections = [
  { id: 'styling', label: 'Styling', helper: 'Choose typeface, accent, separator and rhythm.' },
  { id: 'preview', label: 'Preview', helper: 'A4 page, dimensioned to the millimetre.' },
  { id: 'export', label: 'Export', helper: 'PDF for printing, DOCX for editing.' },
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
    <div className="min-h-screen bg-canvas">
      <header className="sticky top-0 z-30 border-b border-line bg-canvas/85 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6 md:px-10">
          <Link href="/" aria-label="Dravvy">
            <Wordmark size="sm" />
          </Link>
          <p className="hidden text-[13px] font-medium text-slate-7 sm:block">
            Style &amp; export
          </p>
          <Link
            href="/create"
            className="text-[13px] font-medium text-slate-9 transition-colors hover:text-brand"
          >
            ← Back to editor
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-10 md:px-10 md:py-14">
        {/* Page heading */}
        <div className="mb-8">
          <p className="mb-2 text-[13px] font-semibold uppercase tracking-wider text-brand">
            Final touches
          </p>
          <h1 className="text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-slate-12 md:text-[40px]">
            Style and send.
          </h1>
          <p className="mt-3 text-[15px] text-slate-7">{current.helper}</p>
        </div>

        {/* Tab nav (pill segmented control) */}
        <Tabs value={current.id} onValueChange={(v) => setActiveSection(sections.findIndex((s) => s.id === v))}>
          <TabsList className="mb-8">
            {sections.map((section, index) => (
              <TabsTrigger key={section.id} value={section.id}>
                <span className="text-[12px] font-semibold text-slate-6 num-tabular">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>{section.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Content card */}
        <AnimatePresence mode="wait">
          <motion.section
            key={current.id}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.2, 0.7, 0.2, 1] }}
            className="rounded-2xl border border-line bg-surface p-6 shadow-sm md:p-8"
          >
            {renderStep(current.id)}
          </motion.section>
        </AnimatePresence>

        {/* Footer nav */}
        <div className="mt-8 flex items-center justify-between gap-3">
          <div>
            {safeIndex > 0 ? (
              <Button onClick={goPrev} variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span>{sections[safeIndex - 1].label}</span>
              </Button>
            ) : (
              <span />
            )}
          </div>
          {safeIndex < sections.length - 1 ? (
            <Button onClick={goNext} variant="default" size="lg" className="gap-2">
              <span>{sections[safeIndex + 1].label}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <span className="text-[13px] font-medium text-slate-7">All set.</span>
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
