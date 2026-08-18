'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { projectSchema } from '@/lib/validations/resume'
import { useResumeStore } from '@/store/useResumeStore'
import type { Project } from '@/types/resume'
import { Field, FieldGroup } from './shared/field'
import { EntrySection } from './shared/entry-section'

export function ProjectsForm() {
  const projects = useResumeStore((s) => s.projects)
  const add = useResumeStore((s) => s.addProject)
  const update = useResumeStore((s) => s.updateProject)
  const remove = useResumeStore((s) => s.removeProject)
  const reorder = useResumeStore((s) => s.reorderProjects)

  return (
    <EntrySection<Project>
      collection="projects"
      items={projects}
      schema={projectSchema}
      singular="Project"
      emptyHint="Add a project worth highlighting."
      addLabel="Add project"
      onAdd={() => add({ name: '', description: [''], technologies: [''], link: '' })}
      onRemove={remove}
      onReorder={reorder}
      renderFields={(project, errors) => {
        const set = (next: Partial<Project>) => update({ ...project, ...next })
        return (
          <>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Name" required error={errors.name}>
                {(p) => <Input {...p} value={project.name} onChange={(e) => set({ name: e.target.value })} placeholder="Open Pay" />}
              </Field>
              <Field label="Link" error={errors.link}>
                {(p) => <Input {...p} type="url" value={project.link ?? ''} onChange={(e) => set({ link: e.target.value })} placeholder="https://" />}
              </Field>
            </div>

            <FieldGroup label="What it does" required error={errors.description}>
              {project.description.map((line, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Input
                    value={line}
                    aria-label={`Project detail ${i + 1}`}
                    onChange={(e) => {
                      const next = [...project.description]
                      next[i] = e.target.value
                      set({ description: next })
                    }}
                    placeholder="What it does, or what it achieved"
                  />
                  {project.description.length > 1 && (
                    <Button type="button" variant="outline" size="sm" aria-label={`Remove project detail ${i + 1}`} onClick={() => set({ description: project.description.filter((_, x) => x !== i) })}>
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => set({ description: [...project.description, ''] })}>
                Add detail
              </Button>
            </FieldGroup>

            <FieldGroup label="Tech stack" required error={errors.technologies}>
              {project.technologies.map((tech, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Input
                    value={tech}
                    aria-label={`Technology ${i + 1}`}
                    onChange={(e) => {
                      const next = [...project.technologies]
                      next[i] = e.target.value
                      set({ technologies: next })
                    }}
                    placeholder="e.g. React"
                  />
                  {project.technologies.length > 1 && (
                    <Button type="button" variant="outline" size="sm" aria-label={`Remove technology ${i + 1}`} onClick={() => set({ technologies: project.technologies.filter((_, x) => x !== i) })}>
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => set({ technologies: [...project.technologies, ''] })}>
                Add technology
              </Button>
            </FieldGroup>
          </>
        )
      }}
    />
  )
}
