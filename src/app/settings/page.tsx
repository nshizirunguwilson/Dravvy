'use client'

import * as React from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'

import { StylingForm } from '@/components/styling-form'
import { ResumePreview } from '@/components/resume-preview'
import { ExportForm } from '@/components/export-form'
import { SaveProgress } from '@/components/save-progress'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Wordmark } from '@/components/brand'
import { ThemeSelector, ThemeToggle } from '@/components/theme-toggle'
import { useUIStore } from '@/store/useUIStore'

const sections = [
  { id: 'styling', label: 'Styling', helper: 'Choose typeface, accent, separator and rhythm.' },
  { id: 'preview', label: 'Preview', helper: 'A4 page, dimensioned to the millimetre.' },
  { id: 'export', label: 'Export', helper: 'PDF for printing, DOCX for editing.' },
  { id: 'save', label: 'Save file', helper: 'Keep a copy of your progress, or continue from one.' },
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
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 md:px-10">
          <Link href="/" aria-label="Dravvy" className="shrink-0">
            <Wordmark size="sm" />
          </Link>
          <p className="hidden text-[13px] font-medium text-slate-7 md:block">
            Style &amp; export
          </p>
          <div className="flex shrink-0 items-center gap-3">
            <ThemeToggle />
            <Link
              href="/create"
              className="inline-flex min-h-[44px] items-center text-[13px] font-medium text-slate-9 transition-colors hover:text-brand"
            >
              <span className="hidden sm:inline">← Back to editor</span>
              <span className="sm:hidden">← Editor</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10 md:px-10 md:py-14">
        {/* Page heading */}
        <div className="mb-6 sm:mb-8">
          <p className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-brand sm:text-[13px]">
            Final touches
          </p>
          <h1 className="text-[26px] font-bold leading-[1.1] tracking-[-0.02em] text-slate-12 sm:text-[32px] md:text-[40px]">
            Style and send.
          </h1>
          <p className="mt-2 text-[14px] text-slate-7 sm:mt-3 sm:text-[15px]">{current.helper}</p>
        </div>

        {/* Tab nav, wraps in a horizontally-scrollable container at small widths */}
        <Tabs value={current.id} onValueChange={(v) => setActiveSection(sections.findIndex((s) => s.id === v))}>
          <div className="-mx-4 mb-6 overflow-x-auto px-4 sm:mx-0 sm:mb-8 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <TabsList aria-label="Final touches">
              {sections.map((section, index) => (
                <TabsTrigger key={section.id} value={section.id}>
                  <span className="text-[12px] font-semibold text-slate-7 num-tabular">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span>{section.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* The panel has to exist, otherwise every trigger's aria-controls
              points at nothing and the tablist is broken for screen readers. */}
          <TabsContent value={current.id} className="mt-0">
            <AnimatePresence mode="wait">
              <motion.section
                key={current.id}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: [0.2, 0.7, 0.2, 1] }}
                className="rounded-2xl border border-line bg-surface p-4 shadow-sm sm:p-6 md:p-8"
              >
                {renderStep(current.id)}
              </motion.section>
            </AnimatePresence>
          </TabsContent>
        </Tabs>

        {/* Footer nav */}
        <div className="mt-6 flex items-center justify-between gap-3 sm:mt-8">
          <div className="min-w-0 shrink-0">
            {safeIndex > 0 ? (
              <Button onClick={goPrev} variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span className="truncate">{sections[safeIndex - 1].label}</span>
              </Button>
            ) : (
              <span />
            )}
          </div>
          {safeIndex < sections.length - 1 ? (
            <Button
              onClick={goNext}
              variant="default"
              size="lg"
              className="min-w-0 max-w-[60%] gap-2 sm:max-w-none"
            >
              <span className="truncate">{sections[safeIndex + 1].label}</span>
              <ArrowRight className="h-4 w-4 shrink-0" />
            </Button>
          ) : (
            <span className="text-[13px] font-medium text-slate-7">All set.</span>
          )}
        </div>
      </div>
    </div>
  )
}

function AppearanceBlock() {
  return (
    <section className="rounded-xl border border-line bg-surface-2/40 p-4 sm:p-5">
      <h2 className="text-[15px] font-semibold text-slate-12">App theme</h2>
      <p className="mb-4 mt-1 text-[13px] text-slate-7">
        Light or dark for the builder itself. Your resume always previews and exports on white
        paper, whichever you pick.
      </p>
      <ThemeSelector />
    </section>
  )
}

function renderStep(id: SectionId) {
  switch (id) {
    case 'styling':
      return (
        <div className="space-y-8">
          <AppearanceBlock />
          <div className="border-t border-line pt-8">
            <StylingForm />
          </div>
        </div>
      )
    case 'preview':
      return <ResumePreview />
    case 'export':
      return <ExportForm />
    case 'save':
      return <SaveProgress />
  }
}
