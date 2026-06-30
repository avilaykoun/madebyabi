interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="search-bar">
      <span className="search-icon" aria-hidden="true">
        🔍
      </span>
      <input
        type="search"
        className="search-input"
        placeholder="Search recipes…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search recipes"
      />
    </div>
  )
}
