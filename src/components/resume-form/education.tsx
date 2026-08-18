'use client'

import { Input } from '@/components/ui/input'
import { educationSchema } from '@/lib/validations/resume'
import { useResumeStore } from '@/store/useResumeStore'
import type { Education } from '@/types/resume'
import { Field } from './shared/field'
import { EntrySection } from './shared/entry-section'

export function EducationForm() {
  const education = useResumeStore((s) => s.education)
  const addEducation = useResumeStore((s) => s.addEducation)
  const updateEducation = useResumeStore((s) => s.updateEducation)
  const removeEducation = useResumeStore((s) => s.removeEducation)
  const reorderEducation = useResumeStore((s) => s.reorderEducation)

  return (
    <EntrySection<Education>
      collection="education"
      items={education}
      schema={educationSchema}
      singular="Qualification"
      emptyHint="Add an institution to begin."
      addLabel="Add qualification"
      onAdd={() =>
        addEducation({ school: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' })
      }
      onRemove={removeEducation}
      onReorder={reorderEducation}
      renderFields={(edu, errors) => {
        const update = (next: Partial<Education>) => updateEducation({ ...edu, ...next })
        return (
          <>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Degree" required error={errors.degree}>
                {(p) => (
                  <Input {...p} value={edu.degree} onChange={(e) => update({ degree: e.target.value })} placeholder="B.A." />
                )}
              </Field>
              <Field label="Field of study" required error={errors.field}>
                {(p) => (
                  <Input {...p} value={edu.field} onChange={(e) => update({ field: e.target.value })} placeholder="Graphic Design" />
                )}
              </Field>
            </div>
            <Field label="Institution" required error={errors.school}>
              {(p) => (
                <Input {...p} value={edu.school} onChange={(e) => update({ school: e.target.value })} placeholder="Rhode Island School of Design" />
              )}
            </Field>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <Field label="Start date" required error={errors.startDate}>
                {(p) => <Input {...p} type="date" value={edu.startDate} onChange={(e) => update({ startDate: e.target.value })} />}
              </Field>
              <Field label="End date" required error={errors.endDate} hint="Or the date you expect">
                {(p) => <Input {...p} type="date" value={edu.endDate} onChange={(e) => update({ endDate: e.target.value })} />}
              </Field>
              <Field label="GPA" error={errors.gpa}>
                {(p) => <Input {...p} value={edu.gpa ?? ''} onChange={(e) => update({ gpa: e.target.value })} placeholder="3.8" />}
              </Field>
            </div>
          </>
        )
      }}
    />
  )
}
