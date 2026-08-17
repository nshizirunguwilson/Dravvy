import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const saveAs = vi.fn()
vi.mock('file-saver', () => ({ saveAs: (...args: unknown[]) => saveAs(...args) }))

import { SaveProgress, SaveProgressCompact } from '@/components/save-progress'
import { buildSnapshot, serializeSnapshot, type SnapshotResume } from '@/lib/resume-io'
import { useResumeStore } from '@/store/useResumeStore'
import { useUIStore } from '@/store/useUIStore'

const savedResume: SnapshotResume = {
  contact: {
    fullName: 'Avery Lin',
    email: 'avery@example.com',
    phone: '0700000000',
    location: 'Kigali',
  },
  summary: 'Designer.',
  experience: [
    {
      id: 'exp-1',
      company: 'Holloway',
      position: 'Lead Designer',
      startDate: '2021-01-01',
      endDate: '',
      current: true,
      description: ['Shipped a redesign'],
    },
  ],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  awards: [],
  languages: [],
  references: [],
  referencesMode: 'uponRequest',
  style: {
    theme: 'classic',
    fontSize: 'large',
    spacing: 'small',
    color: '#0F172A',
    font: 'georgia',
    separator: 'bold line',
    dateFormat: 'MMM YYYY',
    showLinks: true,
    showSkillProficiency: true,
  },
}

const progressFile = (name = 'avery-lin-dravvy-progress-2026-08-17.json') =>
  new File(
    [
      serializeSnapshot(
        buildSnapshot({
          resume: savedResume,
          progress: { builderStep: 5, settingsStep: 2 },
          savedAt: new Date('2026-08-17T09:30:00.000Z'),
        }),
      ),
    ],
    name,
    { type: 'application/json' },
  )

beforeEach(() => {
  saveAs.mockClear()
  useResumeStore.getState().resetStore()
  useUIStore.setState({ activeSection: 0, activeSettingsSection: 0 })
})

describe('SaveProgress, saving', () => {
  it('downloads a file named after the draft', async () => {
    const user = userEvent.setup()
    useResumeStore.getState().updateContact({
      fullName: 'Avery Lin',
      email: 'a@b.com',
      phone: '1',
      location: 'Kigali',
    })

    render(<SaveProgress />)
    await user.click(await screen.findByRole('button', { name: /save progress file/i }))

    expect(saveAs).toHaveBeenCalledTimes(1)
    const [, filename] = saveAs.mock.calls[0]
    expect(filename).toMatch(/^avery-lin-dravvy-progress-\d{4}-\d{2}-\d{2}\.json$/)
  })

  it('stays disabled while there is nothing to save', async () => {
    render(<SaveProgress />)
    expect(await screen.findByRole('button', { name: /save progress file/i })).toBeDisabled()
  })
})

describe('SaveProgress, importing', () => {
  it('previews the file before touching the current draft', async () => {
    const user = userEvent.setup()
    render(<SaveProgress />)

    await user.upload(await screen.findByLabelText(/progress file/i), progressFile())

    expect(await screen.findByText('Avery Lin')).toBeInTheDocument()
    expect(screen.getByText(/work experience: 1/i)).toBeInTheDocument()
    // Nothing has been written to the store yet.
    expect(useResumeStore.getState().contact.fullName).toBe('')
  })

  it('restores the draft and the step on confirmation', async () => {
    const user = userEvent.setup()
    render(<SaveProgress />)

    await user.upload(await screen.findByLabelText(/progress file/i), progressFile())
    await user.click(await screen.findByRole('button', { name: /replace my draft/i }))

    await waitFor(() => {
      expect(useResumeStore.getState().contact.fullName).toBe('Avery Lin')
    })
    expect(useResumeStore.getState().experience).toHaveLength(1)
    expect(useResumeStore.getState().style.font).toBe('georgia')
    expect(useUIStore.getState().activeSection).toBe(5)
    expect(useUIStore.getState().activeSettingsSection).toBe(2)
    expect(await screen.findByText(/draft restored/i)).toBeInTheDocument()
  })

  it('leaves the draft alone when the import is cancelled', async () => {
    const user = userEvent.setup()
    render(<SaveProgress />)

    await user.upload(await screen.findByLabelText(/progress file/i), progressFile())
    await user.click(await screen.findByRole('button', { name: /^cancel$/i }))

    expect(screen.queryByRole('button', { name: /replace my draft/i })).not.toBeInTheDocument()
    expect(useResumeStore.getState().contact.fullName).toBe('')
  })

  it('explains itself when the file is not one of ours', async () => {
    const user = userEvent.setup()
    render(<SaveProgress />)

    await user.upload(
      await screen.findByLabelText(/progress file/i),
      new File(['{"hello":"world"}'], 'other.json', { type: 'application/json' }),
    )

    expect(await screen.findByRole('alert')).toHaveTextContent(/not saved by Dravvy/i)
    expect(useResumeStore.getState().contact.fullName).toBe('')
  })
})

describe('SaveProgress, drag and drop', () => {
  it('accepts a file dropped onto the zone', async () => {
    render(<SaveProgress />)
    const zone = (await screen.findByText(/drop your progress file here/i)).parentElement as HTMLElement

    fireEvent.dragOver(zone)
    fireEvent.drop(zone, { dataTransfer: { files: [progressFile()] } })

    expect(await screen.findByText('Avery Lin')).toBeInTheDocument()
  })

  it('drops the highlight again when the file is dragged away', async () => {
    render(<SaveProgress />)
    const zone = (await screen.findByText(/drop your progress file here/i)).parentElement as HTMLElement

    fireEvent.dragOver(zone)
    expect(zone.className).toContain('border-brand')
    fireEvent.dragLeave(zone)
    expect(zone.className).not.toContain('border-brand')
  })

  it('ignores a drop that carries no file', async () => {
    render(<SaveProgress />)
    const zone = (await screen.findByText(/drop your progress file here/i)).parentElement as HTMLElement

    fireEvent.drop(zone, { dataTransfer: { files: [] } })

    expect(screen.queryByRole('button', { name: /replace my draft/i })).not.toBeInTheDocument()
  })
})

describe('SaveProgressCompact', () => {
  it('downloads the progress file', async () => {
    const user = userEvent.setup()
    useResumeStore.getState().updateSummary('A summary.')

    render(<SaveProgressCompact />)
    await user.click(await screen.findByRole('button', { name: /^save$/i }))

    expect(saveAs).toHaveBeenCalledTimes(1)
  })

  it('reports a file it cannot read without changing the draft', async () => {
    const user = userEvent.setup()
    render(<SaveProgressCompact />)

    await user.upload(
      await screen.findByLabelText(/progress file/i),
      new File(['nonsense'], 'broken.json', { type: 'application/json' }),
    )

    await waitFor(() => {
      expect(useResumeStore.getState().contact.fullName).toBe('')
    })
  })


  it('imports in one step from the editor rail', async () => {
    const user = userEvent.setup()
    render(<SaveProgressCompact />)

    await user.upload(await screen.findByLabelText(/progress file/i), progressFile())

    await waitFor(() => {
      expect(useResumeStore.getState().contact.fullName).toBe('Avery Lin')
    })
    expect(useUIStore.getState().activeSection).toBe(5)
  })

  it('offers saving only once the draft has something in it', async () => {
    const { unmount } = render(<SaveProgressCompact />)
    expect(await screen.findByRole('button', { name: /save/i })).toBeDisabled()
    unmount()

    useResumeStore.getState().updateSummary('A summary.')
    render(<SaveProgressCompact />)
    expect(await screen.findByRole('button', { name: /save/i })).toBeEnabled()
  })
})
