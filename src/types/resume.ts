export type ContactInfo = {
  fullName: string
  email: string
  phone: string
  location: string
  website?: string
  linkedin?: string
  github?: string
}

export type Experience = {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  current: boolean
  description: string[]
}

export type Education = {
  id: string
  school: string
  degree: string
  field: string
  startDate: string
  endDate: string
  gpa?: string
}

export type Project = {
  id: string
  name: string
  description: string[]
  technologies: string[]
  link?: string
}

export type Skill = {
  id: string
  category: string
  skills: string[]
}

export type Certification = {
  id: string
  name: string
  issuer: string
  date: string
  link?: string
}

export type Award = {
  id: string
  title: string
  issuer: string
  date: string
  description: string
}

export type ResumeStyle = {
  theme: 'modern' | 'classic' | 'minimal'
  fontSize: 'small' | 'medium' | 'large'
  spacing: 'small' | 'medium' | 'large'
  color: string
  font: string
  separator: 'line' | 'double line' | 'bold line' | 'no separator'
  dateFormat: 'MM/YYYY' | 'MMM YYYY' | 'MMMM YYYY'
  showLinks?: boolean
  showSkillProficiency?: boolean
}

export type Language = {
  id: string
  language: string
  proficiency: 'native' | 'fluent' | 'proficient' | 'intermediate' | 'beginner' | 'basic'
}

export type Reference = {
  id: string
  name: string
  relationship: string
  email: string
  phone: string
}

export type ResumeData = {
  contact: ContactInfo
  summary: string
  experience: Experience[]
  education: Education[]
  skills: Skill[]
  projects: Project[]
  certifications: Certification[]
  awards: Award[]
  languages: Language[]
  references: Reference[]
  style: ResumeStyle
}

export interface ResumeState {
  languages: Language[]
  references: Reference[]
  addLanguage: (language: Omit<Language, 'id'>) => void
  updateLanguage: (language: Language) => void
  removeLanguage: (id: string) => void
  addReference: (reference: Omit<Reference, 'id'>) => void
  updateReference: (reference: Reference) => void
  removeReference: (id: string) => void
} 