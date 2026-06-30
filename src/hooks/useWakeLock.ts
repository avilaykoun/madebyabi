import { useEffect } from 'react'

interface WakeLockSentinelLike {
  release: () => Promise<void>
}

/**
 * Keeps the screen awake while `active` is true, using the Screen Wake Lock
 * API where available (Safari 16.4+). Re-acquires the lock if the page becomes
 * visible again (the browser drops it on tab switch). Safe no-op elsewhere.
 */
export function useWakeLock(active: boolean) {
  useEffect(() => {
    if (!active) return
    const nav = navigator as Navigator & {
      wakeLock?: { request: (type: 'screen') => Promise<WakeLockSentinelLike> }
    }
    if (!nav.wakeLock) return

    let sentinel: WakeLockSentinelLike | null = null
    let cancelled = false

    const acquire = async () => {
      try {
        sentinel = await nav.wakeLock!.request('screen')
      } catch {
        /* user denied or not allowed — ignore */
      }
    }

    const onVisibility = () => {
      if (document.visibilityState === 'visible' && !cancelled) acquire()
    }

    acquire()
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', onVisibility)
      sentinel?.release().catch(() => undefined)
    }
  }, [active])
}
