'use client'

import { StylingForm } from '@/components/styling-form'
import { ResumePreview } from '@/components/resume-preview'
import { ExportForm } from '@/components/export-form'
import { Button } from '@/components/ui/button'
import { useUIStore } from '@/store/useUIStore'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { Toaster } from 'sonner'

type Section = {
  id: 'styling' | 'preview' | 'export'
  label: string
}

const sections: Section[] = [
  { id: 'styling', label: 'Resume Styling' },
  { id: 'preview', label: 'Resume Preview' },
  { id: 'export', label: 'Export Resume' },
]

export default function SettingsPage() {
  const activeSection = useUIStore((state) => state.activeSettingsSection)
  const setActiveSection = useUIStore((state) => state.setActiveSettingsSection)

  const handleNext = () => {
    if (activeSection < sections.length - 1) {
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
      <Toaster position="top-right" />
      
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900">Style and Export</h1>
        <p className="mt-2 text-lg text-gray-600">
          Customize your resume and export it as PDF
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8">
        <div className="space-y-8">
          <motion.div 
            className="bg-white rounded-lg shadow p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {sections[activeSection].label}
            </h2>
            
            {sections[activeSection].id === 'styling' && <StylingForm />}
            {sections[activeSection].id === 'preview' && <ResumePreview />}
            {sections[activeSection].id === 'export' && <ExportForm />}

            <div className="flex justify-between mt-6">
              <Button
                onClick={handlePrevious}
                disabled={activeSection === 0}
                variant="outline"
                className="relative overflow-hidden group px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <ChevronLeftIcon className="h-5 w-5 relative z-10" />
                <span className="relative z-10">Previous</span>
                <span className="absolute inset-0 w-0 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Button>
              <Button
                onClick={handleNext}
                disabled={activeSection === sections.length - 1}
                variant="outline"
                className="relative overflow-hidden group px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span className="relative z-10">Next</span>
                <ChevronRightIcon className="h-5 w-5 relative z-10" />
                <span className="absolute inset-0 w-0 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 