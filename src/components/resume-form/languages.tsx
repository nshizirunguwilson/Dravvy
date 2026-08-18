'use client'

import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { languageSchema } from '@/lib/validations/resume'
import { useResumeStore } from '@/store/useResumeStore'
import type { Language } from '@/types/resume'
import { Field } from './shared/field'
import { EntrySection } from './shared/entry-section'

const LEVELS: Language['proficiency'][] = [
  'native',
  'fluent',
  'proficient',
  'intermediate',
  'beginner',
  'basic',
]

export function LanguagesForm() {
  const languages = useResumeStore((s) => s.languages)
  const add = useResumeStore((s) => s.addLanguage)
  const update = useResumeStore((s) => s.updateLanguage)
  const remove = useResumeStore((s) => s.removeLanguage)
  const reorder = useResumeStore((s) => s.reorderLanguages)

  return (
    <EntrySection<Language>
      collection="languages"
      items={languages}
      schema={languageSchema}
      singular="Language"
      emptyHint="Add a language you speak."
      addLabel="Add language"
      onAdd={() => add({ language: '', proficiency: 'proficient' })}
      onRemove={remove}
      onReorder={reorder}
      renderFields={(lang, errors) => {
        const set = (next: Partial<Language>) => update({ ...lang, ...next })
        return (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Language" required error={errors.language}>
              {(p) => <Input {...p} value={lang.language} onChange={(e) => set({ language: e.target.value })} placeholder="English" />}
            </Field>
            <Field label="Proficiency" required error={errors.proficiency}>
              {(p) => (
                <Select
                  value={lang.proficiency}
                  onValueChange={(v) => set({ proficiency: v as Language['proficiency'] })}
                >
                  <SelectTrigger id={p.id} aria-invalid={p['aria-invalid']} aria-describedby={p['aria-describedby']}>
                    <SelectValue placeholder="Select proficiency" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEVELS.map((level) => (
                      <SelectItem key={level} value={level} className="capitalize">
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </Field>
          </div>
        )
      }}
    />
  )
}
