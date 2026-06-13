/** Deterministic cloze + first-letter renderings for the memorization ladder. */

export interface Token {
  /** The visible word (with attached leading/trailing punctuation). */
  word: string
  /** Just the core letters, for first-letter mode. */
  core: string
  hidden: boolean
}

export type TokenLine = Token[]

const STOPWORDS = new Set([
  'the', 'and', 'but', 'for', 'nor', 'with', 'that', 'this', 'thy', 'thou', 'thee',
  'his', 'her', 'our', 'your', 'are', 'was', 'were', 'will', 'shall', 'not', 'all',
  'when', 'which', 'what', 'than', 'then', 'them', 'they', 'have', 'hath', 'doth',
])

function hashString(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function coreOf(word: string): string {
  return word.replace(/[^A-Za-z']/g, '')
}

/**
 * Tokenize quote text into lines of words and hide a deterministic fraction
 * of the "content" words (longer, non-stopword). Same quote + level always
 * hides the same words, so a re-attempt is a true re-test.
 */
export function clozeLines(text: string, fraction: number, seedKey: string): TokenLine[] {
  const lines = text.split('\n').map(line =>
    line.split(/\s+/).filter(Boolean).map(word => ({ word, core: coreOf(word), hidden: false })),
  )
  const candidates: Token[] = []
  for (const line of lines) {
    for (const tok of line) {
      const core = tok.core.toLowerCase()
      if (core.length >= 4 && !STOPWORDS.has(core)) candidates.push(tok)
    }
  }
  const rand = mulberry32(hashString(seedKey))
  const shuffled = [...candidates]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  const target = Math.max(1, Math.round(candidates.length * fraction))
  for (let i = 0; i < target && i < shuffled.length; i++) shuffled[i].hidden = true
  return lines
}

/** "To be, or not to be" → "T b, o n t b" — the actor's first-letter skeleton. */
export function firstLetterLines(text: string): string[] {
  return text.split('\n').map(line =>
    line
      .split(/\s+/)
      .filter(Boolean)
      .map(word => {
        const m = word.match(/[A-Za-z]/)
        if (!m) return word
        const idx = word.indexOf(m[0])
        const trailing = word.slice(idx + 1).replace(/[A-Za-z']+/g, '')
        return word.slice(0, idx + 1) + trailing
      })
      .join(' '),
  )
}

export const CLOZE_FRACTION: Record<number, number> = { 1: 0.3, 2: 0.65 }
