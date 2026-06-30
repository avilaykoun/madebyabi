import type { Ingredient } from '../types'

/** Unicode fractions for the small spoon/egg amounts that aren't whole. */
const FRACTION_SYMBOLS: Record<string, string> = {
  '1/4': '¼',
  '1/2': '½',
  '3/4': '¾',
  '1/3': '⅓',
  '2/3': '⅔',
}

/** Drop a trailing ".0" so 3.0 shows as "3" but 2.5 stays "2.5". */
function trimDecimal(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1)
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}

/** Build "whole + fraction" rounded to the nearest 1/denominator (denom 2 or 4). */
function toFraction(value: number, denom: number): string {
  const whole = Math.floor(value)
  const n = Math.round((value - whole) * denom)
  if (n === 0) return String(whole)
  if (n === denom) return String(whole + 1)
  const divisor = gcd(n, denom)
  const key = `${n / divisor}/${denom / divisor}`
  const symbol = FRACTION_SYMBOLS[key] ?? `${n}/${denom}`
  return whole > 0 ? `${whole} ${symbol}` : symbol
}

/**
 * Format a scaled quantity for display, choosing a sensible style per unit:
 * - grams / millilitres: whole numbers (one decimal under 10) — metric weights.
 * - tsp / tbsp: nearest quarter as a friendly fraction (e.g. "1 ½").
 * - count items (eggs, unit ""): nearest half.
 */
export function formatQuantity(value: number, unit = ''): string {
  if (value <= 0) return ''
  const u = unit.trim().toLowerCase()

  if (u === 'g' || u === 'ml') {
    return value < 10 ? trimDecimal(value) : String(Math.round(value))
  }
  if (u === 'tsp' || u === 'tbsp') return toFraction(value, 4)
  if (u === '') return toFraction(value, 2)

  return value < 10 ? trimDecimal(value) : String(Math.round(value))
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
