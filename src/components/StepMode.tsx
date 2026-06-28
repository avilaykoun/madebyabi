import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getRecipe } from '../data/recipes'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useWakeLock } from '../hooks/useWakeLock'
import Timer from './Timer'

export default function StepMode() {
  const { id } = useParams<{ id: string }>()
  const recipe = id ? getRecipe(id) : undefined

  const [current, setCurrent] = useState(0)
  // Persist which steps are checked off, per recipe.
  const [done, setDone] = useLocalStorage<Record<number, boolean>>(
    `steps:${id}`,
    {},
  )

  // Keep the screen awake while baking.
  useWakeLock(true)

  const touchStartX = useRef<number | null>(null)

  if (!recipe) {
    return (
      <div className="page">
        <p className="empty-state">Recipe not found.</p>
        <Link to="/" className="text-link">
          ← Back to recipes
        </Link>
      </div>
    )
  }

  const total = recipe.steps.length
  const step = recipe.steps[current]
  const isLast = current === total - 1

  const goNext = () => setCurrent((c) => Math.min(c + 1, total - 1))
  const goPrev = () => setCurrent((c) => Math.max(c - 1, 0))

  const toggleDone = () =>
    setDone((prev) => ({ ...prev, [current]: !prev[current] }))

  const resetProgress = () => {
    setDone({})
    setCurrent(0)
  }

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (dx < -50) goNext()
    else if (dx > 50) goPrev()
    touchStartX.current = null
  }

  const completedCount = Object.values(done).filter(Boolean).length

  return (
    <div className="step-mode">
      <div className="step-topbar">
        <Link to={`/recipe/${recipe.id}`} className="back-link">
          ← Exit
        </Link>
        <span className="step-counter">
          Step {current + 1} of {total}
        </span>
        <button className="link-button" onClick={resetProgress}>
          Reset
        </button>
      </div>

      <div className="step-progress">
        <div
          className="step-progress-fill"
          style={{ width: `${((current + 1) / total) * 100}%` }}
        />
      </div>

      <div
        className="step-card-area"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className={`step-card ${done[current] ? 'step-card-done' : ''}`}>
          <p className="step-instruction">{step.instruction}</p>
          {step.timerMinutes ? <Timer minutes={step.timerMinutes} /> : null}
          <button
            className={`step-check ${done[current] ? 'step-check-on' : ''}`}
            onClick={toggleDone}
          >
            {done[current] ? '✓ Done' : 'Mark step done'}
          </button>
        </div>
      </div>

      <div className="step-nav">
        <button
          className="nav-button"
          onClick={goPrev}
          disabled={current === 0}
        >
          ← Prev
        </button>
        <span className="step-done-count">{completedCount} done</span>
        {isLast ? (
          <Link to={`/recipe/${recipe.id}`} className="nav-button nav-button-primary">
            Finish ✓
          </Link>
        ) : (
          <button className="nav-button nav-button-primary" onClick={goNext}>
            Next →
          </button>
        )}
      </div>
    </div>
  )
}
