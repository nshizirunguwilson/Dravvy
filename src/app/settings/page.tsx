'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

import { StylingForm } from '@/components/styling-form'
import { ResumePreview } from '@/components/resume-preview'
import { ExportForm } from '@/components/export-form'
import { Button } from '@/components/ui/button'
import { useUIStore } from '@/store/useUIStore'
import { cn } from '@/lib/utils'

const sections = [
  { id: 'styling', label: 'Styling' },
  { id: 'preview', label: 'Preview' },
  { id: 'export', label: 'Export' },
] as const

type SectionId = (typeof sections)[number]['id']

export default function SettingsPage() {
  const activeSection = useUIStore((s) => s.activeSettingsSection)
  const setActiveSection = useUIStore((s) => s.setActiveSettingsSection)

  const safeIndex = Math.min(activeSection, sections.length - 1)
  const current = sections[safeIndex]

  const goNext = () => safeIndex < sections.length - 1 && setActiveSection(safeIndex + 1)
  const goPrev = () => safeIndex > 0 && setActiveSection(safeIndex - 1)

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Final touches</p>
          <h1 className="mt-1 text-3xl font-semibold text-gray-900 md:text-4xl">Style and export</h1>
          <p className="mt-2 text-base text-gray-600">Choose your styling, preview the result, and export the file.</p>
        </div>
        <Link href="/create" className="text-sm font-medium text-gray-900 underline-offset-4 hover:underline">
          ← Back to editor
        </Link>
      </header>

      <nav className="mb-6 flex items-center gap-2 rounded-2xl border border-gray-200 bg-white p-1.5">
        {sections.map((section, index) => {
          const isActive = section.id === current.id
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(index)}
              className={cn(
                'flex-1 rounded-xl px-4 py-2 text-sm font-medium transition-colors',
                isActive ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-50'
              )}
            >
              <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full border border-current text-[10px] font-semibold">
                {index + 1}
              </span>
              {section.label}
            </button>
          )
        })}
      </nav>

      <motion.div
        key={current.id}
        className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {renderStep(current.id)}

        <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
          <Button onClick={goPrev} disabled={safeIndex === 0} variant="outline" className="gap-2">
            <ChevronLeftIcon className="h-4 w-4" />
            Previous
          </Button>
          <Button
            onClick={goNext}
            disabled={safeIndex === sections.length - 1}
            variant="outline"
            className="gap-2"
          >
            Next
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
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
