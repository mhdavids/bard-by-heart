export type Category = 'tragedy' | 'comedy' | 'history' | 'romance' | 'sonnet'

export interface Quote {
  id: string
  /** The quote itself. Verse line breaks preserved with \n. */
  text: string
  play: string
  /** e.g. "Act 3, Scene 1" or "Sonnet 18" — display citation */
  cite: string
  speaker: string
  category: Category
  /** What is happening in the scene when this is spoken. */
  context: string
  /** Plain-English meaning, including older senses of words. */
  meaning: string
  /** Modern situations where the line lands well. */
  useWhen: string
  /** Misquote / misattribution / irony warning — the "use it right" flag. */
  alert?: string
  tags: string[]
  /** 1 = one-liner · 2 = couplet/short · 3 = passage */
  difficulty: 1 | 2 | 3
  /** Part of the recommended first ~20 to learn. */
  starter?: boolean
  /** Quote is prose (or a stage direction), not verse. */
  prose?: boolean
}

export interface Scenario {
  id: string
  /** The real-life moment, second person. */
  prompt: string
  occasion: string
  /** Quote ids that fit; first is the best answer. */
  answers: string[]
  /** Why the best answer lands. */
  why: string
}

export type Grade = 'again' | 'hard' | 'good' | 'easy'

export interface CardState {
  id: string
  /** 1 cloze-light · 2 cloze-heavy · 3 first letters · 4+ from memory */
  level: number
  ease: number
  /** Current interval in days (0 while learning). */
  ivl: number
  /** Epoch ms when due. */
  due: number
  reps: number
  lapses: number
}

export interface DayLog {
  reviews: number
  learned: number
}

export interface Settings {
  newPerDay: number
  multipleChoice: boolean
}

export interface Progress {
  cards: Record<string, CardState>
  /** keyed by local YYYY-MM-DD */
  log: Record<string, DayLog>
  scenarios: Record<string, { seen: number; got: number }>
  /** Quote ids the user explicitly queued to learn next. */
  queued: string[]
  settings: Settings
}
