'use client'

import { ResumeForm } from '@/components/resume-form'
import { ProgressTracker } from '@/components/progress-tracker'
import { Button } from '@/components/ui/button'
import { useUIStore } from '@/store/useUIStore'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import React from 'react'


type Section = {
  id: 'basic' | 'work' | 'education' | 'skills' | 'certifications' | 'projects' | 'languages' | 'references'
  label: string
}

const sections: Section[] = [
  { id: 'basic', label: 'Basic Information' },
  { id: 'work', label: 'Work Experience' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'projects', label: 'Projects' },
  { id: 'languages', label: 'Languages' },
  { id: 'references', label: 'References' },
]

export default function CreatePage() {
  const activeSection = useUIStore((state) => state.activeSection)
  const setActiveSection = useUIStore((state) => state.setActiveSection)

  const [hasSavedReferences, setHasSavedReferences] = React.useState(false)
  const router = useRouter()

  const handleNext = () => {
    if (activeSection === sections.length - 1) {
      if (hasSavedReferences) {
        router.push('/settings')
      }
    } else {
      setActiveSection(activeSection + 1)
    }
  }

  const handlePrevious = () => {
    if (activeSection > 0) {
      setActiveSection(activeSection - 1)
    }
  }

  return (
    <div className="mx-auto px-[5%] py-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900">Create Your Resume</h1>
        <p className="mt-2 text-lg text-gray-600">
          Fill in your information step by step
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8">
        <div className="space-y-8">
          <ProgressTracker />
          <motion.div 
            className="p-6 bg-white rounded-lg shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              {sections[activeSection].label}
            </h2>
            <ResumeForm 
              section={sections[activeSection].id} 
              onReferencesSaved={() => setHasSavedReferences(true)}
            />
            
            <div className="flex justify-between mt-6">
              <Button
                onClick={handlePrevious}
                disabled={activeSection === 0}
                variant="outline"
                className="relative overflow-hidden group px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <ChevronLeftIcon className="relative z-10 w-5 h-5" />
                <span className="relative z-10">Previous</span>
                <span className="absolute inset-0 w-0 transition-all duration-300 bg-blue-600 group-hover:w-full"></span>
              </Button>
              <Button
                onClick={handleNext}
                variant="outline"
                disabled={activeSection === sections.length - 1 && !hasSavedReferences}
                className="relative overflow-hidden group px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span className="relative z-10">
                  {activeSection === sections.length - 1 ? 'Go to Settings' : 'Next'}
                </span>
                <ChevronRightIcon className="relative z-10 w-5 h-5" />
                <span className="absolute inset-0 w-0 transition-all duration-300 bg-blue-600 group-hover:w-full"></span>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}