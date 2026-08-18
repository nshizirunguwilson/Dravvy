'use client'

import * as React from 'react'
import Link from 'next/link'
import { saveAs } from 'file-saver'
import { toast } from 'sonner'
import { AlertCircle, ArrowRight, CheckCircle2, Download, RotateCcw, Trash2, Upload } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useHydration } from '@/hooks/useHydration'
import {
  buildSnapshot,
  parseSnapshot,
  serializeSnapshot,
  snapshotFilename,
  summarizeSnapshot,
  type ResumeSnapshot,
  type SnapshotResume,
  type SnapshotSummary,
} from '@/lib/resume-io'
import { cn } from '@/lib/utils'
import { useResumeStore } from '@/store/useResumeStore'
import { useUIStore } from '@/store/useUIStore'

const formatSavedAt = (iso: string) => {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return 'an unknown date'
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** Everything the save and import controls need, in one place. */
function useProgressFile() {
  // Selected field by field so the selector never allocates a new object,
  // which keeps useSyncExternalStore happy.
  const contact = useResumeStore((s) => s.contact)
  const summary = useResumeStore((s) => s.summary)
  const experience = useResumeStore((s) => s.experience)
  const education = useResumeStore((s) => s.education)
  const skills = useResumeStore((s) => s.skills)
  const projects = useResumeStore((s) => s.projects)
  const certifications = useResumeStore((s) => s.certifications)
  const awards = useResumeStore((s) => s.awards)
  const languages = useResumeStore((s) => s.languages)
  const references = useResumeStore((s) => s.references)
  const referencesMode = useResumeStore((s) => s.referencesMode)
  const style = useResumeStore((s) => s.style)
  const loadSnapshot = useResumeStore((s) => s.loadSnapshot)
  const resetStore = useResumeStore((s) => s.resetStore)

  const resume = React.useMemo<SnapshotResume>(
    () => ({
      contact,
      summary,
      experience,
      education,
      skills,
      projects,
      certifications,
      awards,
      languages,
      references,
      referencesMode,
      style,
    }),
    [
      contact,
      summary,
      experience,
      education,
      skills,
      projects,
      certifications,
      awards,
      languages,
      references,
      referencesMode,
      style,
    ],
  )

  const builderStep = useUIStore((s) => s.activeSection)
  const settingsStep = useUIStore((s) => s.activeSettingsSection)
  const setActiveSection = useUIStore((s) => s.setActiveSection)
  const setActiveSettingsSection = useUIStore((s) => s.setActiveSettingsSection)

  const entryCount =
    resume.experience.length +
    resume.education.length +
    resume.skills.length +
    resume.certifications.length +
    resume.awards.length +
    resume.projects.length +
    resume.languages.length +
    resume.references.length

  const hasDraft = Boolean(resume.contact.fullName || resume.summary) || entryCount > 0

  const save = React.useCallback(() => {
    const savedAt = new Date()
    const snapshot = buildSnapshot({
      resume,
      progress: { builderStep, settingsStep },
      savedAt,
    })
    const blob = new Blob([serializeSnapshot(snapshot)], {
      type: 'application/json;charset=utf-8',
    })
    const name = snapshotFilename(resume.contact.fullName, savedAt)
    saveAs(blob, name)
    return name
  }, [resume, builderStep, settingsStep])

  const restore = React.useCallback(
    (snapshot: ResumeSnapshot) => {
      loadSnapshot(snapshot.resume)
      setActiveSection(snapshot.progress.builderStep)
      setActiveSettingsSection(snapshot.progress.settingsStep)
    },
    [loadSnapshot, setActiveSection, setActiveSettingsSection],
  )

  const startOver = React.useCallback(() => {
    resetStore()
    setActiveSection(0)
    setActiveSettingsSection(0)
  }, [resetStore, setActiveSection, setActiveSettingsSection])

  return { resume, entryCount, hasDraft, save, restore, startOver }
}

async function readSnapshotFile(file: File) {
  const text = await file.text()
  return parseSnapshot(text)
}

/* ----------------------------------------------------------------------
 * Full panel, used on the settings page
 * -------------------------------------------------------------------- */

export function SaveProgress() {
  const hydrated = useHydration()
  const { resume, entryCount, hasDraft, save, restore, startOver } = useProgressFile()

  const inputRef = React.useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [pending, setPending] = React.useState<
    { snapshot: ResumeSnapshot; summary: SnapshotSummary; fileName: string } | null
  >(null)
  const [restored, setRestored] = React.useState(false)
  const [confirmingReset, setConfirmingReset] = React.useState(false)

  if (!hydrated) return null

  const handleSave = () => {
    const name = save()
    toast.success('Progress saved', { description: `Downloaded as ${name}` })
  }

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    setError(null)
    setRestored(false)

    const result = await readSnapshotFile(file)
    if (!result.ok) {
      setPending(null)
      setError(result.error)
      toast.error('Could not read that file', { description: result.error })
      return
    }

    setPending({
      snapshot: result.snapshot,
      summary: summarizeSnapshot(result.snapshot),
      fileName: file.name,
    })
  }

  const confirmImport = () => {
    if (!pending) return
    restore(pending.snapshot)
    setPending(null)
    setRestored(true)
    toast.success('Progress restored', {
      description: 'Your saved draft is loaded. Carry on where you stopped.',
    })
  }

  return (
    <div className="space-y-8">
      <p className="text-[14px] text-slate-7">
        Drafts live in this browser only. Save a progress file to keep a backup, move to another
        computer, or come back after clearing your site data.
      </p>

      {/* Save */}
      <section className="rounded-xl border border-line bg-surface p-5 shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-[220px] flex-1">
            <h3 className="text-[16px] font-semibold text-slate-12">Save your progress</h3>
            <p className="mt-1 text-[13px] leading-[1.55] text-slate-7">
              Downloads one JSON file holding every section, your styling, and the step you are on.
            </p>
            <p className="mt-3 text-[13px] text-slate-7 num-tabular">
              Current draft:{' '}
              <span className="font-semibold text-slate-12">
                {resume.contact.fullName || 'Unnamed'}
              </span>
              , {entryCount} {entryCount === 1 ? 'entry' : 'entries'}
            </p>
          </div>
          <Button type="button" onClick={handleSave} disabled={!hasDraft} className="gap-2">
            <Download className="h-4 w-4" />
            Save progress file
          </Button>
        </div>
        {!hasDraft && (
          <p className="mt-4 text-[13px] text-slate-7">
            Fill in at least your name to have something worth saving.
          </p>
        )}
      </section>

      {/* Import */}
      <section className="rounded-xl border border-line bg-surface p-5 shadow-xs">
        <h3 className="text-[16px] font-semibold text-slate-12">Continue from a saved file</h3>
        <p className="mt-1 text-[13px] leading-[1.55] text-slate-7">
          Load a progress file to pick up exactly where you stopped. This replaces the draft
          currently in this browser.
        </p>

        <div
          onDragOver={(event) => {
            event.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault()
            setDragging(false)
            void handleFile(event.dataTransfer.files?.[0])
          }}
          className={cn(
            'mt-4 rounded-lg border border-dashed px-5 py-8 text-center transition-colors',
            dragging ? 'border-brand bg-brand-soft' : 'border-line-strong bg-surface-2/40',
          )}
        >
          <Upload className="mx-auto h-6 w-6 text-slate-6" aria-hidden />
          <p className="mt-3 text-[14px] font-medium text-slate-12">
            Drop your progress file here
          </p>
          <p className="mt-1 text-[13px] text-slate-7">JSON files saved by Dravvy</p>
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => inputRef.current?.click()}
          >
            Choose a file
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            aria-label="Progress file"
            onChange={(event) => {
              void handleFile(event.target.files?.[0])
              event.target.value = ''
            }}
          />
        </div>

        {error && (
          <p
            role="alert"
            className="mt-4 flex items-start gap-2 rounded-lg border border-negative/40 bg-negative-soft px-4 py-3 text-[13px] text-negative"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            {error}
          </p>
        )}

        {pending && (
          <div className="mt-4 rounded-lg border border-line bg-surface-2/50 p-4">
            <p className="text-[14px] font-semibold text-slate-12">
              {pending.summary.name}
            </p>
            <p className="mt-1 text-[13px] text-slate-7">
              Saved {formatSavedAt(pending.summary.savedAt)} from {pending.fileName}
            </p>
            {pending.summary.filled.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {pending.summary.filled.map((item) => (
                  <li
                    key={item.label}
                    className="rounded-full border border-line bg-surface px-2.5 py-0.5 text-[12px] text-slate-9 num-tabular"
                  >
                    {item.label}: {item.count}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button type="button" onClick={confirmImport} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Replace my draft
              </Button>
              <Button type="button" variant="ghost" onClick={() => setPending(null)}>
                Cancel
              </Button>
              {hasDraft && (
                <p className="text-[13px] text-slate-7">
                  Your current draft will be overwritten.
                </p>
              )}
            </div>
          </div>
        )}

        {restored && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-positive/40 bg-positive-soft px-4 py-3">
            <p className="flex items-center gap-2 text-[13px] font-medium text-slate-12">
              <CheckCircle2 className="h-4 w-4 text-positive" aria-hidden />
              Draft restored. You are back where you left off.
            </p>
            <Link href="/create">
              <Button type="button" variant="outline" size="sm" className="gap-2">
                Open the editor
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </section>

      {/* Start over */}
      <section className="rounded-xl border border-line bg-surface p-5 shadow-xs">
        <h3 className="text-[16px] font-semibold text-slate-12">Start over</h3>
        <p className="mt-1 text-[13px] leading-[1.55] text-slate-7">
          Empties every section and returns the styling to its defaults. There was no way to do
          this before short of clearing your browser data. Save a progress file first if you might
          want this draft back.
        </p>

        {confirmingReset ? (
          <div
            role="alertdialog"
            aria-label="Confirm starting over"
            className="mt-4 rounded-lg border border-negative/40 bg-negative-soft p-4"
          >
            <p className="text-[13px] font-medium text-slate-12">
              Erase this draft? Everything in it goes, and this cannot be undone.
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <Button
                type="button"
                variant="default"
                onClick={() => {
                  startOver()
                  setConfirmingReset(false)
                  setRestored(false)
                  setPending(null)
                  setError(null)
                  toast.success('Draft cleared', { description: 'You are back to a blank resume.' })
                }}
              >
                Yes, erase it
              </Button>
              <Button type="button" variant="ghost" onClick={() => setConfirmingReset(false)}>
                Keep my draft
              </Button>
            </div>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="mt-4 gap-2"
            disabled={!hasDraft}
            onClick={() => setConfirmingReset(true)}
          >
            <Trash2 className="h-4 w-4" aria-hidden />
            Start over
          </Button>
        )}
      </section>
    </div>
  )
}

/* ----------------------------------------------------------------------
 * Compact card, used in the editor rail
 * -------------------------------------------------------------------- */

export function SaveProgressCompact({ className }: { className?: string }) {
  const hydrated = useHydration()
  const { hasDraft, save, restore } = useProgressFile()
  const inputRef = React.useRef<HTMLInputElement>(null)

  if (!hydrated) return null

  const handleSave = () => {
    const name = save()
    toast.success('Progress saved', { description: `Downloaded as ${name}` })
  }

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    const result = await readSnapshotFile(file)
    if (!result.ok) {
      toast.error('Could not read that file', { description: result.error })
      return
    }
    restore(result.snapshot)
    toast.success('Progress restored', {
      description: 'Your saved draft is loaded. Carry on where you stopped.',
    })
  }

  return (
    <div className={cn('rounded-xl border border-line bg-surface p-4 shadow-sm', className)}>
      <p className="text-[14px] font-semibold text-slate-12">Save and resume</p>
      <p className="mt-1 text-[13px] leading-[1.5] text-slate-7">
        Keep a file of your progress and load it back on any device.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={handleSave}
          disabled={!hasDraft}
        >
          <Download className="h-3.5 w-3.5" />
          Save
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="h-3.5 w-3.5" />
          Import
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          aria-label="Progress file"
          onChange={(event) => {
            void handleFile(event.target.files?.[0])
            event.target.value = ''
          }}
        />
      </div>
    </div>
  )
}
