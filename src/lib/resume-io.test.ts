import { describe, expect, it } from 'vitest'

import {
  DEFAULT_STYLE,
  SNAPSHOT_FORMAT,
  SNAPSHOT_VERSION,
  buildSnapshot,
  parseSnapshot,
  serializeSnapshot,
  slugify,
  snapshotFilename,
  summarizeSnapshot,
  type SnapshotResume,
} from './resume-io'

const makeResume = (overrides: Partial<SnapshotResume> = {}): SnapshotResume => ({
  contact: {
    fullName: 'Avery Lin',
    email: 'avery@example.com',
    phone: '+250 700 000 000',
    location: 'Kigali',
  },
  summary: 'Product designer with eight years of practice.',
  experience: [
    {
      id: 'exp-1',
      company: 'Holloway',
      position: 'Lead Designer',
      startDate: '2021-01-01',
      endDate: '',
      current: true,
      description: ['Shipped a redesign', 'Grew activation'],
    },
  ],
  education: [],
  skills: [{ id: 'skill-1', category: 'Design', skills: ['Figma', 'Prototyping'] }],
  projects: [],
  certifications: [],
  awards: [],
  languages: [{ id: 'lang-1', language: 'English', proficiency: 'fluent' }],
  references: [],
  referencesMode: 'uponRequest',
  style: DEFAULT_STYLE,
  ...overrides,
})

describe('buildSnapshot', () => {
  it('stamps the format, version and save time', () => {
    const savedAt = new Date('2026-08-17T09:30:00.000Z')
    const snapshot = buildSnapshot({ resume: makeResume(), savedAt })

    expect(snapshot.format).toBe(SNAPSHOT_FORMAT)
    expect(snapshot.version).toBe(SNAPSHOT_VERSION)
    expect(snapshot.savedAt).toBe('2026-08-17T09:30:00.000Z')
  })

  it('remembers which step the visitor was on', () => {
    const snapshot = buildSnapshot({
      resume: makeResume(),
      progress: { builderStep: 4, settingsStep: 2 },
    })

    expect(snapshot.progress).toEqual({ builderStep: 4, settingsStep: 2 })
  })

  it('clamps steps that are out of range or missing', () => {
    const snapshot = buildSnapshot({
      resume: makeResume(),
      progress: { builderStep: 99, settingsStep: -3 },
    })

    expect(snapshot.progress).toEqual({ builderStep: 8, settingsStep: 0 })
    expect(buildSnapshot({ resume: makeResume() }).progress).toEqual({
      builderStep: 0,
      settingsStep: 0,
    })
  })
})

describe('save then load round trip', () => {
  it('gives back exactly what was saved', () => {
    const resume = makeResume()
    const snapshot = buildSnapshot({ resume, progress: { builderStep: 3, settingsStep: 1 } })

    const result = parseSnapshot(serializeSnapshot(snapshot))

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.snapshot.resume).toEqual(resume)
    expect(result.snapshot.progress).toEqual({ builderStep: 3, settingsStep: 1 })
  })

  it('survives an empty draft', () => {
    const resume = makeResume({
      contact: { fullName: '', email: '', phone: '', location: '' },
      summary: '',
      experience: [],
      skills: [],
      languages: [],
    })
    const result = parseSnapshot(serializeSnapshot(buildSnapshot({ resume })))

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.snapshot.resume.contact.fullName).toBe('')
    expect(result.snapshot.resume.experience).toEqual([])
  })
})

