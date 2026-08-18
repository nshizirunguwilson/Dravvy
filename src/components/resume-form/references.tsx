'use client'

import * as React from 'react'

import { Input } from '@/components/ui/input'
import { referenceSchema } from '@/lib/validations/resume'
import { useResumeStore } from '@/store/useResumeStore'
import type { Reference } from '@/types/resume'
import { Field } from './shared/field'
import { EntrySection } from './shared/entry-section'

export function ReferencesForm({ onReferencesSaved }: { onReferencesSaved?: () => void }) {
  const references = useResumeStore((s) => s.references)
  const referencesMode = useResumeStore((s) => s.referencesMode)
  const setReferencesMode = useResumeStore((s) => s.setReferencesMode)
  const add = useResumeStore((s) => s.addReference)
  const update = useResumeStore((s) => s.updateReference)
  const remove = useResumeStore((s) => s.removeReference)
  const reorder = useResumeStore((s) => s.reorderReferences)

  return (
    <div className="space-y-6">
      <fieldset className="space-y-3">
        <legend className="text-[14px] font-semibold text-slate-12">Reference style</legend>
        <label className="flex min-h-[44px] cursor-pointer items-center gap-3">
          <input
            type="radio"
            name="reference-mode"
            checked={referencesMode === 'uponRequest'}
            onChange={() => setReferencesMode('uponRequest')}
            className="h-5 w-5 accent-[hsl(var(--accent))]"
          />
          <span className="text-[14px] text-slate-9">
            Show &ldquo;References available upon request&rdquo;
          </span>
        </label>
        <label className="flex min-h-[44px] cursor-pointer items-center gap-3">
          <input
            type="radio"
            name="reference-mode"
            checked={referencesMode === 'include'}
            onChange={() => setReferencesMode('include')}
            className="h-5 w-5 accent-[hsl(var(--accent))]"
          />
          <span className="text-[14px] text-slate-9">Include named references</span>
        </label>
      </fieldset>

      {referencesMode === 'include' ? (
        <EntrySection<Reference>
          collection="references"
          items={references}
          schema={referenceSchema}
          singular="Reference"
          emptyHint="Add a reference to begin."
          addLabel="Add reference"
          onAdd={() => add({ name: '', relationship: '', email: '', phone: '' })}
          onRemove={remove}
          onReorder={reorder}
          renderFields={(ref, errors) => {
            const set = (next: Partial<Reference>) => update({ ...ref, ...next })
            return (
              <>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <Field label="Name" required error={errors.name}>
                    {(p) => <Input {...p} value={ref.name} onChange={(e) => set({ name: e.target.value })} placeholder="Priya Nair" />}
                  </Field>
                  <Field label="Relationship" required error={errors.relationship}>
                    {(p) => <Input {...p} value={ref.relationship} onChange={(e) => set({ relationship: e.target.value })} placeholder="Former manager" />}
                  </Field>
                </div>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <Field label="Email" required error={errors.email}>
                    {(p) => <Input {...p} type="email" value={ref.email} onChange={(e) => set({ email: e.target.value })} placeholder="priya@example.com" />}
                  </Field>
                  <Field label="Phone" required error={errors.phone}>
                    {(p) => <Input {...p} type="tel" value={ref.phone} onChange={(e) => set({ phone: e.target.value })} placeholder="+1 555 222 3333" />}
                  </Field>
                </div>
              </>
            )
          }}
        />
      ) : (
        <FinishButton onDone={onReferencesSaved} />
      )}
    </div>
  )
}

function FinishButton({ onDone }: { onDone?: () => void }) {
  const [pending, setPending] = React.useState(false)
  return (
    <div className="flex justify-end pt-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          setPending(true)
          onDone?.()
        }}
        className="inline-flex h-11 min-h-[44px] items-center justify-center rounded-md bg-brand px-5 text-[14px] font-semibold text-brand-fg shadow-sm transition-colors hover:bg-brand-hover disabled:opacity-50"
      >
        {pending ? 'Saving...' : 'Save section'}
      </button>
    </div>
  )
}
