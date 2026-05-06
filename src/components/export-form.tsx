'use client'

import * as React from 'react'
import { saveAs } from 'file-saver'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { FileDown, FileText, FileType2 } from 'lucide-react'

import { useResumeStore } from '@/store/useResumeStore'
import { useHydration } from '@/hooks/useHydration'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type ExportFormat = 'pdf' | 'docx'

const slugify = (raw: string) =>
  raw
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-') || 'resume'

export function ExportForm() {
  const hydrated = useHydration()
  const [format, setFormat] = React.useState<ExportFormat>('pdf')
  const [loading, setLoading] = React.useState(false)
  const [filename, setFilename] = React.useState('')

  const data = useResumeStore((s) => ({
    contact: s.contact,
    summary: s.summary,
    experience: s.experience,
    education: s.education,
    skills: s.skills,
    projects: s.projects,
    certifications: s.certifications,
    awards: s.awards,
    languages: s.languages,
    references: s.references,
    referencesMode: s.referencesMode,
    style: s.style,
  }))

  React.useEffect(() => {
    if (!filename && data.contact.fullName) {
      setFilename(`${slugify(data.contact.fullName)}-resume`)
    }
  }, [data.contact.fullName, filename])

  if (!hydrated) return null

  const handleExport = async () => {
    setLoading(true)
    try {
      const safeName = (filename.trim() || `${slugify(data.contact.fullName || 'resume')}-resume`).replace(/\.(pdf|docx)$/i, '')

      if (format === 'pdf') {
        const [{ pdf }, { ResumePDF }] = await Promise.all([
          import('@react-pdf/renderer'),
          import('./resume-pdf'),
        ])
        const blob = await pdf(<ResumePDF data={data} />).toBlob()
        saveAs(blob, `${safeName}.pdf`)
      } else {
        const { buildResumeDocxBlob } = await import('@/lib/resume-docx')
        const blob = await buildResumeDocxBlob(data)
        saveAs(blob, `${safeName}.docx`)
      }
      toast.success(`Resume exported as ${format.toUpperCase()}`)
    } catch (err) {
      console.error('Export failed:', err)
      toast.error(err instanceof Error ? err.message : 'Export failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <Label className="block text-sm font-medium text-gray-700 mb-2">File name</Label>
        <Input
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          placeholder={`${slugify(data.contact.fullName || 'your-name')}-resume`}
          className="w-full"
        />
        <p className="mt-1 text-xs text-gray-500">The chosen format extension is added automatically.</p>
      </div>

      <div>
        <Label className="block text-sm font-medium text-gray-700 mb-2">Export format</Label>
        <div className="grid grid-cols-2 gap-3">
          <FormatOption
            active={format === 'pdf'}
            onClick={() => setFormat('pdf')}
            icon={<FileText className="h-5 w-5" />}
            title="PDF"
            description="A4 document, exact layout"
          />
          <FormatOption
            active={format === 'docx'}
            onClick={() => setFormat('docx')}
            icon={<FileType2 className="h-5 w-5" />}
            title="DOCX"
            description="Editable in Word and Google Docs"
          />
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <Button
          type="button"
          onClick={handleExport}
          disabled={loading || !data.contact.fullName}
          className="w-full bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-60"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <motion.span
                className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              Generating {format.toUpperCase()}...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <FileDown className="h-4 w-4" />
              Download {format.toUpperCase()}
            </span>
          )}
        </Button>
        {!data.contact.fullName && (
          <p className="mt-2 text-center text-xs text-gray-500">Add your full name in Basic Information to enable export.</p>
        )}
      </motion.div>
    </div>
  )
}

function FormatOption({
  active,
  onClick,
  icon,
  title,
  description,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-xl border p-4 text-left transition-colors',
        active
          ? 'border-gray-900 bg-gray-900 text-white'
          : 'border-gray-200 bg-white text-gray-900 hover:border-gray-400'
      )}
    >
      <div className={cn('mb-2 flex h-9 w-9 items-center justify-center rounded-lg', active ? 'bg-white/15' : 'bg-gray-100')}>
        {icon}
      </div>
      <p className="text-sm font-semibold">{title}</p>
      <p className={cn('mt-1 text-xs', active ? 'text-white/80' : 'text-gray-500')}>{description}</p>
    </button>
  )
}
