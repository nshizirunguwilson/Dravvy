'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'

import { ResumeForm, type ResumeSection } from '@/components/resume-form'
import { ProgressTracker } from '@/components/progress-tracker'
import { Button } from '@/components/ui/button'
import { Wordmark } from '@/components/brand'
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
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6 md:px-10">
          <Link href="/" aria-label="Dravvy">
            <Wordmark size="sm" />
          </Link>
          <p className="hidden text-[13px] font-medium text-slate-7 sm:block num-tabular">
            Step {safeIndex + 1} of {sections.length}
          </p>
          <Link
            href="/settings"
            className="text-[13px] font-medium text-slate-9 transition-colors hover:text-brand"
          >
            Style &amp; export →
          </Link>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-12 gap-x-8 gap-y-10 px-6 py-10 md:px-10 md:py-12">
        {/* Left rail */}
        <div className="col-span-12 lg:col-span-3">
          <ProgressTracker />
        </div>

        {/* Editor pane */}
        <main className="col-span-12 lg:col-span-9">
          {/* Section header */}
          <div className="mb-8">
            <p className="mb-2 text-[13px] font-semibold uppercase tracking-wider text-brand">
              Section {String(safeIndex + 1).padStart(2, '0')}
            </p>
            <h1 className="text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-slate-12 md:text-[40px]">
              {current.label}
            </h1>
            <p className="mt-3 text-[15px] text-slate-7">{current.helper}</p>
          </div>

          {/* Form card */}
          <AnimatePresence mode="wait">
            <motion.section
              key={current.id}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.2, 0.7, 0.2, 1] }}
              className="rounded-2xl border border-line bg-surface p-6 shadow-sm md:p-8"
            >
              <ResumeForm
                section={current.id}
                onReferencesSaved={() => router.push('/settings')}
              />
            </motion.section>
          </AnimatePresence>

          {/* Footer nav */}
          <div className="mt-8 flex items-center justify-between gap-3">
            <div>
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
            <Button onClick={handleNext} variant="default" size="lg" className="gap-2">
              <span>{isLast ? 'Style & export' : `Next: ${sections[safeIndex + 1].label}`}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </main>
      </div>
    </div>
  )
}
