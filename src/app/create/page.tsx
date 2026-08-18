'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'

import { ResumeForm, type ResumeSection } from '@/components/resume-form'
import { ProgressTracker } from '@/components/progress-tracker'
import { SaveProgressCompact } from '@/components/save-progress'
import { Button } from '@/components/ui/button'
import { Wordmark } from '@/components/brand'
import { ThemeToggle } from '@/components/theme-toggle'
import { useUIStore } from '@/store/useUIStore'

const sections: { id: ResumeSection; label: string; helper: string }[] = [
  { id: 'basic', label: 'Basic information', helper: 'Who you are and how to reach you.' },
  { id: 'work', label: 'Work experience', helper: 'Roles, achievements and timelines.' },
  { id: 'education', label: 'Education', helper: 'Schools, degrees and dates.' },
  { id: 'skills', label: 'Skills', helper: 'Group skills by category for easy scanning.' },
  { id: 'certifications', label: 'Certifications', helper: 'Professional certifications you hold.' },
  { id: 'awards', label: 'Awards', helper: 'Recognition and honours you have received.' },
  { id: 'projects', label: 'Projects', helper: 'Work outside formal employment worth highlighting.' },
  { id: 'languages', label: 'Languages', helper: 'Languages you speak and your proficiency.' },
  { id: 'references', label: 'References', helper: 'Named references, or "available upon request".' },
]

export default function CreatePage() {
  const activeSection = useUIStore((s) => s.activeSection)
  const setActiveSection = useUIStore((s) => s.setActiveSection)
  const router = useRouter()
  const reduce = useReducedMotion()

  const safeIndex = Math.min(activeSection, sections.length - 1)
  const current = sections[safeIndex]
  const isLast = safeIndex === sections.length - 1

  const handleNext = () => {
    if (isLast) router.push('/settings')
    else setActiveSection(safeIndex + 1)
  }
  const handlePrev = () => safeIndex > 0 && setActiveSection(safeIndex - 1)

  return (
    <div className="min-h-screen bg-canvas">
      {/* Slim editor header */}
      <header className="sticky top-0 z-30 border-b border-line bg-canvas/85 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 md:px-10">
          <Link href="/" aria-label="Dravvy" className="shrink-0">
            <Wordmark size="sm" />
          </Link>
          <p className="hidden text-[13px] font-medium text-slate-7 num-tabular md:block">
            Step {safeIndex + 1} of {sections.length}
          </p>
          <div className="flex shrink-0 items-center gap-3">
            <ThemeToggle />
            <Link
              href="/settings"
              className="inline-flex min-h-[44px] items-center text-[13px] font-medium text-slate-9 transition-colors hover:text-brand"
            >
              <span className="hidden sm:inline">Style &amp; export →</span>
              <span className="sm:hidden">Style →</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-12 gap-x-8 gap-y-6 px-4 py-6 sm:px-6 sm:py-10 md:px-10 md:py-12 lg:gap-y-10">
        {/* Left rail */}
        <div className="col-span-12 lg:col-span-3">
          <div className="space-y-4 lg:sticky lg:top-24">
            <ProgressTracker />
            <SaveProgressCompact />
          </div>
        </div>

        {/* Editor pane */}
        <main id="main-content" tabIndex={-1} className="col-span-12 lg:col-span-9">
          {/* Section header */}
          <div className="mb-6 sm:mb-8">
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-brand sm:text-[13px]">
              Section {String(safeIndex + 1).padStart(2, '0')}
            </p>
            <h1 className="text-[24px] font-bold leading-[1.15] tracking-[-0.02em] text-slate-12 sm:text-[28px] md:text-[36px] lg:text-[40px]">
              {current.label}
            </h1>
            <p className="mt-2 text-[14px] text-slate-7 sm:mt-3 sm:text-[15px]">{current.helper}</p>
          </div>

          {/* Form card */}
          <AnimatePresence mode="wait">
            <motion.section
              key={current.id}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.2, 0.7, 0.2, 1] }}
              className="rounded-2xl border border-line bg-surface p-4 shadow-sm sm:p-6 md:p-8"
            >
              <ResumeForm
                section={current.id}
                onReferencesSaved={() => router.push('/settings')}
              />
            </motion.section>
          </AnimatePresence>

          {/* Footer nav */}
          <div className="mt-6 flex items-center justify-between gap-3 sm:mt-8">
            <div className="min-w-0 shrink-0">
              {safeIndex > 0 ? (
                <Button onClick={handlePrev} variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">{sections[safeIndex - 1].label}</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              ) : (
                <span />
              )}
            </div>
            <Button
              onClick={handleNext}
              variant="default"
              size="lg"
              className="min-w-0 max-w-[60%] gap-2 sm:max-w-none"
            >
              <span className="truncate">
                {isLast
                  ? 'Style & export'
                  : (
                    <>
                      <span className="hidden sm:inline">Next: </span>
                      {sections[safeIndex + 1].label}
                    </>
                  )}
              </span>
              <ArrowRight className="h-4 w-4 shrink-0" />
            </Button>
          </div>
        </main>
      </div>
    </div>
  )
}
