'use client'

import * as React from 'react'
import { saveAs } from 'file-saver'
import { motion, useReducedMotion } from 'framer-motion'
import { toast } from 'sonner'
import { FileDown } from 'lucide-react'

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

  React.useEffect(() => {
    if (!filename && data.contact.fullName) {
      setFilename(`${slugify(data.contact.fullName)}-resume`)
    }
  }, [data.contact.fullName, filename])

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
    <div className="grid grid-cols-12 gap-x-10 gap-y-12">
      <aside className="col-span-12 lg:col-span-3">
        <p className="font-mono text-spec uppercase tracking-[0.18em] text-ink-6">Imprint</p>
        <p className="mt-4 max-w-xs text-caption italic text-ink-7">
          PDF for printing or attaching to applications. DOCX for editing in Word, Pages, or
          Google Docs.
        </p>
      </aside>

      <div className="col-span-12 space-y-10 lg:col-span-9">
        {/* Filename */}
        <div className="border-b border-rule pb-6">
          <Label className="mb-3">File name</Label>
          <Input
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder={`${slugify(data.contact.fullName || 'your-name')}-resume`}
          />
          <p className="mt-3 text-caption italic text-ink-7">
            The format extension is added automatically.
          </p>
        </div>

        {/* Format choice — two editorial plates */}
        <div>
          <Label className="mb-4">Format</Label>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FormatPlate
              active={format === 'pdf'}
              onClick={() => setFormat('pdf')}
              folio="i"
              title="PDF"
              tagline="A printable A4 facsimile"
              detail="Pixel-exact to the preview. Recommended for online application portals."
            />
            <FormatPlate
              active={format === 'docx'}
              onClick={() => setFormat('docx')}
              folio="ii"
              title="DOCX"
              tagline="An editable manuscript"
              detail="Opens cleanly in Microsoft Word, Pages, and Google Docs for downstream edits."
            />
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-between gap-6 border-t border-rule pt-7"
        >
          <p className="font-mono text-spec uppercase tracking-[0.14em] text-ink-6">
            Ready · <span className="text-ink-9">{format.toUpperCase()}</span>
          </p>
          <Button
            type="button"
            onClick={handleExport}
            disabled={loading || !data.contact.fullName}
            variant="default"
            size="lg"
            className="min-w-[220px] gap-3"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <motion.span
                  className="h-3.5 w-3.5 rounded-full border border-paper/30 border-t-paper"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                Setting type…
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
          <p className="text-caption italic text-ink-7">
            Add your full name in <span className="not-italic font-medium">Basic information</span>{' '}
            to enable export.
          </p>
        )}
      </div>
    </div>
  )
}

function FormatPlate({
  active,
  onClick,
  folio,
  title,
  tagline,
  detail,
}: {
  active: boolean
  onClick: () => void
  folio: string
  title: string
  tagline: string
  detail: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group relative rounded-md border px-6 py-6 text-left transition-all duration-200',
        active
          ? 'border-ink-12 bg-page shadow-page'
          : 'border-rule bg-page hover:border-rule-strong hover:shadow-paper',
      )}
    >
      <div className="flex items-baseline justify-between">
        <span
          className={cn(
            'font-mono text-spec uppercase tracking-[0.18em] num-tabular',
            active ? 'text-ink-12' : 'text-ink-6',
          )}
        >
          Plate {folio}
        </span>
        <span
          aria-hidden
          className={cn(
            'h-1.5 w-1.5 rounded-full transition-colors',
            active ? 'bg-ink-12' : 'bg-rule',
          )}
        />
      </div>
      <h3 className="mt-6 font-display text-h3 font-medium leading-none tracking-tight text-ink-12">
        {title}
      </h3>
      <p className="mt-2 text-caption italic text-ink-7">{tagline}</p>
      <p className="mt-5 max-w-xs text-caption text-ink-9">{detail}</p>
    </button>
  )
}
