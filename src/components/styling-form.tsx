'use client'

import * as React from 'react'
import { toast } from 'sonner'

import { useResumeStore } from '@/store/useResumeStore'
import type { ResumeStyle } from '@/types/resume'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

const serifFonts = [
  { value: 'times new roman', label: 'Times New Roman' },
  { value: 'georgia', label: 'Georgia' },
  { value: 'cambria', label: 'Cambria' },
  { value: 'garamond', label: 'Garamond' },
] as const

const sansSerifFonts = [
  { value: 'calibri', label: 'Calibri' },
  { value: 'helvetica', label: 'Helvetica' },
  { value: 'arial', label: 'Arial' },
  { value: 'roboto', label: 'Roboto' },
  { value: 'lato', label: 'Lato' },
  { value: 'open sans', label: 'Open Sans' },
] as const

const separatorTypes = [
  { value: 'line', label: 'Single line' },
  { value: 'double line', label: 'Double line' },
  { value: 'bold line', label: 'Bold line' },
  { value: 'no separator', label: 'No separator' },
] as const

const dateFormats = [
  { value: 'MM/YYYY', label: '01/2026' },
  { value: 'MMM YYYY', label: 'Jan 2026' },
  { value: 'MMMM YYYY', label: 'January 2026' },
] as const

const sizes = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
] as const

const presetColors: { value: string; name: string }[] = [
  { value: '#111827', name: 'Ink' },
  { value: '#1f2937', name: 'Graphite' },
  { value: '#0f172a', name: 'Midnight' },
  { value: '#1e3a8a', name: 'Indigo' },
  { value: '#0e7490', name: 'Teal' },
  { value: '#15803d', name: 'Forest' },
  { value: '#9a3412', name: 'Sienna' },
  { value: '#7c2d12', name: 'Burgundy' },
  { value: '#7c3aed', name: 'Violet' },
]

export function StylingForm() {
  const style = useResumeStore((s) => s.style)
  const updateStyle = useResumeStore((s) => s.updateStyle)
  const [draft, setDraft] = React.useState<ResumeStyle>(style)
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => setDraft(style), [style])

  const update = (patch: Partial<ResumeStyle>) => setDraft((c) => ({ ...c, ...patch }))

  const handleSave = () => {
    setSaving(true)
    updateStyle(draft)
    toast.success('Styling saved. Open the preview to see it applied.')
    setTimeout(() => setSaving(false), 200)
  }

  const dirty = JSON.stringify(draft) !== JSON.stringify(style)

  return (
    <div className="grid grid-cols-12 gap-x-10 gap-y-12">
      {/* Left side label rail */}
      <aside className="col-span-12 lg:col-span-3">
        <p className="font-mono text-spec uppercase tracking-[0.18em] text-ink-6">
          Specifications
        </p>
        <p className="mt-4 max-w-xs text-caption italic text-ink-7">
          Each choice is reflected in the live preview, the PDF, and the DOCX.
        </p>
      </aside>

      {/* Spec sheet */}
      <div className="col-span-12 lg:col-span-9">
        <dl className="border-y border-rule">
          <Spec label="Theme">
            <Select
              value={draft.theme}
              onValueChange={(v) => update({ theme: v as ResumeStyle['theme'] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="modern">Modern</SelectItem>
                <SelectItem value="classic">Classic</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
              </SelectContent>
            </Select>
          </Spec>

          <Spec label="Typeface">
            <Select value={draft.font} onValueChange={(v) => update({ font: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a typeface" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Serif</SelectLabel>
                  {serifFonts.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      <span style={{ fontFamily: f.value }}>{f.label}</span>
                    </SelectItem>
                  ))}
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Sans-serif</SelectLabel>
                  {sansSerifFonts.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      <span style={{ fontFamily: f.value }}>{f.label}</span>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Spec>

          <Spec label="Body size">
            <Select
              value={draft.fontSize}
              onValueChange={(v) => update({ fontSize: v as ResumeStyle['fontSize'] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sizes.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Spec>

          <Spec label="Section rhythm">
            <Select
              value={draft.spacing}
              onValueChange={(v) => update({ spacing: v as ResumeStyle['spacing'] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sizes.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Spec>

          <Spec label="Separator">
            <Select
              value={draft.separator}
              onValueChange={(v) => update({ separator: v as ResumeStyle['separator'] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {separatorTypes.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Spec>

          <Spec label="Date format">
            <Select
              value={draft.dateFormat}
              onValueChange={(v) => update({ dateFormat: v as ResumeStyle['dateFormat'] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dateFormats.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Spec>

          {/* Accent — preset palette + custom */}
          <Spec label="Accent">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex flex-wrap gap-2">
                {presetColors.map((c) => {
                  const selected = draft.color.toLowerCase() === c.value.toLowerCase()
                  return (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => update({ color: c.value })}
                      title={c.name}
                      aria-label={`Use ${c.name}`}
                      className={cn(
                        'group relative h-7 w-7 rounded-sm transition-transform hover:-translate-y-0.5',
                        selected ? 'ring-1 ring-ink-12 ring-offset-2 ring-offset-paper' : '',
                      )}
                      style={{ backgroundColor: c.value }}
                    />
                  )
                })}
              </div>
              <div className="ml-auto flex items-center gap-3">
                <span className="font-mono text-spec uppercase tracking-[0.14em] text-ink-6">
                  Custom
                </span>
                <Input
                  type="color"
                  value={draft.color}
                  onChange={(e) => update({ color: e.target.value })}
                />
                <span className="font-mono text-spec text-ink-9 num-tabular">
                  {draft.color.toUpperCase()}
                </span>
              </div>
            </div>
          </Spec>
        </dl>

        {/* Save bar */}
        <div className="mt-10 flex items-center justify-between gap-4">
          <p className="text-caption italic text-ink-7">
            {dirty ? 'You have unsaved styling changes.' : 'Styling is up to date.'}
          </p>
          <Button type="button" onClick={handleSave} disabled={!dirty || saving} variant="default">
            {saving ? 'Saving…' : 'Save styling'}
          </Button>
        </div>
      </div>
    </div>
  )
}

/**
 * Editorial spec row — left column carries the label (mono, small);
 * right column holds the control. Hairline below each row, consistent
 * with the printed spec-sheet feel.
 */
function Spec({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-12 items-center gap-6 border-b border-rule py-5 last:border-b-0">
      <Label className="col-span-12 mb-0 sm:col-span-3">{label}</Label>
      <div className="col-span-12 sm:col-span-9">{children}</div>
    </div>
  )
}
