'use client'

import * as React from 'react'
import { toast } from 'sonner'

import { useResumeStore } from '@/store/useResumeStore'
import type {
  ContactInfo,
  Experience,
  Education,
  Skill,
  Project,
  Certification,
  Award,
  Language,
  Reference,
} from '@/types/resume'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export type ResumeSection =
  | 'basic'
  | 'work'
  | 'education'
  | 'skills'
  | 'certifications'
  | 'awards'
  | 'projects'
  | 'languages'
  | 'references'

interface ResumeFormProps {
  section: ResumeSection
  onReferencesSaved?: () => void
}

// Primitives carry their own styling, so these className strings are kept
// (empty) so the existing form code can pass them through cn() without
// fighting the new bordered-input look.
const inputStyles = ''
const textareaStyles = ''
const labelStyles = 'mb-2'
const requiredMark = (
  <span aria-hidden className="ml-1 text-negative" title="required">
    *
  </span>
)

function SaveButton({ pending }: { pending: boolean }) {
  return (
    <div className="flex justify-end pt-2">
      <Button type="submit" disabled={pending} variant="default">
        {pending ? 'Saving…' : 'Save section'}
      </Button>
    </div>
  )
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-5 rounded-xl border border-line bg-surface-2/40 p-5 md:p-6">
      {children}
    </div>
  )
}

function EmptyHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-xl border border-dashed border-line bg-surface-2/40 px-5 py-8 text-center text-[14px] text-slate-7">
      {children}
    </p>
  )
}

/* -------------------- Basic Info -------------------- */

function BasicInfoForm() {
  const contact = useResumeStore((s) => s.contact)
  const summary = useResumeStore((s) => s.summary)
  const updateContact = useResumeStore((s) => s.updateContact)
  const updateSummary = useResumeStore((s) => s.updateSummary)
  const [pending, setPending] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPending(true)
    try {
      const required: (keyof ContactInfo)[] = ['fullName', 'email', 'phone', 'location']
      for (const key of required) {
        if (!contact[key]) {
          throw new Error('Please fill in all required fields')
        }
      }
      if (!summary.trim()) {
        throw new Error('Professional summary is required')
      }
      toast.success('Basic information saved')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label className={labelStyles}>Full Name {requiredMark}</Label>
          <Input
            value={contact.fullName}
            onChange={(e) => updateContact({ ...contact, fullName: e.target.value })}
            className={inputStyles}
            placeholder="Jane Doe"
            required
          />
        </div>
        <div>
          <Label className={labelStyles}>Email {requiredMark}</Label>
          <Input
            type="email"
            value={contact.email}
            onChange={(e) => updateContact({ ...contact, email: e.target.value })}
            className={inputStyles}
            placeholder="jane@example.com"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label className={labelStyles}>Phone {requiredMark}</Label>
          <Input
            type="tel"
            value={contact.phone}
            onChange={(e) => updateContact({ ...contact, phone: e.target.value })}
            className={inputStyles}
            placeholder="+1 (555) 123-4567"
            required
          />
        </div>
        <div>
          <Label className={labelStyles}>Location {requiredMark}</Label>
          <Input
            value={contact.location}
            onChange={(e) => updateContact({ ...contact, location: e.target.value })}
            className={inputStyles}
            placeholder="City, State"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <Label className={labelStyles}>Personal Website</Label>
          <Input
            type="url"
            value={contact.website ?? ''}
            onChange={(e) => updateContact({ ...contact, website: e.target.value })}
            className={inputStyles}
            placeholder="https://yourname.dev"
          />
        </div>
        <div>
          <Label className={labelStyles}>LinkedIn Profile</Label>
          <Input
            type="url"
            value={contact.linkedin ?? ''}
            onChange={(e) => updateContact({ ...contact, linkedin: e.target.value })}
            className={inputStyles}
            placeholder="https://linkedin.com/in/yourname"
          />
        </div>
        <div>
          <Label className={labelStyles}>GitHub Profile</Label>
          <Input
            type="url"
            value={contact.github ?? ''}
            onChange={(e) => updateContact({ ...contact, github: e.target.value })}
            className={inputStyles}
            placeholder="https://github.com/yourname"
          />
        </div>
      </div>

      <div>
        <Label className={labelStyles}>Professional Summary {requiredMark}</Label>
        <Textarea
          value={summary}
          onChange={(e) => updateSummary(e.target.value)}
          className={textareaStyles}
          rows={4}
          placeholder="A short paragraph describing your professional background and goals."
          required
        />
      </div>

      <SaveButton pending={pending} />
    </form>
  )
}

