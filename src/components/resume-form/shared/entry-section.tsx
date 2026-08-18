'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'
import type { ZodTypeAny } from 'zod'

import { Button } from '@/components/ui/button'
import { useResumeStore, type CollectionKey } from '@/store/useResumeStore'
import { ErrorSummary, EmptyHint, SaveButton, SectionCard } from './shell'
import { countErrors, validateAll, type FieldErrors } from './validation'

type Entry = { id: string }

/**
 * The shape every list section shares: add, edit, reorder, remove with undo,
 * validate, save. Eight sections used to repeat all of this by hand, which is
 * why a single fix had to be applied nine times.
 */
export function EntrySection<T extends Entry>({
  collection,
  items,
  schema,
  singular,
  emptyHint,
  addLabel,
  onAdd,
  onRemove,
  onReorder,
  renderFields,
}: {
  collection: CollectionKey
  items: T[]
  schema: ZodTypeAny
  singular: string
  emptyHint: string
  addLabel: string
  onAdd: () => void
  onRemove: (id: string) => void
  onReorder: (from: number, to: number) => void
  renderFields: (entry: T, errors: FieldErrors) => React.ReactNode
}) {
  const replaceCollection = useResumeStore((s) => s.replaceCollection)
  const [pending, setPending] = React.useState(false)
  const [showErrors, setShowErrors] = React.useState(false)

  const allErrors = React.useMemo(() => validateAll(schema, items), [schema, items])
  const errorCount = countErrors(allErrors)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setShowErrors(true)
    if (errorCount > 0) {
      toast.error(`${singular} not saved`, { description: 'Some fields still need attention.' })
      return
    }
    setPending(true)
    toast.success(`${singular} saved`)
    window.setTimeout(() => setPending(false), 200)
  }

  /** Deleting is one tap, so it has to be reversible. */
  const handleRemove = (id: string) => {
    const before = items.slice()
    onRemove(id)
    toast('Entry removed', {
      description: 'It is gone from your resume.',
      action: {
        label: 'Undo',
        onClick: () => replaceCollection(collection, before as never),
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {showErrors && <ErrorSummary count={errorCount} />}
      {items.length === 0 && <EmptyHint>{emptyHint}</EmptyHint>}

      {items.map((entry, index) => (
        <SectionCard key={entry.id}>
          <div className="flex items-center justify-between gap-3">
            <p className="text-[13px] font-semibold uppercase tracking-wider text-slate-7">
              {singular} {index + 1}
            </p>
            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-11 px-0"
                disabled={index === 0}
                aria-label={`Move ${singular.toLowerCase()} ${index + 1} up`}
                onClick={() => onReorder(index, index - 1)}
              >
                <ArrowUp className="h-4 w-4" aria-hidden />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-11 px-0"
                disabled={index === items.length - 1}
                aria-label={`Move ${singular.toLowerCase()} ${index + 1} down`}
                onClick={() => onReorder(index, index + 1)}
              >
                <ArrowDown className="h-4 w-4" aria-hidden />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                aria-label={`Remove ${singular.toLowerCase()} ${index + 1}`}
                onClick={() => handleRemove(entry.id)}
              >
                <Trash2 className="h-4 w-4" aria-hidden />
                <span className="hidden sm:inline">Remove</span>
              </Button>
            </div>
          </div>

          {renderFields(entry, showErrors ? (allErrors[entry.id] ?? {}) : {})}
        </SectionCard>
      ))}

      <Button type="button" variant="outline" size="sm" className="gap-2" onClick={onAdd}>
        <Plus className="h-4 w-4" aria-hidden />
        {addLabel}
      </Button>
      <SaveButton pending={pending} />
    </form>
  )
}
