import type { CardState, Grade } from '../types'
import { previewIntervals } from '../lib/srs'

const LABELS: Record<Grade, string> = { again: 'Again', hard: 'Hard', good: 'Good', easy: 'Easy' }

export function GradeBar({ card, onGrade }: { card: CardState; onGrade: (g: Grade) => void }) {
  const previews = previewIntervals(card)
  return (
    <div className="grade-bar">
      {(['again', 'hard', 'good', 'easy'] as Grade[]).map(g => (
        <button key={g} className={`grade grade-${g}`} onClick={() => onGrade(g)}>
          <span className="grade-label">{LABELS[g]}</span>
          <span className="grade-ivl">{previews[g]}</span>
        </button>
      ))}
    </div>
  )
}