/* -------------------- Work Experience -------------------- */

function WorkExperienceForm() {
  const experiences = useResumeStore((s) => s.experience)
  const addExperience = useResumeStore((s) => s.addExperience)
  const updateExperience = useResumeStore((s) => s.updateExperience)
  const removeExperience = useResumeStore((s) => s.removeExperience)
  const [pending, setPending] = React.useState(false)

  const update = (exp: Experience) => updateExperience(exp)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPending(true)
    try {
      for (const exp of experiences) {
        if (!exp.company || !exp.position || !exp.startDate) {
          throw new Error('Please complete every required field on each experience')
        }
        if (!exp.current && !exp.endDate) {
          throw new Error('End date is required unless marked as current')
        }
        if (exp.description.length < 2) {
          throw new Error('Each experience needs at least two description points')
        }
        if (exp.description.length > 4) {
          throw new Error('Maximum four description points per experience')
        }
        if (exp.description.some((d) => !d.trim())) {
          throw new Error('Description points cannot be empty')
        }
      }
      toast.success('Work experience saved')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {experiences.length === 0 && (
        <EmptyHint>Add your first work experience to begin.</EmptyHint>
      )}
      {experiences.map((exp) => (
        <SectionCard key={exp.id}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label className={labelStyles}>Job Title {requiredMark}</Label>
              <Input
                value={exp.position}
                onChange={(e) => update({ ...exp, position: e.target.value })}
                className={inputStyles}
                required
              />
            </div>
            <div>
              <Label className={labelStyles}>Company {requiredMark}</Label>
              <Input
                value={exp.company}
                onChange={(e) => update({ ...exp, company: e.target.value })}
                className={inputStyles}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label className={labelStyles}>Start Date {requiredMark}</Label>
              <Input
                type="date"
                value={exp.startDate}
                onChange={(e) => update({ ...exp, startDate: e.target.value })}
                className={inputStyles}
                required
              />
            </div>
            <div>
              <Label className={labelStyles}>End Date {!exp.current && requiredMark}</Label>
              <Input
                type="date"
                value={exp.endDate}
                onChange={(e) => update({ ...exp, endDate: e.target.value })}
                className={inputStyles}
                disabled={exp.current}
                required={!exp.current}
              />
            </div>
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 text-[14px] text-slate-9">
            <input
              type="checkbox"
              checked={exp.current}
              onChange={(e) => update({ ...exp, current: e.target.checked, endDate: e.target.checked ? '' : exp.endDate })}
              className="h-4 w-4 rounded border-line accent-[hsl(var(--accent))]"
            />
            I currently work here
          </label>

          <div>
            <Label className={labelStyles}>
              Description {requiredMark}
              <span className="ml-2 text-xs text-slate-7">(2-4 bullet points)</span>
            </Label>
            <div className="space-y-2">
              {exp.description.map((point, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Input
                    value={point}
                    onChange={(e) => {
                      const next = [...exp.description]
                      next[i] = e.target.value
                      update({ ...exp, description: next })
                    }}
                    className={inputStyles}
                    placeholder="Describe an achievement or responsibility"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      update({
                        ...exp,
                        description: exp.description.filter((_, idx) => idx !== i),
                      })
                    }
                  >
                    Remove
                  </Button>
                </div>
              ))}
              {exp.description.length < 4 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => update({ ...exp, description: [...exp.description, ''] })}
                >
                  Add Description Point
                </Button>
              )}
            </div>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => removeExperience(exp.id)}>
            Remove Experience
          </Button>
        </SectionCard>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          addExperience({
            company: '',
            position: '',
            startDate: '',
            endDate: '',
            current: false,
            description: ['', ''],
          })
        }
      >
        Add Experience
      </Button>
      <SaveButton pending={pending} />
    </form>
  )
}

/* -------------------- Education -------------------- */

