import type { CardState, Grade } from '../types'
import { previewIntervals } from '../lib/srs'

const LABELS: Record<Grade, string> = { again: 'Again', hard: 'Hard', good: 'Good', easy: 'Easy' }
const ALL: Grade[] = ['again', 'hard', 'good', 'easy']

export function GradeBar({
  card, onGrade, allowed, recommended,
}: {
  card: CardState
  onGrade: (g: Grade) => void
  /** When given, grades outside this set are locked (accuracy too low to claim them). */
  allowed?: Grade[]
  recommended?: Grade
}) {
  const previews = previewIntervals(card)
  return (
    <div className="grade-bar">
      {ALL.map(g => {
        const locked = allowed ? !allowed.includes(g) : false
        return (
          <button
            key={g}
            className={`grade grade-${g} ${locked ? 'locked' : ''} ${recommended === g ? 'recommended' : ''}`}
            onClick={() => onGrade(g)}
            disabled={locked}
            title={locked ? 'Recall more of the passage to unlock this' : undefined}
          >
            <span className="grade-label">{LABELS[g]}</span>
            <span className="grade-ivl">{locked ? '🔒' : previews[g]}</span>
          </button>
        )
      })}
    </div>
  )
}
