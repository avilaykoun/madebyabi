// Build-time guard for recipe data. Runs before dev/build so a malformed
// hand-edited recipe fails locally instead of breaking the live app for every
// device. Catches *value* mistakes the TypeScript types can't (duplicate ids,
// non-positive numbers, empty strings). Loaded with Node's type stripping.
import { recipes } from '../src/data/recipes.ts'

const errors = []
const ids = new Set()
const DIFFICULTIES = new Set(['Easy', 'Medium'])

const isText = (v) => typeof v === 'string' && v.trim().length > 0
const isPos = (v) => typeof v === 'number' && v > 0

recipes.forEach((r, i) => {
  const where = r?.name || r?.id || `recipe #${i + 1}`
  const req = (cond, msg) => {
    if (!cond) errors.push(`[${where}] ${msg}`)
  }

  req(isText(r.id), 'missing id')
  if (isText(r.id)) {
    req(!ids.has(r.id), `duplicate id "${r.id}"`)
    ids.add(r.id)
  }
  req(isText(r.name), 'missing name')
  req(isText(r.category), 'missing category')
  req(isText(r.description), 'missing description')
  req(
    DIFFICULTIES.has(r.difficulty),
    `difficulty must be "Easy" or "Medium" (got "${r.difficulty}")`,
  )
  req(isPos(r.yield), 'yield must be a number > 0')
  req(isPos(r.prepMinutes), 'prepMinutes must be a number > 0')
  req(isPos(r.bakeMinutes), 'bakeMinutes must be a number > 0')
  req(isPos(r.ovenTempC), 'ovenTempC must be a number > 0')
  req(
    Array.isArray(r.contains) && r.contains.length > 0,
    'contains must list at least one allergen (use ["None"] if truly none)',
  )

  req(
    Array.isArray(r.ingredients) && r.ingredients.length > 0,
    'needs at least one ingredient',
  )
  ;(r.ingredients ?? []).forEach((ing, j) => {
    const at = `ingredient #${j + 1}`
    req(isText(ing.name), `${at} missing name`)
    req(
      typeof ing.quantity === 'number' && ing.quantity >= 0,
      `${at} quantity must be a number >= 0`,
    )
    req(typeof ing.unit === 'string', `${at} unit must be text (use "" if none)`)
  })

  req(Array.isArray(r.steps) && r.steps.length > 0, 'needs at least one step')
  ;(r.steps ?? []).forEach((s, j) => {
    const at = `step #${j + 1}`
    req(isText(s.instruction), `${at} missing instruction`)
    if (s.timerMinutes !== undefined) {
      req(isPos(s.timerMinutes), `${at} timerMinutes must be a number > 0`)
    }
  })

  if (r.tips !== undefined) req(Array.isArray(r.tips), 'tips must be a list')
})

if (errors.length > 0) {
  console.error(
    `\n✗ Recipe validation failed (${errors.length} issue${
      errors.length > 1 ? 's' : ''
    }):`,
  )
  for (const e of errors) console.error('  - ' + e)
  console.error('\nFix the above in src/data/recipes.ts, then rebuild.\n')
  process.exit(1)
}

console.log(
  `✓ Recipes valid: ${recipes.length} recipes, all checks passed.`,
)
