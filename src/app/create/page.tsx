'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

import { ResumeForm, type ResumeSection } from '@/components/resume-form'
import { ProgressTracker } from '@/components/progress-tracker'
import { Button } from '@/components/ui/button'
import { useUIStore } from '@/store/useUIStore'

const sections: { id: ResumeSection; label: string }[] = [
  { id: 'basic', label: 'Basic Information' },
  { id: 'work', label: 'Work Experience' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'awards', label: 'Awards' },
  { id: 'projects', label: 'Projects' },
  { id: 'languages', label: 'Languages' },
  { id: 'references', label: 'References' },
]

export default function CreatePage() {
  const activeSection = useUIStore((state) => state.activeSection)
  const setActiveSection = useUIStore((state) => state.setActiveSection)
  const router = useRouter()

  const safeIndex = Math.min(activeSection, sections.length - 1)
  const current = sections[safeIndex]
  const isLast = safeIndex === sections.length - 1

  const handleNext = () => {
    if (isLast) {
      router.push('/settings')
    } else {
      setActiveSection(safeIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (safeIndex > 0) {
      setActiveSection(safeIndex - 1)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <header className="mb-8">
        <p className="text-sm font-medium text-gray-500">Step {safeIndex + 1} of {sections.length}</p>
        <h1 className="mt-1 text-3xl font-semibold text-gray-900 md:text-4xl">Build your resume</h1>
        <p className="mt-2 text-base text-gray-600">Fill in your information one section at a time. Your changes save automatically.</p>
      </header>

      <div className="space-y-6">
        <ProgressTracker />
        <motion.div
          key={current.id}
          className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <h2 className="mb-6 text-xl font-semibold text-gray-900">{current.label}</h2>
          <ResumeForm
            section={current.id}
            onReferencesSaved={() => router.push('/settings')}
          />

          <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
            <Button
              onClick={handlePrevious}
              disabled={safeIndex === 0}
              variant="outline"
              className="gap-2"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              Previous
            </Button>
            <Button
              onClick={handleNext}
              variant="outline"
              className="gap-2"
            >
              {isLast ? 'Go to Styling' : 'Next'}
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
