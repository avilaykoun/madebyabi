import { useCallback, useEffect, useRef, useState } from 'react'

export type TimerStatus = 'idle' | 'running' | 'paused' | 'done'

/**
 * A countdown timer driven by wall-clock time so it stays accurate even when
 * the tab is backgrounded. Alerts with a beep + vibration when it finishes.
 */
export function useTimer(totalMinutes: number) {
  const totalSeconds = Math.round(totalMinutes * 60)
  const [remaining, setRemaining] = useState(totalSeconds)
  const [status, setStatus] = useState<TimerStatus>('idle')
  const deadlineRef = useRef<number | null>(null)

  // Tick once per second while running, recomputing from the deadline.
  useEffect(() => {
    if (status !== 'running') return
    const id = window.setInterval(() => {
      if (deadlineRef.current == null) return
      const secsLeft = Math.round((deadlineRef.current - Date.now()) / 1000)
      if (secsLeft <= 0) {
        setRemaining(0)
        setStatus('done')
        deadlineRef.current = null
        notify()
      } else {
        setRemaining(secsLeft)
      }
    }, 250)
    return () => window.clearInterval(id)
  }, [status])

  const start = useCallback(() => {
    const secs = remaining > 0 ? remaining : totalSeconds
    deadlineRef.current = Date.now() + secs * 1000
    setRemaining(secs)
    setStatus('running')
  }, [remaining, totalSeconds])

  const pause = useCallback(() => {
    setStatus('paused')
    deadlineRef.current = null
  }, [])

  const reset = useCallback(() => {
    deadlineRef.current = null
    setRemaining(totalSeconds)
    setStatus('idle')
  }, [totalSeconds])

  return { remaining, status, start, pause, reset }
}

/** Play a short beep (Web Audio) and vibrate, if supported. */
function notify() {
  try {
    navigator.vibrate?.([400, 150, 400, 150, 400])
  } catch {
    /* ignore */
  }
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    const ctx = new Ctx()
    const beep = (start: number) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = 880
      gain.gain.setValueAtTime(0.001, ctx.currentTime + start)
      gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + start + 0.02)
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + start + 0.35,
      )
      osc.start(ctx.currentTime + start)
      osc.stop(ctx.currentTime + start + 0.4)
    }
    beep(0)
    beep(0.5)
    beep(1)
  } catch {
    /* audio not available */
  }
}
