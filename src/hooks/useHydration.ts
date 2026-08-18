import { useEffect, useState } from 'react'

import { useResumeStore } from '@/store/useResumeStore'

/**
 * True once the persisted draft has been read back from localStorage.
 *
 * This used to call `persist.rehydrate()` itself. The persist middleware
 * already hydrates on creation, so that second pass re-read localStorage and
 * overwrote whatever was in memory. Type fast enough on a fresh page and your
 * first keystrokes were wiped when it landed. Safari showed it first because
 * it resolves a touch later than Chromium.
 *
 * Now it only observes, and never writes.
 */
export function useHydration() {
  const [hydrated, setHydrated] = useState(() => useResumeStore.persist.hasHydrated())

  useEffect(() => {
    const unsubscribe = useResumeStore.persist.onFinishHydration(() => setHydrated(true))
    // Hydration may already have finished before this effect ran.
    if (useResumeStore.persist.hasHydrated()) setHydrated(true)
    return unsubscribe
  }, [])

  return hydrated
}
