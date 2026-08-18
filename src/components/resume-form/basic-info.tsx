'use client'

import * as React from 'react'
import { toast } from 'sonner'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { contactSchema } from '@/lib/validations/resume'
import { useResumeStore } from '@/store/useResumeStore'
import { Field } from './shared/field'
import { ErrorSummary, SaveButton } from './shared/shell'
import { validate } from './shared/validation'

export function BasicInfoForm() {
  const contact = useResumeStore((s) => s.contact)
  const summary = useResumeStore((s) => s.summary)
  const updateContact = useResumeStore((s) => s.updateContact)
  const updateSummary = useResumeStore((s) => s.updateSummary)
  const [pending, setPending] = React.useState(false)
  const [showErrors, setShowErrors] = React.useState(false)

  const errors = React.useMemo(() => {
    const found = validate(contactSchema, contact)
    if (!summary.trim()) found.summary = 'A professional summary is required'
    return found
  }, [contact, summary])

  const count = Object.keys(errors).length
  const shown = (key: string) => (showErrors ? errors[key] : undefined)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setShowErrors(true)
    if (count > 0) {
      toast.error('Basic information not saved', {
        description: 'Some fields still need attention.',
      })
      return
    }
    setPending(true)
    toast.success('Basic information saved')
    window.setTimeout(() => setPending(false), 200)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {showErrors && <ErrorSummary count={count} />}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Full name" required error={shown('fullName')}>
          {(props) => (
            <Input
              {...props}
              value={contact.fullName}
              onChange={(e) => updateContact({ ...contact, fullName: e.target.value })}
              placeholder="Jane Doe"
              autoComplete="name"
            />
          )}
        </Field>
        <Field label="Email" required error={shown('email')}>
          {(props) => (
            <Input
              {...props}
              type="email"
              value={contact.email}
              onChange={(e) => updateContact({ ...contact, email: e.target.value })}
              placeholder="jane@example.com"
              autoComplete="email"
            />
          )}
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Phone" required error={shown('phone')}>
          {(props) => (
            <Input
              {...props}
              type="tel"
              value={contact.phone}
              onChange={(e) => updateContact({ ...contact, phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
              autoComplete="tel"
            />
          )}
        </Field>
        <Field label="Location" required error={shown('location')}>
          {(props) => (
            <Input
              {...props}
              value={contact.location}
              onChange={(e) => updateContact({ ...contact, location: e.target.value })}
              placeholder="City, State"
              autoComplete="address-level2"
            />
          )}
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <Field label="Personal website" error={shown('website')}>
          {(props) => (
            <Input
              {...props}
              type="url"
              value={contact.website ?? ''}
              onChange={(e) => updateContact({ ...contact, website: e.target.value })}
              placeholder="https://yourname.dev"
            />
          )}
        </Field>
        <Field label="LinkedIn profile" error={shown('linkedin')}>
          {(props) => (
            <Input
              {...props}
              type="url"
              value={contact.linkedin ?? ''}
              onChange={(e) => updateContact({ ...contact, linkedin: e.target.value })}
              placeholder="https://linkedin.com/in/yourname"
            />
          )}
        </Field>
        <Field label="GitHub profile" error={shown('github')}>
          {(props) => (
            <Input
              {...props}
              type="url"
              value={contact.github ?? ''}
              onChange={(e) => updateContact({ ...contact, github: e.target.value })}
              placeholder="https://github.com/yourname"
            />
          )}
        </Field>
      </div>

      <Field
        label="Professional summary"
        required
        error={shown('summary')}
        hint="Two or three sentences on who you are and what you do."
      >
        {(props) => (
          <Textarea
            {...props}
            value={summary}
            onChange={(e) => updateSummary(e.target.value)}
            placeholder="A short paragraph describing your professional background and goals."
            rows={4}
          />
        )}
      </Field>

      <SaveButton pending={pending} />
    </form>
  )
}
