'use client'

import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Check } from 'lucide-react'

import { useResumeStore } from '@/store/useResumeStore'
import { useUIStore } from '@/store/useUIStore'
import { cn } from '@/lib/utils'

const sections = [
  { id: 'basic', label: 'Basic information' },
  { id: 'work', label: 'Work experience' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'awards', label: 'Awards' },
  { id: 'projects', label: 'Projects' },
  { id: 'languages', label: 'Languages' },
  { id: 'references', label: 'References' },
] as const

type SectionId = (typeof sections)[number]['id']

export function ProgressTracker() {
  const contact = useResumeStore((s) => s.contact)
  const summary = useResumeStore((s) => s.summary)
  const experience = useResumeStore((s) => s.experience)
  const education = useResumeStore((s) => s.education)
  const skills = useResumeStore((s) => s.skills)
  const projects = useResumeStore((s) => s.projects)
  const certifications = useResumeStore((s) => s.certifications)
  const awards = useResumeStore((s) => s.awards)
  const languages = useResumeStore((s) => s.languages)
  const references = useResumeStore((s) => s.references)
  const referencesMode = useResumeStore((s) => s.referencesMode)

  const activeSection = useUIStore((s) => s.activeSection)
  const setActiveSection = useUIStore((s) => s.setActiveSection)
  const reduce = useReducedMotion()

  const isCompleted = (id: SectionId): boolean => {
    switch (id) {
      case 'basic':
        return Boolean(
          contact.fullName && contact.email && contact.phone && contact.location && summary,
        )
      case 'work':
        return experience.length > 0
      case 'education':
        return education.length > 0
      case 'skills':
        return skills.length > 0
      case 'certifications':
        return certifications.length > 0
      case 'awards':
        return awards.length > 0
      case 'projects':
        return projects.length > 0
      case 'languages':
        return languages.length > 0
      case 'references':
        return referencesMode === 'uponRequest' || references.length > 0
    }
  }

  const completedCount = sections.filter((s) => isCompleted(s.id)).length
  const progress = Math.round((completedCount / sections.length) * 100)

  return (
    <aside aria-label="Resume progress" className="lg:sticky lg:top-24">
      {/* Header */}
      <div className="mb-7 flex items-baseline justify-between gap-4">
        <p className="font-mono text-spec uppercase tracking-[0.16em] text-ink-6">Folio</p>
        <p className="font-mono text-spec text-ink-9 num-tabular">
          <span className="text-ink-12">{String(completedCount).padStart(2, '0')}</span>
          <span className="text-ink-5"> / 09</span>
        </p>
      </div>

      {/* The rail */}
      <ol className="relative">
        {/* Connecting hairline */}
        <span
          aria-hidden
          className="absolute left-[7px] top-1 bottom-1 w-px bg-rule"
        />
        <motion.span
          aria-hidden
          className="absolute left-[7px] top-1 w-px bg-ink-12"
          initial={false}
          animate={{ height: `calc(${progress}% )` }}
          transition={{ duration: reduce ? 0 : 0.6, ease: [0.2, 0.7, 0.2, 1] }}
          style={{ originY: 0 }}
        />

        {sections.map((section, index) => {
          const completed = isCompleted(section.id)
          const active = index === activeSection
          return (
            <li key={section.id} className="relative pl-8">
              <button
                type="button"
                onClick={() => setActiveSection(index)}
                className={cn(
                  'group flex w-full items-center gap-3 py-3 text-left transition-colors',
                  active ? 'text-ink-12' : 'text-ink-7 hover:text-ink-12',
                )}
              >
                <Node active={active} completed={completed} />
                <span className="flex flex-1 items-center justify-between gap-3">
                  <span
                    className={cn(
                      'text-caption transition-colors',
                      active ? 'font-medium text-ink-12' : completed ? 'text-ink-9' : 'text-ink-7',
                    )}
                  >
                    {section.label}
                  </span>
                  <span
                    className={cn(
                      'font-mono text-spec uppercase tracking-[0.14em] num-tabular',
                      active ? 'text-ink-9' : 'text-ink-5',
                    )}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </aside>
  )
}

function Node({
  active,
  completed,
}: {
  active: boolean
  completed: boolean
}) {
  return (
    <span
      aria-hidden
      className={cn(
        'absolute left-0 top-1/2 -translate-y-1/2',
        'flex h-[16px] w-[16px] items-center justify-center rounded-full transition-all duration-200',
        completed && 'bg-ink-12 text-paper',
        active && !completed && 'bg-page ring-1 ring-ink-12',
        !active && !completed && 'bg-page ring-1 ring-rule-strong',
      )}
    >
      {completed ? (
        <Check className="h-[9px] w-[9px]" strokeWidth={3} />
      ) : (
        <span
          className={cn(
            'block h-[5px] w-[5px] rounded-full',
            active ? 'bg-ink-12' : 'bg-transparent',
          )}
        />
      )}
    </span>
  )
}

export default ProgressTracker
