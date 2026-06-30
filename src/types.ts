export interface Ingredient {
  /** Amount in the given unit for one base batch. Use 0 for "to taste"/unspecified. */
  quantity: number
  unit: string
  name: string
  /** Optional clarifier shown in lighter text, e.g. "softened" or "packed". */
  note?: string
}

export interface Step {
  instruction: string
  /** When present, the step shows a built-in countdown timer for this many minutes. */
  timerMinutes?: number
}

export type Difficulty = 'Easy' | 'Medium'

export interface Recipe {
  id: string
  name: string
  category: string
  description: string
  /** Cookies produced by one base batch — the basis for batch scaling. */
  yield: number
  prepMinutes: number
  bakeMinutes: number
  ovenTempF: number
  difficulty: Difficulty
  ingredients: Ingredient[]
  steps: Step[]
  tips?: string[]
}
