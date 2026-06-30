import { SCALE_PRESETS, scaledYield } from '../lib/scale'

interface ScaleControlProps {
  baseYield: number
  factor: number
  onChange: (factor: number) => void
}

export default function ScaleControl({
  baseYield,
  factor,
  onChange,
}: ScaleControlProps) {
  return (
    <div className="scale-control">
      <div className="scale-header">
        <span className="scale-label">Batch size</span>
        <span className="scale-yield">
          Makes ~{scaledYield(baseYield, factor)} cookies
        </span>
      </div>
      <div className="chip-row">
        {SCALE_PRESETS.map((preset) => (
          <button
            key={preset}
            className={`chip ${factor === preset ? 'chip-active' : ''}`}
            onClick={() => onChange(preset)}
          >
            {preset === 0.5 ? '½×' : `${preset}×`}
          </button>
        ))}
      </div>
      <label className="scale-target">
        Or enter a target number of cookies:
        <input
          type="number"
          min={1}
          inputMode="numeric"
          className="scale-target-input"
          value={scaledYield(baseYield, factor)}
          onChange={(e) => {
            const target = Number(e.target.value)
            if (target > 0 && baseYield > 0) onChange(target / baseYield)
          }}
        />
      </label>
    </div>
  )
}
