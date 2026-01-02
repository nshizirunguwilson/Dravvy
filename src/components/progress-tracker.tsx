'use client'

import { useResumeStore } from '@/store/useResumeStore'
import { useUIStore } from '@/store/useUIStore'
import { calculateProgress, getProgressMessage } from '@/lib/utils/progress'
import { Progress } from '@/components/ui/progress'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import type { ResumeData } from '@/types/resume'
import React from 'react'

const sections = [
  { id: 'basic', label: 'Basic Information' },
  { id: 'work', label: 'Work Experience' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'projects', label: 'Projects' },
  { id: 'languages', label: 'Languages' },
  { id: 'references', label: 'References' }
]

export function ProgressTracker() {
  const contact = useResumeStore((state: { contact: ResumeData['contact'] }) => state.contact)
  const summary = useResumeStore((state: { summary: string }) => state.summary)
  const experience = useResumeStore((state: { experience: ResumeData['experience'] }) => state.experience)
  const education = useResumeStore((state: { education: ResumeData['education'] }) => state.education)
  const skills = useResumeStore((state: { skills: ResumeData['skills'] }) => state.skills)
  const projects = useResumeStore((state: { projects: ResumeData['projects'] }) => state.projects)
  const certifications = useResumeStore((state: { certifications: ResumeData['certifications'] }) => state.certifications)
  const languages = useResumeStore((state: { languages: ResumeData['languages'] }) => state.languages)
  const references = useResumeStore((state: { references: ResumeData['references'] }) => state.references)
  
  const activeSection = useUIStore((state) => state.activeSection)
  const setActiveSection = useUIStore((state) => state.setActiveSection)


  const resumeData = {
    contact,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    languages,
    references
  }

  const progress = calculateProgress(resumeData)
  const message = getProgressMessage(progress)

  const handleStepClick = (index: number) => {
    try {
      setActiveSection(index);
    } catch (error) {
      console.error('Failed to set active section:', error);
    }
  }

  const isSectionCompleted = (sectionId: string) => {

    
    switch (sectionId) {
      case 'basic':
        return !!contact?.fullName && !!contact?.email && !!contact?.phone && !!contact?.location;
      case 'work':
        return (experience?.length || 0) > 0;
      case 'education':
        return (education?.length || 0) > 0;
      case 'skills':
        return (skills?.length || 0) > 0;
      case 'projects':
        return (projects?.length || 0) > 0;
      case 'certifications':
        return (certifications?.length || 0) > 0;
      case 'languages':
        return (languages?.length || 0) > 0;
      case 'references':
        return (references?.length || 0) > 0;
      default:
        return false;
    }
  }

  const getStepStatus = (index: number) => {
    if (index === activeSection) return 'active'
    if (isSectionCompleted(sections[index].id)) return 'completed'
    return 'pending'
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Resume Progress</h2>
          <span className="text-sm font-medium text-gray-600">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="relative">
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200" />
          <div className="relative flex justify-between">
            {sections.map((section, index) => {
              const status = getStepStatus(index)
              return (
                <motion.div
                  key={section.id}
                  className="flex flex-col items-center cursor-pointer group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  onClick={() => handleStepClick(index)}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center mb-2 relative z-10 transition-transform duration-200 ease-in-out transform group-hover:scale-110",
                    status === 'completed' && "bg-green-500 group-hover:bg-green-600",
                    status === 'active' && "bg-blue-500 group-hover:bg-blue-600",
                    status === 'pending' && "bg-gray-300 group-hover:bg-gray-400"
                  )}>
                    {status === 'completed' ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <span className={cn(
                        "text-sm font-medium",
                        status === 'active' ? "text-white" : "text-gray-600"
                      )}>
                        {index + 1}
                      </span>
                    )}
                  </div>
                  <p className={cn(
                    "text-xs font-medium text-center max-w-[100px] transition-colors duration-200",
                    status === 'completed' && "text-green-600 group-hover:text-green-700",
                    status === 'active' && "text-blue-600 group-hover:text-blue-700",
                    status === 'pending' && "text-gray-600 group-hover:text-gray-700"
                  )}>
                    {section.label}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
        <p className="text-sm text-gray-600">{message}</p>
      </div>
    </div>
  )
}