import { useEffect, useState } from 'react'

import { useResumeStore } from '@/store/useResumeStore'

/**
 * True once the persisted draft has been read back from storage.
 *
 * Two things this must not do.
 *
 * It must not call `persist.rehydrate()`. The middleware already hydrates on
 * creation, so a second pass re-read storage and overwrote whatever was in
 * memory: type fast enough on a fresh page and your first keystrokes vanished.
 *
 * It must not touch `persist` while rendering. There is no localStorage on the
 * server, so zustand never attaches the persist API there, and reading it
 * during a prerender crashes the build. Everything here happens in an effect,
 * which only ever runs in the browser.
 */
export function useHydration() {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const persist = useResumeStore.persist
    if (!persist) {
      // No persistence available, so there is nothing to wait for.
      setHydrated(true)
      return
    }

    const unsubscribe = persist.onFinishHydration(() => setHydrated(true))
    if (persist.hasHydrated()) setHydrated(true)
    return unsubscribe
  }, [])

  return hydrated
}
