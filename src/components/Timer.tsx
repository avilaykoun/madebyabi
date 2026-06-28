import { useTimer } from '../hooks/useTimer'
import { formatClock } from '../lib/format'

interface TimerProps {
  minutes: number
}

export default function Timer({ minutes }: TimerProps) {
  const { remaining, status, start, pause, reset } = useTimer(minutes)

  return (
    <div className={`timer ${status === 'done' ? 'timer-done' : ''}`}>
      <div className="timer-clock" aria-live="polite">
        {formatClock(remaining)}
      </div>
      <div className="timer-controls">
        {status === 'running' ? (
          <button className="timer-btn" onClick={pause}>
            Pause
          </button>
        ) : (
          <button className="timer-btn timer-btn-primary" onClick={start}>
            {status === 'paused' ? 'Resume' : 'Start timer'}
          </button>
        )}
        <button className="timer-btn" onClick={reset}>
          Reset
        </button>
      </div>
      {status === 'done' ? <p className="timer-message">Time's up! 🔔</p> : null}
    </div>
  )
}
