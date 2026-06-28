/** Format a number of minutes as a friendly duration, e.g. 75 -> "1 hr 15 min". */
export function formatMinutes(total: number): string {
  if (total <= 0) return '—'
  const hours = Math.floor(total / 60)
  const minutes = total % 60
  if (hours === 0) return `${minutes} min`
  if (minutes === 0) return `${hours} hr`
  return `${hours} hr ${minutes} min`
}

/** Format seconds as mm:ss for timer displays. */
export function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds))
  const minutes = Math.floor(safe / 60)
  const seconds = safe % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

/** Total active time for a recipe (prep + bake). */
export function totalTime(prepMinutes: number, bakeMinutes: number): string {
  return formatMinutes(prepMinutes + bakeMinutes)
}
