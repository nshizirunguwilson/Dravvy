import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Section =
  | 'basic'
  | 'work'
  | 'education'
  | 'skills'
  | 'certifications'
  | 'projects'
  | 'languages'
  | 'references'
  | 'styling'
  | 'preview'
  | 'export'

interface UIState {
  activeSection: number
  activeSettingsSection: number
  isLoading: boolean
  error: string | null
  setActiveSection: (section: number) => void
  setActiveSettingsSection: (section: number) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      activeSection: 0,
      activeSettingsSection: 0,
      isLoading: false,
      error: null,
      setActiveSection: (section) => set({ activeSection: section }),
      setActiveSettingsSection: (section) => set({ activeSettingsSection: section }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'ui-store',
    }
  )
)

export const sections: { id: Section; label: string }[] = [
  { id: 'basic', label: 'Basic Information' },
  { id: 'work', label: 'Work Experience' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'projects', label: 'Projects' },
  { id: 'languages', label: 'Languages' },
  { id: 'references', label: 'References' },
  { id: 'styling', label: 'Resume Styling' },
  { id: 'preview', label: 'Resume Preview' },
  { id: 'export', label: 'Export Resume' },
] 