'use client'

import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Check } from 'lucide-react'

import { useResumeStore } from '@/store/useResumeStore'
import { useUIStore } from '@/store/useUIStore'
import { Progress } from '@/components/ui/progress'
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
      <div className="rounded-xl border border-line bg-surface p-5 shadow-sm">
        {/* Header */}
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-[14px] font-semibold text-slate-12">Sections</p>
          <p className="text-[13px] text-slate-7 num-tabular">
            <span className="font-semibold text-slate-12">{completedCount}</span> of {sections.length}
          </p>
        </div>

        <Progress value={progress} className="mt-3" />

        {/* The list */}
        <ol className="mt-5 space-y-1">
          {sections.map((section, index) => {
            const completed = isCompleted(section.id)
            const active = index === activeSection
            return (
              <li key={section.id}>
                <motion.button
                  type="button"
                  onClick={() => setActiveSection(index)}
                  whileTap={reduce ? undefined : { scale: 0.985 }}
                  className={cn(
                    'group flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left text-[14px] transition-colors',
                    active
                      ? 'bg-brand-soft text-brand-ink'
                      : 'text-slate-9 hover:bg-surface-2 hover:text-slate-12',
                  )}
                >
                  <Node active={active} completed={completed} index={index} />
                  <span className="flex-1 truncate font-medium">{section.label}</span>
                </motion.button>
              </li>
            )
          })}
        </ol>
      </div>
    </aside>
  )
}

function Node({
  active,
  completed,
  index,
}: {
  active: boolean
  completed: boolean
  index: number
}) {
  return (
    <span
      aria-hidden
      className={cn(
        'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition-colors num-tabular',
        completed && 'bg-brand text-white',
        !completed && active && 'border border-brand bg-surface text-brand',
        !completed && !active && 'border border-line bg-surface text-slate-7',
      )}
    >
      {completed ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : index + 1}
    </span>
  )
}

export default ProgressTracker
