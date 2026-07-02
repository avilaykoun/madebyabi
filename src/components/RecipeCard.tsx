import { Link } from 'react-router-dom'
import type { Recipe } from '../types'
import { totalTime } from '../lib/format'
import { avatarDataUri } from '../assets/logo'

interface RecipeCardProps {
  recipe: Recipe
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link to={`/recipe/${recipe.id}`} className="recipe-card">
      <div className="recipe-card-body">
        <div className="recipe-card-top">
          <img className="card-avatar" src={avatarDataUri} alt="" aria-hidden="true" />
          <span className="recipe-card-category">{recipe.category}</span>
        </div>
        <h2 className="recipe-card-title">{recipe.name}</h2>
        <p className="recipe-card-desc">{recipe.description}</p>
        <div className="recipe-card-meta">
          <span>⏱ {totalTime(recipe.prepMinutes, recipe.bakeMinutes)}</span>
          <span>🍪 {recipe.yield} cookies</span>
          <span>📊 {recipe.difficulty}</span>
        </div>
      </div>
    </Link>
  )
}
