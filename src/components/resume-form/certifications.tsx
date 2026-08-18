'use client'

import { Input } from '@/components/ui/input'
import { certificationSchema } from '@/lib/validations/resume'
import { useResumeStore } from '@/store/useResumeStore'
import type { Certification } from '@/types/resume'
import { Field } from './shared/field'
import { EntrySection } from './shared/entry-section'

export function CertificationsForm() {
  const certifications = useResumeStore((s) => s.certifications)
  const add = useResumeStore((s) => s.addCertification)
  const update = useResumeStore((s) => s.updateCertification)
  const remove = useResumeStore((s) => s.removeCertification)
  const reorder = useResumeStore((s) => s.reorderCertifications)

  return (
    <EntrySection<Certification>
      collection="certifications"
      items={certifications}
      schema={certificationSchema}
      singular="Certification"
      emptyHint="Add a certification to begin."
      addLabel="Add certification"
      onAdd={() => add({ name: '', issuer: '', date: '', link: '' })}
      onRemove={remove}
      onReorder={reorder}
      renderFields={(cert, errors) => {
        const set = (next: Partial<Certification>) => update({ ...cert, ...next })
        return (
          <>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Title" required error={errors.name}>
                {(p) => <Input {...p} value={cert.name} onChange={(e) => set({ name: e.target.value })} placeholder="Google UX Design Certificate" />}
              </Field>
              <Field label="Issuer" required error={errors.issuer}>
                {(p) => <Input {...p} value={cert.issuer} onChange={(e) => set({ issuer: e.target.value })} placeholder="Coursera" />}
              </Field>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Issue date" required error={errors.date}>
                {(p) => <Input {...p} type="date" value={cert.date} onChange={(e) => set({ date: e.target.value })} />}
              </Field>
              <Field label="Certificate link" error={errors.link}>
                {(p) => <Input {...p} type="url" value={cert.link ?? ''} onChange={(e) => set({ link: e.target.value })} placeholder="https://" />}
              </Field>
            </div>
          </>
        )
      }}
    />
  )
}
