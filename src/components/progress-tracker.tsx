'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

import { useResumeStore } from '@/store/useResumeStore'
import { useUIStore } from '@/store/useUIStore'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

const sections = [
  { id: 'basic', label: 'Basic Information' },
  { id: 'work', label: 'Work Experience' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'awards', label: 'Awards' },
  { id: 'projects', label: 'Projects' },
  { id: 'languages', label: 'Languages' },
  { id: 'references', label: 'References' },
] as const

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

  const isCompleted = (id: typeof sections[number]['id']): boolean => {
    switch (id) {
      case 'basic':
        return Boolean(
          contact.fullName && contact.email && contact.phone && contact.location && summary
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

  const getStatus = (index: number) => {
    if (index === activeSection) return 'active'
    if (isCompleted(sections[index].id)) return 'completed'
    return 'pending'
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">Resume Progress</h2>
        <span className="text-sm font-medium text-gray-600">{progress}%</span>
      </div>
      <Progress value={progress} className="h-1.5" />

      <div className="mt-6 grid grid-cols-3 gap-y-4 sm:grid-cols-5 lg:grid-cols-9">
        {sections.map((section, index) => {
          const status = getStatus(index)
          return (
            <motion.button
              type="button"
              key={section.id}
              className="group flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.04 }}
              onClick={() => setActiveSection(index)}
            >
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full border transition-colors',
                  status === 'completed' && 'border-gray-900 bg-gray-900 text-white',
                  status === 'active' && 'border-gray-900 bg-white text-gray-900 ring-2 ring-gray-900',
                  status === 'pending' && 'border-gray-300 bg-white text-gray-500 group-hover:border-gray-400'
                )}
              >
                {status === 'completed' ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="text-xs font-semibold">{index + 1}</span>
                )}
              </div>
              <p
                className={cn(
                  'mt-2 max-w-[7rem] text-[11px] font-medium leading-tight',
                  status === 'completed' && 'text-gray-900',
                  status === 'active' && 'text-gray-900',
                  status === 'pending' && 'text-gray-500'
                )}
              >
                {section.label}
              </p>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
