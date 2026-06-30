import { Link, useNavigate, useParams } from 'react-router-dom'
import { getRecipe } from '../data/recipes'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { formatMinutes } from '../lib/format'
import { formatQuantity, scaleIngredient } from '../lib/scale'
import ScaleControl from './ScaleControl'

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const recipe = id ? getRecipe(id) : undefined

  // Remember the last-used batch size per recipe.
  const [factor, setFactor] = useLocalStorage(`scale:${id}`, 1)

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

  return (
    <div className="page">
      <div className="detail-topbar">
        <Link to="/" className="back-link" aria-label="Back to recipes">
          ← Recipes
        </Link>
      </div>

      <header className="detail-header">
        <span className="recipe-card-category">{recipe.category}</span>
        <h1 className="detail-title">{recipe.name}</h1>
        <p className="detail-desc">{recipe.description}</p>
        <div className="detail-meta">
          <div className="meta-item">
            <span className="meta-value">{formatMinutes(recipe.prepMinutes)}</span>
            <span className="meta-key">Prep</span>
          </div>
          <div className="meta-item">
            <span className="meta-value">{formatMinutes(recipe.bakeMinutes)}</span>
            <span className="meta-key">Bake</span>
          </div>
          <div className="meta-item">
            <span className="meta-value">{recipe.ovenTempC}°C</span>
            <span className="meta-key">Oven ({recipe.ovenTempC - 20}° fan)</span>
          </div>
          <div className="meta-item">
            <span className="meta-value">{recipe.difficulty}</span>
            <span className="meta-key">Level</span>
          </div>
        </div>
        {recipe.contains && recipe.contains.length > 0 ? (
          <p className="allergen-line">
            <span className="allergen-label">Contains:</span>{' '}
            {recipe.contains.join(', ')}
          </p>
        ) : null}
      </header>

      <ScaleControl
        baseYield={recipe.yield}
        factor={factor}
        onChange={setFactor}
      />

      <section className="section">
        <h2 className="section-title">Ingredients</h2>
        <ul className="ingredient-list">
          {recipe.ingredients.map((ing, i) => {
            const amount = scaleIngredient(ing, factor)
            const qty = formatQuantity(amount, ing.unit)
            return (
              <li key={i} className="ingredient-row">
                <span className="ingredient-amount">
                  {qty}
                  {qty && ing.unit ? ' ' : ''}
                  {ing.unit}
                </span>
                <span className="ingredient-name">
                  {ing.name}
                  {ing.note ? (
                    <span className="ingredient-note"> ({ing.note})</span>
                  ) : null}
                </span>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="section">
        <h2 className="section-title">Instructions</h2>
        <ol className="step-preview-list">
          {recipe.steps.map((step, i) => (
            <li key={i} className="step-preview-row">
              {step.instruction}
              {step.timerMinutes ? (
                <span className="step-timer-badge">⏱ {step.timerMinutes} min</span>
              ) : null}
            </li>
          ))}
        </ol>
      </section>

      {recipe.tips && recipe.tips.length > 0 ? (
        <section className="section">
          <h2 className="section-title">Pro tips</h2>
          <ul className="tips-list">
            {recipe.tips.map((tip, i) => (
              <li key={i} className="tip-row">
                💡 {tip}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <button
        className="primary-button bake-button"
        onClick={() => navigate(`/recipe/${recipe.id}/bake`)}
      >
        Start baking →
      </button>
    </div>
  )
}
