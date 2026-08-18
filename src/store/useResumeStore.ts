import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { SnapshotResume } from '@/lib/resume-io';
import type {
  ResumeData,
  ContactInfo,
  Experience,
  Education,
  Project,
  Skill,
  Certification,
  Award,
  ResumeStyle,
  Language,
  Reference,
} from '@/types/resume';

/** The list-shaped parts of a resume, the ones with add, remove and reorder. */
export type CollectionKey =
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'awards'
  | 'languages'
  | 'references';

interface ResumeState extends ResumeData {
  activeSection: number;
  setActiveSection: (section: number) => void;

  // References mode (upon request / include)
  referencesMode: 'uponRequest' | 'include';
  setReferencesMode: (mode: 'uponRequest' | 'include') => void;
  
  // Contact
  updateContact: (contact: ContactInfo) => void;
  
  // Summary
  updateSummary: (summary: string) => void;
  
  // Experience
  addExperience: (experience: Omit<Experience, 'id'>) => void;
  updateExperience: (experience: Experience) => void;
  removeExperience: (id: string) => void;
  reorderExperience: (startIndex: number, endIndex: number) => void;
  
  // Education
  addEducation: (education: Omit<Education, 'id'>) => void;
  updateEducation: (education: Education) => void;
  removeEducation: (id: string) => void;
  reorderEducation: (startIndex: number, endIndex: number) => void;
  
  // Skills
  addSkill: (skill: Omit<Skill, 'id'>) => void;
  updateSkill: (skill: Skill) => void;
  removeSkill: (id: string) => void;
  reorderSkills: (startIndex: number, endIndex: number) => void;
  
  // Projects
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (project: Project) => void;
  removeProject: (id: string) => void;
  reorderProjects: (startIndex: number, endIndex: number) => void;
  
  // Certifications
  addCertification: (certification: Omit<Certification, 'id'>) => void;
  updateCertification: (certification: Certification) => void;
  removeCertification: (id: string) => void;
  reorderCertifications: (startIndex: number, endIndex: number) => void;
  
  // Awards
  addAward: (award: Omit<Award, 'id'>) => void;
  updateAward: (award: Award) => void;
  removeAward: (id: string) => void;
  reorderAwards: (startIndex: number, endIndex: number) => void;
  
  // Style
  updateStyle: (style: ResumeStyle) => void;
  
  // Reset
  resetStore: () => void;

  // Save and resume: replace the whole draft with an imported one
  loadSnapshot: (resume: SnapshotResume) => void;

  // Languages and references were the only collections without reordering
  reorderLanguages: (startIndex: number, endIndex: number) => void;
  reorderReferences: (startIndex: number, endIndex: number) => void;

  /**
   * Puts a whole collection back as it was. Used to undo a deletion, where
   * re-adding is not enough because the entry has to return to its position.
   */
  replaceCollection: <K extends CollectionKey>(key: K, items: ResumeState[K]) => void;

  languages: Language[];
  references: Reference[];
  addLanguage: (language: Omit<Language, 'id'>) => void;
  updateLanguage: (language: Language) => void;
  removeLanguage: (id: string) => void;
  addReference: (reference: Omit<Reference, 'id'>) => void;
  updateReference: (reference: Reference) => void;
  removeReference: (id: string) => void;
}

const initialState: Omit<ResumeState, keyof Omit<ResumeState, keyof ResumeData | 'activeSection' | 'referencesMode'>> = {
  activeSection: 0,
  referencesMode: 'uponRequest',
  contact: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  awards: [],
  style: {
    theme: 'modern',
    fontSize: 'medium',
    spacing: 'medium',
    color: '#2563eb',
    font: 'helvetica',
    separator: 'line',
    dateFormat: 'MM/YYYY',
    showLinks: true,
    showSkillProficiency: true,
  },
  languages: [],
  references: [],
};

