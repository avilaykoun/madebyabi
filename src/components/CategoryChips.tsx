interface CategoryChipsProps {
  categories: string[]
  selected: string | null
  onSelect: (category: string | null) => void
}

export default function CategoryChips({
  categories,
  selected,
  onSelect,
}: CategoryChipsProps) {
  return (
    <div className="chip-row" role="group" aria-label="Filter by category">
      <button
        className={`chip ${selected === null ? 'chip-active' : ''}`}
        onClick={() => onSelect(null)}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          className={`chip ${selected === category ? 'chip-active' : ''}`}
          onClick={() => onSelect(category)}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
