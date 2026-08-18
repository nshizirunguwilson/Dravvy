'use client'

import * as React from 'react'
import { saveAs } from 'file-saver'
import { motion, useReducedMotion } from 'framer-motion'
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
  const filenameId = React.useId()
  const formatLabelId = React.useId()
  const reduce = useReducedMotion()

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

  // Seed the filename once. Re-seeding whenever the box is empty meant you
  // could never clear it to type your own: it refilled on the next keystroke.
  const seeded = React.useRef(false)
  React.useEffect(() => {
    if (seeded.current || !data.contact.fullName) return
    seeded.current = true
    setFilename(`${slugify(data.contact.fullName)}-resume`)
  }, [data.contact.fullName])

  if (!hydrated) return null

  const handleExport = async () => {
    setLoading(true)
    try {
      const safeName = (filename.trim() || `${slugify(data.contact.fullName || 'resume')}-resume`).replace(
        /\.(pdf|docx)$/i,
        '',
      )

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
      toast.success(`Exported as ${format.toUpperCase()}`)
    } catch (err) {
      console.error('Export failed:', err)
      toast.error(err instanceof Error ? err.message : 'Export failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Filename */}
      <div className="space-y-2">
        <Label htmlFor={filenameId}>File name</Label>
        <Input
          id={filenameId}
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          placeholder={`${slugify(data.contact.fullName || 'your-name')}-resume`}
        />
        <p className="text-[13px] text-slate-7">
          The format extension is added automatically.
        </p>
      </div>

      {/* Format choice */}
      <div className="space-y-3">
        <Label id={formatLabelId}>Export format</Label>
        <div role="radiogroup" aria-labelledby={formatLabelId} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormatCard
            active={format === 'pdf'}
            onClick={() => setFormat('pdf')}
            icon={<FileText className="h-5 w-5" />}
            title="PDF"
            tagline="Print-ready A4"
            detail="Pixel-exact to the preview. Recommended for online applications."
          />
          <FormatCard
            active={format === 'docx'}
            onClick={() => setFormat('docx')}
            icon={<FileType2 className="h-5 w-5" />}
            title="DOCX"
            tagline="Editable manuscript"
            detail="Opens cleanly in Microsoft Word, Pages, and Google Docs."
          />
        </div>
      </div>

      {/* CTA */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6"
      >
        <p className="text-[14px] text-slate-7">
          Ready to download as <span className="font-semibold text-slate-12">{format.toUpperCase()}</span>.
        </p>
        <Button
          type="button"
          onClick={handleExport}
          disabled={loading || !data.contact.fullName}
          variant="default"
          size="lg"
          className="min-w-[200px]"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <motion.span
                className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              Generating…
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <FileDown className="h-4 w-4" />
              Download {format.toUpperCase()}
            </span>
          )}
        </Button>
      </motion.div>
      {!data.contact.fullName && (
        <p className="text-[13px] text-slate-7">
          Add your full name in <span className="font-medium text-slate-12">Basic information</span> to enable export.
        </p>
      )}
    </div>
  )
}

function FormatCard({
  active,
  onClick,
  icon,
  title,
  tagline,
  detail,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  title: string
  tagline: string
  detail: string
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={cn(
        'group relative rounded-xl border bg-surface px-5 py-5 text-left transition-all duration-150',
        active
          ? 'border-brand shadow-sm ring-2 ring-brand/30'
          : 'border-line shadow-xs hover:border-line-strong hover:shadow-sm',
      )}
    >
      <div
        className={cn(
          'mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
          active ? 'bg-brand text-brand-fg' : 'bg-brand-soft text-brand-ink',
        )}
      >
        {icon}
      </div>
      <h3 className="text-[16px] font-semibold text-slate-12">{title}</h3>
      <p className="mt-0.5 text-[13px] font-medium text-brand">{tagline}</p>
      <p className="mt-3 max-w-xs text-[13px] leading-[1.5] text-slate-7">{detail}</p>
    </button>
  )
}
