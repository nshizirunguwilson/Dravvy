'use client'

import * as z from 'zod'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useResumeStore } from '@/store/useResumeStore'
import type { Award } from '@/types/resume'
import { Field } from './shared/field'
import { EntrySection } from './shared/entry-section'

/** Awards had no schema of their own, so this is the missing one. */
const awardSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  date: z.string().min(1, 'Date is required'),
  description: z.string().optional(),
})

export function AwardsForm() {
  const awards = useResumeStore((s) => s.awards)
  const add = useResumeStore((s) => s.addAward)
  const update = useResumeStore((s) => s.updateAward)
  const remove = useResumeStore((s) => s.removeAward)
  const reorder = useResumeStore((s) => s.reorderAwards)

  return (
    <EntrySection<Award>
      collection="awards"
      items={awards}
      schema={awardSchema}
      singular="Award"
      emptyHint="Add an award or honour to begin."
      addLabel="Add award"
      onAdd={() => add({ title: '', issuer: '', date: '', description: '' })}
      onRemove={remove}
      onReorder={reorder}
      renderFields={(award, errors) => {
        const set = (next: Partial<Award>) => update({ ...award, ...next })
        return (
          <>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Title" required error={errors.title}>
                {(p) => <Input {...p} value={award.title} onChange={(e) => set({ title: e.target.value })} placeholder="IxDA Awards Finalist" />}
              </Field>
              <Field label="Issuer" required error={errors.issuer}>
                {(p) => <Input {...p} value={award.issuer} onChange={(e) => set({ issuer: e.target.value })} placeholder="Interaction Design Association" />}
              </Field>
            </div>
            <Field label="Date" required error={errors.date}>
              {(p) => <Input {...p} type="date" value={award.date} onChange={(e) => set({ date: e.target.value })} />}
            </Field>
            <Field label="Description" error={errors.description}>
              {(p) => <Textarea {...p} rows={3} value={award.description} onChange={(e) => set({ description: e.target.value })} placeholder="What it was awarded for." />}
            </Field>
          </>
        )
      }}
    />
  )
}
