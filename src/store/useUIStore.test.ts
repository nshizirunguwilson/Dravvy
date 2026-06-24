import { describe, it, expect, beforeEach } from 'vitest'
import { useUIStore, sections } from './useUIStore'

beforeEach(() => {
  useUIStore.setState({
    activeSection: 0,
    activeSettingsSection: 0,
    isLoading: false,
    error: null,
  })
})

describe('useUIStore', () => {
  it('has sensible defaults', () => {
    const s = useUIStore.getState()
    expect(s.activeSection).toBe(0)
    expect(s.isLoading).toBe(false)
    expect(s.error).toBeNull()
  })

  it('sets the active section', () => {
    useUIStore.getState().setActiveSection(5)
    expect(useUIStore.getState().activeSection).toBe(5)
  })

  it('sets the active settings section', () => {
    useUIStore.getState().setActiveSettingsSection(2)
    expect(useUIStore.getState().activeSettingsSection).toBe(2)
  })

  it('toggles the loading flag', () => {
    useUIStore.getState().setLoading(true)
    expect(useUIStore.getState().isLoading).toBe(true)
  })

  it('stores and clears an error message', () => {
    useUIStore.getState().setError('Export failed')
    expect(useUIStore.getState().error).toBe('Export failed')
    useUIStore.getState().setError(null)
    expect(useUIStore.getState().error).toBeNull()
  })
})

describe('sections metadata', () => {
  it('exposes the eleven editor sections in order', () => {
    expect(sections).toHaveLength(11)
    expect(sections[0]).toEqual({ id: 'basic', label: 'Basic Information' })
    expect(sections.at(-1)).toEqual({ id: 'export', label: 'Export Resume' })
  })

  it('has a unique id for every section', () => {
    const ids = sections.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
