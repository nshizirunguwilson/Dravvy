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
  { value: 'line', label: 'Single Line' },
  { value: 'double line', label: 'Double Line' },
  { value: 'bold line', label: 'Bold Line' },
  { value: 'no separator', label: 'No Separator' },
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

const presetColors = [
  '#111827',
  '#1f2937',
  '#0f172a',
  '#1e3a8a',
  '#0e7490',
  '#15803d',
  '#9a3412',
  '#7c2d12',
  '#7c3aed',
]

export function StylingForm() {
  const style = useResumeStore((s) => s.style)
  const updateStyle = useResumeStore((s) => s.updateStyle)
  const [draft, setDraft] = React.useState<ResumeStyle>(style)
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    setDraft(style)
  }, [style])

  const update = (patch: Partial<ResumeStyle>) => setDraft((current) => ({ ...current, ...patch }))

  const handleSave = () => {
    setSaving(true)
    updateStyle(draft)
    toast.success('Styles saved. Open the Preview tab to see them applied.')
    setTimeout(() => setSaving(false), 200)
  }

  const dirty = JSON.stringify(draft) !== JSON.stringify(style)

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Field label="Theme">
          <Select
            value={draft.theme}
            onValueChange={(value) => update({ theme: value as ResumeStyle['theme'] })}
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
        </Field>

        <Field label="Font">
          <Select value={draft.font} onValueChange={(value) => update({ font: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select a font" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Serif</SelectLabel>
                {serifFonts.map((f) => (
                  <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                ))}
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Sans-Serif</SelectLabel>
                {sansSerifFonts.map((f) => (
                  <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>

        <Field label="Font Size">
          <Select
            value={draft.fontSize}
            onValueChange={(value) => update({ fontSize: value as ResumeStyle['fontSize'] })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sizes.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Section Spacing">
          <Select
            value={draft.spacing}
            onValueChange={(value) => update({ spacing: value as ResumeStyle['spacing'] })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sizes.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Section Separator">
          <Select
            value={draft.separator}
            onValueChange={(value) => update({ separator: value as ResumeStyle['separator'] })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {separatorTypes.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Date Format">
          <Select
            value={draft.dateFormat}
            onValueChange={(value) => update({ dateFormat: value as ResumeStyle['dateFormat'] })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {dateFormats.map((d) => (
                <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field label="Accent Color">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            type="color"
            value={draft.color}
            onChange={(e) => update({ color: e.target.value })}
            className="h-10 w-16 cursor-pointer p-1"
          />
          <div className="flex flex-wrap gap-2">
            {presetColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => update({ color })}
                className={cn(
                  'h-8 w-8 rounded-full border-2 transition',
                  draft.color.toLowerCase() === color.toLowerCase()
                    ? 'border-gray-900 ring-2 ring-gray-200'
                    : 'border-white shadow-sm hover:scale-105'
                )}
                style={{ backgroundColor: color }}
                aria-label={`Use color ${color}`}
              />
            ))}
          </div>
        </div>
      </Field>

      <div className="flex items-center justify-between border-t border-gray-100 pt-6">
        <p className="text-sm text-gray-500">
          {dirty ? 'You have unsaved styling changes.' : 'Styling is up to date.'}
        </p>
        <Button
          type="button"
          onClick={handleSave}
          disabled={!dirty || saving}
          className="bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save Styling'}
        </Button>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-2 block text-sm font-medium text-gray-700">{label}</Label>
      {children}
    </div>
  )
}
