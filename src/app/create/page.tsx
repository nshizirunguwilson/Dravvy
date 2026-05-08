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

const sections: { id: ResumeSection; label: string; folio: string }[] = [
  { id: 'basic', label: 'Basic information', folio: 'Plate I' },
  { id: 'work', label: 'Work experience', folio: 'Plate II' },
  { id: 'education', label: 'Education', folio: 'Plate III' },
  { id: 'skills', label: 'Skills', folio: 'Plate IV' },
  { id: 'certifications', label: 'Certifications', folio: 'Plate V' },
  { id: 'awards', label: 'Awards', folio: 'Plate VI' },
  { id: 'projects', label: 'Projects', folio: 'Plate VII' },
  { id: 'languages', label: 'Languages', folio: 'Plate VIII' },
  { id: 'references', label: 'References', folio: 'Plate IX' },
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
    <div className="min-h-screen bg-paper">
      {/* Slim editor header — separate identity from the marketing nav */}
      <header className="sticky top-0 z-30 border-b border-rule bg-paper/90 backdrop-blur-[2px]">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6 md:px-10">
          <Link href="/" aria-label="Dravvy">
            <Wordmark size="sm" />
          </Link>
          <p className="font-mono text-spec uppercase tracking-[0.16em] text-ink-6">
            Editor · <span className="text-ink-9">Folio in progress</span>
          </p>
          <Link
            href="/settings"
            className="text-caption text-ink-9 underline-offset-[6px] hover:underline"
          >
            Style &amp; export →
          </Link>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-12 gap-x-10 gap-y-12 px-6 py-12 md:px-10 md:py-16">
        {/* Left rail */}
        <div className="col-span-12 lg:col-span-3">
          <ProgressTracker />
        </div>

        {/* Editor pane */}
        <main className="col-span-12 lg:col-span-9">
          {/* Section header */}
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-rule pb-8">
            <div>
              <p className="font-mono text-spec uppercase tracking-[0.18em] text-ink-6 num-tabular">
                {current.folio} · Step {String(safeIndex + 1).padStart(2, '0')} of 09
              </p>
              <h1 className="mt-3 font-display text-h2 leading-[1.04] tracking-tight text-ink-12">
                {current.label}
              </h1>
            </div>
            <p className="hidden max-w-xs text-caption italic text-ink-7 md:block">
              Your draft saves itself, locally, as you type.
            </p>
          </div>

          {/* Animated section content */}
          <AnimatePresence mode="wait">
            <motion.section
              key={current.id}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.2, 0.7, 0.2, 1] }}
              className="space-y-6"
            >
              <ResumeForm
                section={current.id}
                onReferencesSaved={() => router.push('/settings')}
              />
            </motion.section>
          </AnimatePresence>

          {/* Footer nav */}
          <div className="mt-14 flex items-center justify-between border-t border-rule pt-7">
            <div>
              {safeIndex > 0 ? (
                <Button onClick={handlePrev} variant="ghost" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>{sections[safeIndex - 1].label}</span>
                </Button>
              ) : (
                <span className="font-mono text-spec uppercase tracking-[0.14em] text-ink-5">
                  Start of folio
                </span>
              )}
            </div>
            <Button onClick={handleNext} variant="default" size="lg" className="gap-3">
              <span>{isLast ? 'Style & export' : sections[safeIndex + 1].label}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </main>
      </div>
    </div>
  )
}
