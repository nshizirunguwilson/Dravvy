'use client'

import { BasicInfoForm } from './basic-info'
import { WorkExperienceForm } from './work-experience'
import { EducationForm } from './education'
import { SkillsForm } from './skills'
import { CertificationsForm } from './certifications'
import { AwardsForm } from './awards'
import { ProjectsForm } from './projects'
import { LanguagesForm } from './languages'
import { ReferencesForm } from './references'

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

export function ResumeForm({
  section,
  onReferencesSaved,
}: {
  section: ResumeSection
  onReferencesSaved?: () => void
}) {
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
