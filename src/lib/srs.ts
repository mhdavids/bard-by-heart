import type { CardState, Grade } from '../types'

const MIN = 60_000
const DAY = 86_400_000

/** Level meanings: 1 cloze-light · 2 cloze-heavy · 3 first letters · 4+ from memory. */
export const MAX_LEARNING_LEVEL = 3
export const BY_HEART_LEVEL = 4

export function newCard(id: string, now = Date.now()): CardState {
  return { id, level: 1, ease: 2.5, ivl: 0, due: now, reps: 0, lapses: 0 }
}

/**
 * Map a measured recall accuracy (0–1) to which self-grades are honest.
 * You cannot claim a passage is easy when you only produced half of it —
 * the accuracy you actually typed caps how high you're allowed to grade.
 */
export function recallGrades(accuracy: number, usedHint: boolean): { allowed: Grade[]; recommended: Grade } {
  if (usedHint || accuracy < 0.6) return { allowed: ['again'], recommended: 'again' }
  if (accuracy < 0.9) return { allowed: ['again', 'hard'], recommended: 'hard' }
  if (accuracy < 1) return { allowed: ['again', 'hard', 'good'], recommended: 'good' }
  return { allowed: ['again', 'hard', 'good', 'easy'], recommended: 'good' }
}

/** Days between learning levels when graded Good. */
const LEARNING_STEP_DAYS = [0, 1, 1, 2] // index by level 0..3 (level 0 unused)
const FIRST_REVIEW_DAYS = 4

function withDue(c: CardState, ms: number, now: number): CardState {
  return { ...c, due: now + ms }
}

export function applyGrade(card: CardState, grade: Grade, now = Date.now()): CardState {
  const c: CardState = { ...card, reps: card.reps + 1 }

  if (grade === 'again') {
    const level = Math.max(1, c.level - 1)
    return withDue(
      { ...c, level, ivl: 0, lapses: c.lapses + 1, ease: Math.max(1.3, c.ease - 0.2) },
      10 * MIN, now,
    )
  }

  if (c.level <= MAX_LEARNING_LEVEL) {
    // Learning ladder
    if (grade === 'hard') return withDue({ ...c, ivl: 0 }, 1 * DAY, now)
    const jump = grade === 'easy' ? 2 : 1
    const level = Math.min(BY_HEART_LEVEL, c.level + jump)
    if (level <= MAX_LEARNING_LEVEL) {
      return withDue({ ...c, level, ivl: 0 }, LEARNING_STEP_DAYS[c.level] * DAY, now)
    }
    // Graduating to "from memory"
    const ivl = grade === 'easy' ? FIRST_REVIEW_DAYS + 2 : FIRST_REVIEW_DAYS
    return withDue({ ...c, level, ivl }, ivl * DAY, now)
  }

  // Review phase (level >= 4): SM-2-ish
  if (grade === 'hard') {
    const ivl = Math.max(1, Math.round(c.ivl * 1.2))
    return withDue({ ...c, ivl, ease: Math.max(1.3, c.ease - 0.05) }, ivl * DAY, now)
  }
  if (grade === 'good') {
    const ivl = Math.max(c.ivl + 1, Math.round(c.ivl * c.ease))
    return withDue({ ...c, level: c.level + 1, ivl }, ivl * DAY, now)
  }
  // easy
  const ivl = Math.max(c.ivl + 2, Math.round(c.ivl * c.ease * 1.35))
  return withDue({ ...c, level: c.level + 1, ivl, ease: c.ease + 0.1 }, ivl * DAY, now)
}

export function isByHeart(c: CardState | undefined): boolean {
  return !!c && c.level >= BY_HEART_LEVEL
}

function fmtMs(ms: number): string {
  if (ms < 60 * MIN) return `${Math.max(1, Math.round(ms / MIN))}m`
  if (ms < DAY) return `${Math.round(ms / (60 * MIN))}h`
  const days = Math.round(ms / DAY)
  if (days < 30) return `${days}d`
  return `${Math.round(days / 30.4)}mo`
}

/** Preview labels for the grade bar, e.g. { again: '10m', good: '3d' }. */
export function previewIntervals(card: CardState, now = Date.now()): Record<Grade, string> {
  const out = {} as Record<Grade, string>
  for (const g of ['again', 'hard', 'good', 'easy'] as Grade[]) {
    out[g] = fmtMs(Math.max(0, applyGrade(card, g, now).due - now))
  }
  return out
}

export function dueLabel(c: CardState, now = Date.now()): string {
  const diff = c.due - now
  if (diff <= 0) return 'due now'
  return `due in ${fmtMs(diff)}`
}
