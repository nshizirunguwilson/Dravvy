'use client'

import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Check } from 'lucide-react'

import { useResumeStore } from '@/store/useResumeStore'
import { useUIStore } from '@/store/useUIStore'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

const sections = [
  { id: 'basic', label: 'Basic information', short: 'Basics' },
  { id: 'work', label: 'Work experience', short: 'Work' },
  { id: 'education', label: 'Education', short: 'School' },
  { id: 'skills', label: 'Skills', short: 'Skills' },
  { id: 'certifications', label: 'Certifications', short: 'Certs' },
  { id: 'awards', label: 'Awards', short: 'Awards' },
  { id: 'projects', label: 'Projects', short: 'Projects' },
  { id: 'languages', label: 'Languages', short: 'Langs' },
  { id: 'references', label: 'References', short: 'Refs' },
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

  // Auto-scroll the active pill into view on mobile when section changes
  const scrollerRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    const node = scrollerRef.current?.querySelector<HTMLElement>(
      `[data-section-index="${activeSection}"]`,
    )
    node?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [activeSection])

  return (
    <>
      {/* Mobile + tablet: horizontal scrollable pill nav */}
      <aside aria-label="Resume progress" className="lg:hidden">
        <div className="rounded-xl border border-line bg-surface p-4 shadow-sm">
          <div className="mb-3 flex items-baseline justify-between gap-4">
            <p className="text-[14px] font-semibold text-slate-12">Sections</p>
            <p className="text-[13px] text-slate-7 num-tabular">
              <span className="font-semibold text-slate-12">{completedCount}</span> of{' '}
              {sections.length}
            </p>
          </div>
          <Progress value={progress} className="mb-4" />

          <div
            ref={scrollerRef}
            className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {sections.map((section, index) => {
              const completed = isCompleted(section.id)
              const active = index === activeSection
              return (
                <motion.button
                  key={section.id}
                  data-section-index={index}
                  type="button"
                  onClick={() => setActiveSection(index)}
                  whileTap={reduce ? undefined : { scale: 0.97 }}
                  className={cn(
                    'flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors',
                    active
                      ? 'border-brand bg-brand-soft text-brand-ink'
                      : completed
                        ? 'border-line bg-surface text-slate-9 hover:bg-surface-2'
                        : 'border-line bg-surface text-slate-7 hover:bg-surface-2',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold num-tabular',
                      completed && 'bg-brand text-brand-fg',
                      !completed && active && 'border border-brand bg-surface text-brand',
                      !completed && !active && 'border border-line bg-surface text-slate-7',
                    )}
                  >
                    {completed ? <Check className="h-3 w-3" strokeWidth={3} /> : index + 1}
                  </span>
                  {section.label}
                </motion.button>
              )
            })}
          </div>
        </div>
      </aside>

      {/* Desktop: full vertical rail */}
      <aside aria-label="Resume progress" className="hidden lg:sticky lg:top-24 lg:block">
        <div className="rounded-xl border border-line bg-surface p-5 shadow-sm">
          <div className="flex items-baseline justify-between gap-4">
            <p className="text-[14px] font-semibold text-slate-12">Sections</p>
            <p className="text-[13px] text-slate-7 num-tabular">
              <span className="font-semibold text-slate-12">{completedCount}</span> of{' '}
              {sections.length}
            </p>
          </div>

          <Progress value={progress} className="mt-3" />

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
    </>
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
        completed && 'bg-brand text-brand-fg',
        !completed && active && 'border border-brand bg-surface text-brand',
        !completed && !active && 'border border-line bg-surface text-slate-7',
      )}
    >
      {completed ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : index + 1}
    </span>
  )
}

export default ProgressTracker
