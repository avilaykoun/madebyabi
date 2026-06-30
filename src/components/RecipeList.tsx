import { useMemo, useState } from 'react'
import { categories, recipes } from '../data/recipes'
import RecipeCard from './RecipeCard'
import SearchBar from './SearchBar'
import CategoryChips from './CategoryChips'

export default function RecipeList() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return recipes.filter((recipe) => {
      const matchesCategory = category === null || recipe.category === category
      const matchesQuery =
        q === '' ||
        recipe.name.toLowerCase().includes(q) ||
        recipe.description.toLowerCase().includes(q) ||
        recipe.category.toLowerCase().includes(q)
      return matchesCategory && matchesQuery
    })
  }, [query, category])

  return (
    <div className="page">
      <header className="app-header">
        <h1 className="app-title">Made by Abi</h1>
        <p className="app-subtitle">Brown butter cookies, baked fresh in Sydney</p>
      </header>

      <SearchBar value={query} onChange={setQuery} />
      <CategoryChips
        categories={categories}
        selected={category}
        onSelect={setCategory}
      />

      {filtered.length === 0 ? (
        <p className="empty-state">No recipes match your search.</p>
      ) : (
        <div className="recipe-grid">
          {filtered.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  )
}
