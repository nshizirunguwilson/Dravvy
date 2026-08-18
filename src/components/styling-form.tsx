'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { Check } from 'lucide-react'

import { useResumeStore } from '@/store/useResumeStore'
import type { ResumeStyle } from '@/types/resume'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
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
  { value: 'montserrat', label: 'Montserrat' },
  { value: 'outfit', label: 'Outfit' },
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

const themeHints: Record<ResumeStyle['theme'], string> = {
  modern: 'Centred header, accent section headings, rule above each heading.',
  classic: 'Centred header with the name in capitals, ink headings, rule under each heading.',
  minimal: 'Left-aligned header, small grey headings with wide tracking, short rule.',
}

const presetColors: { value: string; name: string }[] = [
  { value: '#0F172A', name: 'Slate' },
  { value: '#1f2937', name: 'Graphite' },
  { value: '#1e3a8a', name: 'Indigo' },
  { value: '#2563EB', name: 'Blue' },
  { value: '#0e7490', name: 'Teal' },
  { value: '#15803d', name: 'Forest' },
  { value: '#9a3412', name: 'Sienna' },
  { value: '#7c2d12', name: 'Burgundy' },
  { value: '#7c3aed', name: 'Violet' },
]

export function StylingForm() {
  const style = useResumeStore(s => s.style)
  const updateStyle = useResumeStore(s => s.updateStyle)
  const [draft, setDraft] = React.useState<ResumeStyle>(style)
  const [saving, setSaving] = React.useState(false)
  const customColourId = React.useId()

  React.useEffect(() => setDraft(style), [style])

  const update = (patch: Partial<ResumeStyle>) => setDraft(c => ({ ...c, ...patch }))

  const handleSave = () => {
    setSaving(true)
    updateStyle(draft)
    toast.success('Styling saved.')
    setTimeout(() => setSaving(false), 200)
  }

  const dirty = JSON.stringify(draft) !== JSON.stringify(style)

  return (
    <div className="space-y-8">
      <p className="text-[14px] text-slate-7">
        Each choice is reflected in the live preview, the PDF, and the DOCX.
      </p>

      <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2">
        <Field label="Theme" hint={themeHints[draft.theme] ?? themeHints.modern}>
          {id => (
            <Select
              value={draft.theme}
              onValueChange={v => update({ theme: v as ResumeStyle['theme'] })}
            >
              <SelectTrigger id={id}>
                <SelectValue placeholder="Select a theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="modern">Modern</SelectItem>
                <SelectItem value="classic">Classic</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
              </SelectContent>
            </Select>
          )}
        </Field>

        <Field
          label="Typeface"
          hint={
            serifFonts.some(f => f.value === draft.font)
              ? 'A serif face. The PDF embeds Times, the standard serif every reader can render.'
              : 'A sans-serif face. The PDF embeds Helvetica, the standard sans every reader can render.'
          }
        >
          {id => (
            <Select value={draft.font} onValueChange={v => update({ font: v })}>
              <SelectTrigger id={id}>
                <SelectValue placeholder="Select a typeface" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Serif</SelectLabel>
                  {serifFonts.map(f => (
                    <SelectItem key={f.value} value={f.value}>
                      <span style={{ fontFamily: f.value }}>{f.label}</span>
                    </SelectItem>
                  ))}
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Sans-serif</SelectLabel>
                  {sansSerifFonts.map(f => (
                    <SelectItem key={f.value} value={f.value}>
                      <span style={{ fontFamily: f.value }}>{f.label}</span>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        </Field>

        <Field label="Body size">
          {id => (
            <Select
              value={draft.fontSize}
              onValueChange={v => update({ fontSize: v as ResumeStyle['fontSize'] })}
            >
              <SelectTrigger id={id}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sizes.map(s => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </Field>

        <Field label="Section spacing">
          {id => (
            <Select
              value={draft.spacing}
              onValueChange={v => update({ spacing: v as ResumeStyle['spacing'] })}
            >
              <SelectTrigger id={id}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sizes.map(s => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </Field>

        <Field label="Separator">
          {id => (
            <Select
              value={draft.separator}
              onValueChange={v => update({ separator: v as ResumeStyle['separator'] })}
            >
              <SelectTrigger id={id}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {separatorTypes.map(s => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </Field>

        <Field label="Date format">
          {id => (
            <Select
              value={draft.dateFormat}
              onValueChange={v => update({ dateFormat: v as ResumeStyle['dateFormat'] })}
            >
              <SelectTrigger id={id}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dateFormats.map(d => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </Field>
      </div>

      {/* Accent, preset palette + custom */}
      <Field label="Accent colour">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
          <div className="flex flex-wrap gap-2">
            {presetColors.map(c => {
              const selected = draft.color.toLowerCase() === c.value.toLowerCase()
              return (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => update({ color: c.value })}
                  title={c.name}
                  aria-label={`Use ${c.name}`}
                  className={cn(
                    'group relative flex h-10 w-10 coarse:h-11 coarse:w-11 items-center justify-center rounded-lg border-2 transition-transform hover:-translate-y-0.5',
                    selected ? 'border-slate-12 shadow-sm' : 'border-transparent'
                  )}
                  style={{ backgroundColor: c.value }}
                >
                  {selected && <Check className="h-4 w-4 text-white" strokeWidth={3} />}
                </button>
              )
            })}
          </div>
          <div className="flex items-center gap-3 rounded-md border border-line bg-surface-2/40 px-3 py-2">
            <Label htmlFor={customColourId} className="text-[13px] font-medium text-slate-7">
              Custom
            </Label>
            <Input
              id={customColourId}
              type="color"
              value={draft.color}
              onChange={e => update({ color: e.target.value })}
            />
            <span className="text-[13px] font-medium text-slate-9 num-tabular">
              {draft.color.toUpperCase()}
            </span>
          </div>
        </div>
      </Field>

      {/* What the resume shows */}
      <fieldset className="space-y-4 border-t border-line pt-6">
        <legend className="sr-only">What the resume shows</legend>
        <Toggle
          label="Show profile links"
          hint="LinkedIn, GitHub and your portfolio in the contact line."
          checked={draft.showLinks !== false}
          onChange={(showLinks) => update({ showLinks })}
        />
        <Toggle
          label="Show language proficiency"
          hint={'Writes "English, native" instead of just "English".'}
          checked={draft.showSkillProficiency !== false}
          onChange={(showSkillProficiency) => update({ showSkillProficiency })}
        />
      </fieldset>

      {/* Save bar */}
      <div className="flex items-center justify-between gap-4 border-t border-line pt-6">
        <p className="text-[14px] text-slate-7">
          {dirty ? 'You have unsaved styling changes.' : 'Styling is up to date.'}
        </p>
        <Button type="button" onClick={handleSave} disabled={!dirty || saving} variant="default">
          {saving ? 'Saving…' : 'Save styling'}
        </Button>
      </div>
    </div>
  )
}

/**
 * A labelled field. The label is bound to whatever control it names, so screen
 * readers announce "Typeface, combo box" rather than an anonymous button. The
 * child is given the generated id through a render prop.
 */
/** A labelled switch, bound so the label reads out with the control. */
function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string
  hint: string
  checked: boolean
  onChange: (next: boolean) => void
}) {
  const id = React.useId()
  const hintId = `${id}-hint`
  return (
    <div className="flex items-start justify-between gap-6">
      <div className="min-w-0">
        <Label htmlFor={id}>{label}</Label>
        <p id={hintId} className="mt-1 text-[12px] leading-[1.5] text-slate-7">
          {hint}
        </p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} aria-describedby={hintId} />
    </div>
  )
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode | ((id: string) => React.ReactNode)
}) {
  const id = React.useId()
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {typeof children === 'function' ? children(id) : children}
      {hint && <p className="text-[12px] leading-[1.5] text-slate-7">{hint}</p>}
    </div>
  )
}
