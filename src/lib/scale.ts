import type { Ingredient } from '../types'

/** Common kitchen fractions, in eighths, for friendly display. */
const FRACTIONS: Array<[number, string]> = [
  [0, ''],
  [1, '⅛'], // 1/8
  [2, '¼'], // 1/4
  [3, '⅜'], // 3/8
  [4, '½'], // 1/2
  [5, '⅝'], // 5/8
  [6, '¾'], // 3/4
  [7, '⅞'], // 7/8
]

/**
 * Format a quantity the way a baker would write it: whole numbers plus the
 * nearest eighth as a unicode fraction (e.g. 1.75 -> "1¾", 0.5 -> "½").
 * Larger amounts (>= 10) are rounded to one decimal to stay readable.
 */
export function formatQuantity(value: number): string {
  if (value <= 0) return ''
  if (value >= 10) {
    return Number.isInteger(value) ? String(value) : value.toFixed(1)
  }

  const whole = Math.floor(value)
  const remainder = value - whole
  // Round the remainder to the nearest eighth.
  const eighths = Math.round(remainder * 8)

  if (eighths === 0) return String(whole)
  if (eighths === 8) return String(whole + 1)

  const fraction = FRACTIONS[eighths][1]
  return whole > 0 ? `${whole}${' '}${fraction}` : fraction
}

/** Scale a single ingredient's quantity by a factor. */
export function scaleIngredient(ingredient: Ingredient, factor: number): number {
  return ingredient.quantity * factor
}

/**
 * Available scale presets. Each multiplies the base batch.
 */
export const SCALE_PRESETS = [0.5, 1, 2, 3] as const

/** Compute the scaled yield (number of cookies), rounded to a whole cookie. */
export function scaledYield(baseYield: number, factor: number): number {
  return Math.round(baseYield * factor)
}

/**
 * Given a base yield and a desired target number of cookies, return the
 * scale factor needed (clamped to a sensible minimum).
 */
export function factorForTarget(baseYield: number, target: number): number {
  if (baseYield <= 0 || target <= 0) return 1
  return Math.max(target / baseYield, 0.1)
}