describe('parseSnapshot', () => {
  it('rejects text that is not JSON', () => {
    const result = parseSnapshot('not a file')
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error).toMatch(/not valid JSON/i)
  })

  it('rejects JSON that came from somewhere else', () => {
    const result = parseSnapshot(JSON.stringify({ hello: 'world' }))
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error).toMatch(/not saved by Dravvy/i)
  })

  it('rejects a Dravvy file with a damaged body', () => {
    const result = parseSnapshot(
      JSON.stringify({ format: SNAPSHOT_FORMAT, version: 1, resume: 'nope' }),
    )
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error).toMatch(/damaged/i)
  })

  it('refuses files from a newer version', () => {
    const snapshot = buildSnapshot({ resume: makeResume() })
    const result = parseSnapshot(JSON.stringify({ ...snapshot, version: SNAPSHOT_VERSION + 1 }))

    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error).toMatch(/newer version/i)
  })

  it('fills in missing fields rather than failing', () => {
    const result = parseSnapshot(
      JSON.stringify({
        format: SNAPSHOT_FORMAT,
        version: 1,
        resume: { contact: { fullName: 'Sam' }, experience: [{ company: 'Acme' }] },
      }),
    )

    expect(result.ok).toBe(true)
    if (!result.ok) return
    const { resume } = result.snapshot
    expect(resume.contact).toEqual({
      fullName: 'Sam',
      email: '',
      phone: '',
      location: '',
      website: undefined,
      linkedin: undefined,
      github: undefined,
    })
    expect(resume.experience[0].company).toBe('Acme')
    expect(resume.experience[0].position).toBe('')
    expect(resume.experience[0].current).toBe(false)
    expect(resume.experience[0].description).toEqual([])
    expect(resume.experience[0].id).toBeTruthy()
    expect(resume.style).toEqual(DEFAULT_STYLE)
    expect(resume.referencesMode).toBe('uponRequest')
  })

  it('falls back on styling values it does not recognise', () => {
    const result = parseSnapshot(
      JSON.stringify({
        format: SNAPSHOT_FORMAT,
        version: 1,
        resume: {
          style: { theme: 'neon', fontSize: 'huge', color: 'blue', separator: 'squiggle' },
          languages: [{ language: 'Kinyarwanda', proficiency: 'telepathic' }],
        },
      }),
    )

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.snapshot.resume.style.theme).toBe('modern')
    expect(result.snapshot.resume.style.fontSize).toBe('medium')
    expect(result.snapshot.resume.style.color).toBe(DEFAULT_STYLE.color)
    expect(result.snapshot.resume.style.separator).toBe('line')
    expect(result.snapshot.resume.languages[0].proficiency).toBe('proficient')
  })

  it('keeps a valid custom accent colour', () => {
    const result = parseSnapshot(
      JSON.stringify({
        format: SNAPSHOT_FORMAT,
        version: 1,
        resume: { style: { color: '#0F172A' } },
      }),
    )

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.snapshot.resume.style.color).toBe('#0F172A')
  })
})

describe('slugify and snapshotFilename', () => {
  it('turns a name into a safe slug', () => {
    expect(slugify('Avery  Lin!')).toBe('avery-lin')
    expect(slugify('   ')).toBe('resume')
  })

  it('names the file after the person and the day', () => {
    const name = snapshotFilename('Avery Lin', new Date('2026-08-17T09:30:00.000Z'))
    expect(name).toBe('avery-lin-dravvy-progress-2026-08-17.json')
  })

  it('falls back when there is no name yet', () => {
    const name = snapshotFilename('', new Date('2026-08-17T09:30:00.000Z'))
    expect(name).toBe('my-dravvy-progress-2026-08-17.json')
  })
})

describe('summarizeSnapshot', () => {
  it('counts only the sections that hold something', () => {
    const summary = summarizeSnapshot(buildSnapshot({ resume: makeResume() }))

    expect(summary.name).toBe('Avery Lin')
    expect(summary.entries).toBe(3)
    expect(summary.filled.map((item) => item.label)).toEqual([
      'Work experience',
      'Skill groups',
      'Languages',
    ])
  })

  it('labels a nameless draft', () => {
    const resume = makeResume({ contact: { fullName: '', email: '', phone: '', location: '' } })
    expect(summarizeSnapshot(buildSnapshot({ resume })).name).toBe('Unnamed draft')
  })
})

describe('serializeSnapshot', () => {
  it('writes readable JSON ending in a newline', () => {
    const text = serializeSnapshot(buildSnapshot({ resume: makeResume() }))
    expect(text.endsWith('\n')).toBe(true)
    expect(text).toContain('\n  "format": "dravvy.resume-progress"')
  })
})