export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => ({
      ...initialState,
      
      // Navigation
      setActiveSection: (section) => set({ activeSection: section }),

      // References mode
      setReferencesMode: (mode) => set({ referencesMode: mode }),
      
      // Contact
      updateContact: (contact) => set({ contact }),
      
      // Summary
      updateSummary: (summary) => set({ summary }),
      
      // Experience
      addExperience: (experience) =>
        set((state) => ({
          experience: [...state.experience, { ...experience, id: uuidv4() }],
        })),
      updateExperience: (experience) =>
        set((state) => ({
          experience: state.experience.map((exp) =>
            exp.id === experience.id ? experience : exp
          ),
        })),
      removeExperience: (id) =>
        set((state) => ({
          experience: state.experience.filter((exp) => exp.id !== id),
        })),
      reorderExperience: (startIndex, endIndex) =>
        set((state) => {
          const result = Array.from(state.experience);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return { experience: result };
        }),
      
      // Education
      addEducation: (education) =>
        set((state) => ({
          education: [...state.education, { ...education, id: uuidv4() }],
        })),
      updateEducation: (education) =>
        set((state) => ({
          education: state.education.map((edu) =>
            edu.id === education.id ? education : edu
          ),
        })),
      removeEducation: (id) =>
        set((state) => ({
          education: state.education.filter((edu) => edu.id !== id),
        })),
      reorderEducation: (startIndex, endIndex) =>
        set((state) => {
          const result = Array.from(state.education);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return { education: result };
        }),
      
      // Skills
      addSkill: (skill) =>
        set((state) => ({
          skills: [...state.skills, { ...skill, id: uuidv4() }],
        })),
      updateSkill: (skill) =>
        set((state) => ({
          skills: state.skills.map((s) => (s.id === skill.id ? skill : s)),
        })),
      removeSkill: (id) =>
        set((state) => ({
          skills: state.skills.filter((s) => s.id !== id),
        })),
      reorderSkills: (startIndex, endIndex) =>
        set((state) => {
          const result = Array.from(state.skills);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return { skills: result };
        }),
      
      // Projects
      addProject: (project) =>
        set((state) => ({
          projects: [...state.projects, { ...project, id: uuidv4() }],
        })),
      updateProject: (project) =>
        set((state) => ({
          projects: state.projects.map((p) => (p.id === project.id ? project : p)),
        })),
      removeProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        })),
      reorderProjects: (startIndex, endIndex) =>
        set((state) => {
          const result = Array.from(state.projects);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return { projects: result };
        }),
      
      // Certifications
      addCertification: (certification) =>
        set((state) => ({
          certifications: [...state.certifications, { ...certification, id: uuidv4() }],
        })),
      updateCertification: (certification) =>
        set((state) => ({
          certifications: state.certifications.map((c) =>
            c.id === certification.id ? certification : c
          ),
        })),
      removeCertification: (id) =>
        set((state) => ({
          certifications: state.certifications.filter((c) => c.id !== id),
        })),
      reorderCertifications: (startIndex, endIndex) =>
        set((state) => {
          const result = Array.from(state.certifications);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return { certifications: result };
        }),
      
      // Awards
      addAward: (award) =>
        set((state) => ({
          awards: [...state.awards, { ...award, id: uuidv4() }],
        })),
      updateAward: (award) =>
        set((state) => ({
          awards: state.awards.map((a) => (a.id === award.id ? award : a)),
        })),
      removeAward: (id) =>
        set((state) => ({
          awards: state.awards.filter((a) => a.id !== id),
        })),
      reorderAwards: (startIndex, endIndex) =>
        set((state) => {
          const result = Array.from(state.awards);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return { awards: result };
        }),
      
      // Style
      updateStyle: (style) => set({ style }),
      
      // Reset
      resetStore: () => set(initialState),

      // Save and resume
      loadSnapshot: (resume) =>
        set({
          contact: resume.contact,
          summary: resume.summary,
          experience: resume.experience,
          education: resume.education,
          skills: resume.skills,
          projects: resume.projects,
          certifications: resume.certifications,
          awards: resume.awards,
          languages: resume.languages,
          references: resume.references,
          referencesMode: resume.referencesMode,
          style: resume.style,
        }),

      addLanguage: (language) =>
        set((state) => ({
          languages: [...state.languages, { ...language, id: uuidv4() }],
        })),
      updateLanguage: (language) =>
        set((state) => ({
          languages: state.languages.map((l) =>
            l.id === language.id ? language : l
          ),
        })),
      removeLanguage: (id) =>
        set((state) => ({
          languages: state.languages.filter((l) => l.id !== id),
        })),
      addReference: (reference) =>
        set((state) => ({
          references: [...state.references, { ...reference, id: uuidv4() }],
        })),
      updateReference: (reference) =>
        set((state) => ({
          references: state.references.map((r) =>
            r.id === reference.id ? reference : r
          ),
        })),
      removeReference: (id) =>
        set((state) => ({
          references: state.references.filter((r) => r.id !== id),
        })),
      reorderLanguages: (startIndex, endIndex) =>
        set((state) => {
          const result = Array.from(state.languages);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return { languages: result };
        }),
      reorderReferences: (startIndex, endIndex) =>
        set((state) => {
          const result = Array.from(state.references);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return { references: result };
        }),
      replaceCollection: (key, items) => set({ [key]: items } as Pick<ResumeState, typeof key>),
    }),
    {
      name: 'resume-store',
    }
  )
);