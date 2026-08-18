'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { experienceSchema } from '@/lib/validations/resume'
import { useResumeStore } from '@/store/useResumeStore'
import type { Experience } from '@/types/resume'
import { Field, FieldGroup } from './shared/field'
import { EntrySection } from './shared/entry-section'

export function WorkExperienceForm() {
  const experiences = useResumeStore((s) => s.experience)
  const addExperience = useResumeStore((s) => s.addExperience)
  const updateExperience = useResumeStore((s) => s.updateExperience)
  const removeExperience = useResumeStore((s) => s.removeExperience)
  const reorderExperience = useResumeStore((s) => s.reorderExperience)

  return (
    <EntrySection<Experience>
      collection="experience"
      items={experiences}
      schema={experienceSchema}
      singular="Role"
      emptyHint="Add your first role to begin."
      addLabel="Add role"
      onAdd={() =>
        addExperience({
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          current: false,
          description: ['', ''],
        })
      }
      onRemove={removeExperience}
      onReorder={reorderExperience}
      renderFields={(exp, errors) => {
        const update = (next: Partial<Experience>) => updateExperience({ ...exp, ...next })
        return (
          <>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Job title" required error={errors.position}>
                {(p) => (
                  <Input
                    {...p}
                    value={exp.position}
                    onChange={(e) => update({ position: e.target.value })}
                    placeholder="Lead Product Designer"
                  />
                )}
              </Field>
              <Field label="Company" required error={errors.company}>
                {(p) => (
                  <Input
                    {...p}
                    value={exp.company}
                    onChange={(e) => update({ company: e.target.value })}
                    placeholder="Holloway Financial"
                  />
                )}
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Start date" required error={errors.startDate}>
                {(p) => (
                  <Input
                    {...p}
                    type="date"
                    value={exp.startDate}
                    onChange={(e) => update({ startDate: e.target.value })}
                  />
                )}
              </Field>
              <Field
                label="End date"
                required={!exp.current}
                error={exp.current ? undefined : errors.endDate}
              >
                {(p) => (
                  <Input
                    {...p}
                    type="date"
                    value={exp.endDate}
                    onChange={(e) => update({ endDate: e.target.value })}
                    disabled={exp.current}
                  />
                )}
              </Field>
            </div>

            <label className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 text-[14px] text-slate-9">
              <input
                type="checkbox"
                checked={exp.current}
                onChange={(e) =>
                  update({ current: e.target.checked, endDate: e.target.checked ? '' : exp.endDate })
                }
                className="h-5 w-5 rounded border-line accent-[hsl(var(--accent))]"
              />
              I currently work here
            </label>

            <FieldGroup
              label="What you did"
              required
              hint="Two to four bullet points"
              error={errors.description}
            >
              {exp.description.map((point, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Input
                    value={point}
                    aria-label={`Bullet point ${i + 1}`}
                    onChange={(e) => {
                      const next = [...exp.description]
                      next[i] = e.target.value
                      update({ description: next })
                    }}
                    placeholder="Describe an achievement or responsibility"
                  />
                  {exp.description.length > 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      aria-label={`Remove bullet point ${i + 1}`}
                      onClick={() =>
                        update({ description: exp.description.filter((_, idx) => idx !== i) })
                      }
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              {exp.description.length < 4 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => update({ description: [...exp.description, ''] })}
                >
                  Add bullet point
                </Button>
              )}
            </FieldGroup>
          </>
        )
      }}
    />
  )
}