function EducationForm() {
  const educations = useResumeStore((s) => s.education)
  const addEducation = useResumeStore((s) => s.addEducation)
  const updateEducation = useResumeStore((s) => s.updateEducation)
  const removeEducation = useResumeStore((s) => s.removeEducation)
  const [pending, setPending] = React.useState(false)

  const update = (edu: Education) => updateEducation(edu)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPending(true)
    try {
      for (const edu of educations) {
        if (!edu.school || !edu.degree || !edu.field || !edu.startDate || !edu.endDate) {
          throw new Error('Please complete every required field on each education entry')
        }
      }
      toast.success('Education saved')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {educations.length === 0 && <EmptyHint>Add an institution to begin.</EmptyHint>}
      {educations.map((edu) => (
        <SectionCard key={edu.id}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label className={labelStyles}>Degree {requiredMark}</Label>
              <Input
                value={edu.degree}
                onChange={(e) => update({ ...edu, degree: e.target.value })}
                className={inputStyles}
                required
              />
            </div>
            <div>
              <Label className={labelStyles}>Field of Study {requiredMark}</Label>
              <Input
                value={edu.field}
                onChange={(e) => update({ ...edu, field: e.target.value })}
                className={inputStyles}
                required
              />
            </div>
          </div>
          <div>
            <Label className={labelStyles}>Institution {requiredMark}</Label>
            <Input
              value={edu.school}
              onChange={(e) => update({ ...edu, school: e.target.value })}
              className={inputStyles}
              required
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label className={labelStyles}>Start Date {requiredMark}</Label>
              <Input
                type="date"
                value={edu.startDate}
                onChange={(e) => update({ ...edu, startDate: e.target.value })}
                className={inputStyles}
                required
              />
            </div>
            <div>
              <Label className={labelStyles}>End / Expected Date {requiredMark}</Label>
              <Input
                type="date"
                value={edu.endDate}
                onChange={(e) => update({ ...edu, endDate: e.target.value })}
                className={inputStyles}
                required
              />
            </div>
          </div>
          <div>
            <Label className={labelStyles}>GPA</Label>
            <Input
              value={edu.gpa ?? ''}
              onChange={(e) => update({ ...edu, gpa: e.target.value })}
              className={inputStyles}
              placeholder="3.85"
            />
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => removeEducation(edu.id)}>
            Remove Education
          </Button>
        </SectionCard>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          addEducation({
            school: '',
            degree: '',
            field: '',
            startDate: '',
            endDate: '',
            gpa: '',
          })
        }
      >
        Add Education
      </Button>
      <SaveButton pending={pending} />
    </form>
  )
}

/* -------------------- Skills -------------------- */

function SkillsForm() {
  const skills = useResumeStore((s) => s.skills)
  const addSkill = useResumeStore((s) => s.addSkill)
  const updateSkill = useResumeStore((s) => s.updateSkill)
  const removeSkill = useResumeStore((s) => s.removeSkill)
  const [pending, setPending] = React.useState(false)

  const update = (skill: Skill) => updateSkill(skill)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPending(true)
    try {
      for (const skill of skills) {
        if (!skill.category) {
          throw new Error('Each skill group needs a category name')
        }
        if (skill.skills.length === 0 || skill.skills.some((s) => !s.trim())) {
          throw new Error('Add at least one non-empty skill in every category')
        }
      }
      toast.success('Skills saved')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {skills.length === 0 && (
        <EmptyHint>Add a category, e.g. &ldquo;Frontend&rdquo; or &ldquo;Languages&rdquo;.</EmptyHint>
      )}
      {skills.map((skill) => (
        <SectionCard key={skill.id}>
          <div>
            <Label className={labelStyles}>Category {requiredMark}</Label>
            <Input
              value={skill.category}
              onChange={(e) => update({ ...skill, category: e.target.value })}
              className={inputStyles}
              placeholder="e.g. Programming Languages"
              required
            />
          </div>
          <div>
            <Label className={labelStyles}>Skills {requiredMark}</Label>
            <div className="space-y-2">
              {skill.skills.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    value={s}
                    onChange={(e) => {
                      const next = [...skill.skills]
                      next[i] = e.target.value
                      update({ ...skill, skills: next })
                    }}
                    className={inputStyles}
                    placeholder="e.g. TypeScript"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => update({ ...skill, skills: skill.skills.filter((_, idx) => idx !== i) })}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => update({ ...skill, skills: [...skill.skills, ''] })}
              >
                Add Skill
              </Button>
            </div>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => removeSkill(skill.id)}>
            Remove Category
          </Button>
        </SectionCard>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => addSkill({ category: '', skills: [''] })}
      >
        Add Category
      </Button>
      <SaveButton pending={pending} />
    </form>
  )
}

/* -------------------- Certifications -------------------- */

function CertificationsForm() {
  const certifications = useResumeStore((s) => s.certifications)
  const addCertification = useResumeStore((s) => s.addCertification)
  const updateCertification = useResumeStore((s) => s.updateCertification)
  const removeCertification = useResumeStore((s) => s.removeCertification)
  const [pending, setPending] = React.useState(false)

  const update = (c: Certification) => updateCertification(c)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPending(true)
    try {
      for (const c of certifications) {
        if (!c.name || !c.issuer || !c.date) {
          throw new Error('Please complete every required field on each certification')
        }
      }
      toast.success('Certifications saved')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {certifications.length === 0 && (
        <EmptyHint>Add a professional certification you have earned.</EmptyHint>
      )}
      {certifications.map((c) => (
        <SectionCard key={c.id}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label className={labelStyles}>Title {requiredMark}</Label>
              <Input
                value={c.name}
                onChange={(e) => update({ ...c, name: e.target.value })}
                className={inputStyles}
                required
              />
            </div>
            <div>
              <Label className={labelStyles}>Issuer {requiredMark}</Label>
              <Input
                value={c.issuer}
                onChange={(e) => update({ ...c, issuer: e.target.value })}
                className={inputStyles}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label className={labelStyles}>Issue Date {requiredMark}</Label>
              <Input
                type="date"
                value={c.date}
                onChange={(e) => update({ ...c, date: e.target.value })}
                className={inputStyles}
                required
              />
            </div>
            <div>
              <Label className={labelStyles}>Credential URL</Label>
              <Input
                type="url"
                value={c.link ?? ''}
                onChange={(e) => update({ ...c, link: e.target.value })}
                className={inputStyles}
              />
            </div>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => removeCertification(c.id)}>
            Remove Certification
          </Button>
        </SectionCard>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => addCertification({ name: '', issuer: '', date: '', link: '' })}
      >
        Add Certification
      </Button>
      <SaveButton pending={pending} />
    </form>
  )
}

/* -------------------- Awards -------------------- */

function AwardsForm() {
  const awards = useResumeStore((s) => s.awards)
  const addAward = useResumeStore((s) => s.addAward)
  const updateAward = useResumeStore((s) => s.updateAward)
  const removeAward = useResumeStore((s) => s.removeAward)
  const [pending, setPending] = React.useState(false)

  const update = (a: Award) => updateAward(a)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPending(true)
    try {
      for (const a of awards) {
        if (!a.title || !a.issuer || !a.date) {
          throw new Error('Please complete every required field on each award')
        }
      }
      toast.success('Awards saved')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {awards.length === 0 && (
        <EmptyHint>Add a recognition or honour you have received.</EmptyHint>
      )}
      {awards.map((a) => (
        <SectionCard key={a.id}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label className={labelStyles}>Title {requiredMark}</Label>
              <Input
                value={a.title}
                onChange={(e) => update({ ...a, title: e.target.value })}
                className={inputStyles}
                required
              />
            </div>
            <div>
              <Label className={labelStyles}>Issuer {requiredMark}</Label>
              <Input
                value={a.issuer}
                onChange={(e) => update({ ...a, issuer: e.target.value })}
                className={inputStyles}
                required
              />
            </div>
          </div>
          <div>
            <Label className={labelStyles}>Date {requiredMark}</Label>
            <Input
              type="date"
              value={a.date}
              onChange={(e) => update({ ...a, date: e.target.value })}
              className={inputStyles}
              required
            />
          </div>
          <div>
            <Label className={labelStyles}>Description</Label>
            <Textarea
              value={a.description}
              onChange={(e) => update({ ...a, description: e.target.value })}
              className={textareaStyles}
              rows={2}
              placeholder="Optional context about why the award was given"
            />
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => removeAward(a.id)}>
            Remove Award
          </Button>
        </SectionCard>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => addAward({ title: '', issuer: '', date: '', description: '' })}
      >
        Add Award
      </Button>
      <SaveButton pending={pending} />
    </form>
  )
}

/* -------------------- Projects -------------------- */

function ProjectsForm() {
  const projects = useResumeStore((s) => s.projects)
  const addProject = useResumeStore((s) => s.addProject)
  const updateProject = useResumeStore((s) => s.updateProject)
  const removeProject = useResumeStore((s) => s.removeProject)
  const [pending, setPending] = React.useState(false)

  const update = (p: Project) => updateProject(p)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPending(true)
    try {
      for (const p of projects) {
        if (!p.name) throw new Error('Project name is required')
        if (p.description.length === 0 || p.description.some((d) => !d.trim())) {
          throw new Error('Each project needs at least one description point')
        }
        if (p.technologies.length === 0 || p.technologies.some((t) => !t.trim())) {
          throw new Error('Each project needs at least one technology')
        }
      }
      toast.success('Projects saved')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {projects.length === 0 && (
        <EmptyHint>Add a notable project from your portfolio.</EmptyHint>
      )}
      {projects.map((p) => (
        <SectionCard key={p.id}>
          <div>
            <Label className={labelStyles}>Project Name {requiredMark}</Label>
            <Input
              value={p.name}
              onChange={(e) => update({ ...p, name: e.target.value })}
              className={inputStyles}
              required
            />
          </div>
          <div>
            <Label className={labelStyles}>Description {requiredMark}</Label>
            <div className="space-y-2">
              {p.description.map((desc, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Input
                    value={desc}
                    onChange={(e) => {
                      const next = [...p.description]
                      next[i] = e.target.value
                      update({ ...p, description: next })
                    }}
                    className={inputStyles}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => update({ ...p, description: p.description.filter((_, idx) => idx !== i) })}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => update({ ...p, description: [...p.description, ''] })}
              >
                Add Description Point
              </Button>
            </div>
          </div>
          <div>
            <Label className={labelStyles}>Tech Stack {requiredMark}</Label>
            <div className="space-y-2">
              {p.technologies.map((tech, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    value={tech}
                    onChange={(e) => {
                      const next = [...p.technologies]
                      next[i] = e.target.value
                      update({ ...p, technologies: next })
                    }}
                    className={inputStyles}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      update({ ...p, technologies: p.technologies.filter((_, idx) => idx !== i) })
                    }
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => update({ ...p, technologies: [...p.technologies, ''] })}
              >
                Add Technology
              </Button>
            </div>
          </div>
          <div>
            <Label className={labelStyles}>Project Link</Label>
            <Input
              type="url"
              value={p.link ?? ''}
              onChange={(e) => update({ ...p, link: e.target.value })}
              className={inputStyles}
            />
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => removeProject(p.id)}>
            Remove Project
          </Button>
        </SectionCard>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => addProject({ name: '', description: [''], technologies: [''], link: '' })}
      >
        Add Project
      </Button>
      <SaveButton pending={pending} />
    </form>
  )
}

/* -------------------- Languages -------------------- */

function LanguagesForm() {
  const languages = useResumeStore((s) => s.languages)
  const addLanguage = useResumeStore((s) => s.addLanguage)
  const updateLanguage = useResumeStore((s) => s.updateLanguage)
  const removeLanguage = useResumeStore((s) => s.removeLanguage)
  const [pending, setPending] = React.useState(false)

  const update = (l: Language) => updateLanguage(l)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPending(true)
    try {
      for (const l of languages) {
        if (!l.language || !l.proficiency) {
          throw new Error('Please complete every required field on each language')
        }
      }
      toast.success('Languages saved')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {languages.length === 0 && (
        <EmptyHint>Add a language you speak and your proficiency.</EmptyHint>
      )}
      {languages.map((l) => (
        <SectionCard key={l.id}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label className={labelStyles}>Language {requiredMark}</Label>
              <Input
                value={l.language}
                onChange={(e) => update({ ...l, language: e.target.value })}
                className={inputStyles}
                placeholder="e.g. English"
                required
              />
            </div>
            <div>
              <Label className={labelStyles}>Proficiency {requiredMark}</Label>
              <Select
                value={l.proficiency}
                onValueChange={(value: Language['proficiency']) => update({ ...l, proficiency: value })}
              >
                <SelectTrigger className={inputStyles}>
                  <SelectValue placeholder="Select proficiency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="native">Native</SelectItem>
                  <SelectItem value="fluent">Fluent</SelectItem>
                  <SelectItem value="proficient">Proficient</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => removeLanguage(l.id)}>
            Remove Language
          </Button>
        </SectionCard>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => addLanguage({ language: '', proficiency: 'basic' })}
      >
        Add Language
      </Button>
      <SaveButton pending={pending} />
    </form>
  )
}

/* -------------------- References -------------------- */

function ReferencesForm({ onReferencesSaved }: { onReferencesSaved?: () => void }) {
  const references = useResumeStore((s) => s.references)
  const addReference = useResumeStore((s) => s.addReference)
  const updateReference = useResumeStore((s) => s.updateReference)
  const removeReference = useResumeStore((s) => s.removeReference)
  const referencesMode = useResumeStore((s) => s.referencesMode)
  const setReferencesMode = useResumeStore((s) => s.setReferencesMode)
  const [pending, setPending] = React.useState(false)

  const update = (r: Reference) => updateReference(r)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPending(true)
    try {
      if (referencesMode === 'include') {
        if (references.length === 0) {
          throw new Error('Add at least one reference, or switch to "available upon request"')
        }
        for (const r of references) {
          if (!r.name || !r.relationship || !r.email || !r.phone) {
            throw new Error('Please complete every required field on each reference')
          }
        }
      }
      toast.success('References saved')
      onReferencesSaved?.()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <fieldset className="space-y-3">
        <legend className="text-[14px] font-semibold text-slate-12">Reference style</legend>
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="radio"
            name="reference-mode"
            checked={referencesMode === 'uponRequest'}
            onChange={() => setReferencesMode('uponRequest')}
            className="h-4 w-4 accent-[hsl(var(--accent))]"
          />
          <span className="text-[14px] text-slate-9">
            Show &ldquo;References available upon request&rdquo;
          </span>
        </label>
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="radio"
            name="reference-mode"
            checked={referencesMode === 'include'}
            onChange={() => setReferencesMode('include')}
            className="h-4 w-4 accent-[hsl(var(--accent))]"
          />
          <span className="text-[14px] text-slate-9">Include named references</span>
        </label>
      </fieldset>

      {referencesMode === 'include' && (
        <div className="space-y-4">
          {references.length === 0 && <EmptyHint>Add a reference to begin.</EmptyHint>}
          {references.map((r) => (
            <SectionCard key={r.id}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label className={labelStyles}>Name {requiredMark}</Label>
                  <Input
                    value={r.name}
                    onChange={(e) => update({ ...r, name: e.target.value })}
                    className={inputStyles}
                    required
                  />
                </div>
                <div>
                  <Label className={labelStyles}>Relationship {requiredMark}</Label>
                  <Input
                    value={r.relationship}
                    onChange={(e) => update({ ...r, relationship: e.target.value })}
                    className={inputStyles}
                    placeholder="Former Manager"
                    required
                  />
                </div>
                <div>
                  <Label className={labelStyles}>Email {requiredMark}</Label>
                  <Input
                    type="email"
                    value={r.email}
                    onChange={(e) => update({ ...r, email: e.target.value })}
                    className={inputStyles}
                    required
                  />
                </div>
                <div>
                  <Label className={labelStyles}>Phone {requiredMark}</Label>
                  <Input
                    value={r.phone}
                    onChange={(e) => update({ ...r, phone: e.target.value })}
                    className={inputStyles}
                    required
                  />
                </div>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => removeReference(r.id)}>
                Remove Reference
              </Button>
            </SectionCard>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addReference({ name: '', relationship: '', email: '', phone: '' })}
          >
            Add Reference
          </Button>
        </div>
      )}

      <SaveButton pending={pending} />
    </form>
  )
}

/* -------------------- Router -------------------- */

export function ResumeForm({ section, onReferencesSaved }: ResumeFormProps) {
  switch (section) {
    case 'basic':
      return <BasicInfoForm />
    case 'work':
      return <WorkExperienceForm />
    case 'education':
      return <EducationForm />
    case 'skills':
      return <SkillsForm />
    case 'certifications':
      return <CertificationsForm />
    case 'awards':
      return <AwardsForm />
    case 'projects':
      return <ProjectsForm />
    case 'languages':
      return <LanguagesForm />
    case 'references':
      return <ReferencesForm onReferencesSaved={onReferencesSaved} />
  }
}

export default ResumeForm
