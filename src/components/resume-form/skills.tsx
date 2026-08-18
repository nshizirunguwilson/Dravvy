'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { skillSchema } from '@/lib/validations/resume'
import { useResumeStore } from '@/store/useResumeStore'
import type { Skill } from '@/types/resume'
import { Field, FieldGroup } from './shared/field'
import { EntrySection } from './shared/entry-section'

export function SkillsForm() {
  const skills = useResumeStore((s) => s.skills)
  const addSkill = useResumeStore((s) => s.addSkill)
  const updateSkill = useResumeStore((s) => s.updateSkill)
  const removeSkill = useResumeStore((s) => s.removeSkill)
  const reorderSkills = useResumeStore((s) => s.reorderSkills)

  return (
    <EntrySection<Skill>
      collection="skills"
      items={skills}
      schema={skillSchema}
      singular="Category"
      emptyHint="Group your skills by category, such as Design or Research."
      addLabel="Add category"
      onAdd={() => addSkill({ category: '', skills: [''] })}
      onRemove={removeSkill}
      onReorder={reorderSkills}
      renderFields={(group, errors) => {
        const update = (next: Partial<Skill>) => updateSkill({ ...group, ...next })
        return (
          <>
            <Field label="Category" required error={errors.category}>
              {(p) => (
                <Input {...p} value={group.category} onChange={(e) => update({ category: e.target.value })} placeholder="Design" />
              )}
            </Field>
            <FieldGroup label="Skills" required error={errors.skills}>
              {group.skills.map((skill, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Input
                    value={skill}
                    aria-label={`Skill ${i + 1}`}
                    onChange={(e) => {
                      const next = [...group.skills]
                      next[i] = e.target.value
                      update({ skills: next })
                    }}
                    placeholder="e.g. TypeScript"
                  />
                  {group.skills.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      aria-label={`Remove skill ${i + 1}`}
                      onClick={() => update({ skills: group.skills.filter((_, idx) => idx !== i) })}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => update({ skills: [...group.skills, ''] })}>
                Add skill
              </Button>
            </FieldGroup>
          </>
        )
      }}
    />
  )
}
