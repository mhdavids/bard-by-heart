/** Deterministic phrase-cloze + first-letter renderings for the memory ladder. */

export interface ClozeSeg {
  kind: 'text' | 'blank'
  /** For 'text': the visible run of words. */
  text?: string
  /** For 'blank': zero-based blank number across the whole passage. */
  index?: number
  /** For 'blank': the phrase the user must recall (original words + punctuation). */
  answer?: string
  /** For 'blank': how many words are hidden. */
  words?: number
}

export interface ClozeModel {
  lines: ClozeSeg[][]
  blanks: { index: number; answer: string }[]
}

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

/** Level → { coverage fraction, typical span length in words }. */
const SPANS: Record<number, { frac: number; len: number }> = {
  1: { frac: 0.34, len: 2 },
  2: { frac: 0.6, len: 4 },
}

/** Decide which words in a line to hide, as contiguous multi-word spans. */
function maskLine(n: number, len: number, frac: number, rng: () => number): boolean[] {
  if (n <= 0) return []
  if (n <= 2) return new Array(n).fill(true)
  if (n <= len) {
    const m = new Array(n).fill(false)
    for (let i = 0; i < n - 1; i++) m[i] = true // hide all but the last, as one span
    return m
  }
  const gap = Math.max(1, Math.round((len * (1 - frac)) / frac))
  const period = len + gap
  const offset = Math.floor(rng() * period)
  const m = new Array(n).fill(false)
  for (let i = 0; i < n; i++) if ((((i - offset) % period) + period) % period < len) m[i] = true
  if (!m.some(Boolean)) for (let i = 0; i < len; i++) m[i] = true
  if (m.every(Boolean)) m[0] = false // always leave a toehold
  return m
}

/**
 * Build a phrase-level cloze: hide contiguous spans of words (not lone words),
 * scaling coverage and span length by level. Deterministic for a given
 * seed, so re-attempting the same level re-tests the same gaps.
 */
export function buildCloze(text: string, level: number, seedKey: string): ClozeModel {
  const { frac, len } = SPANS[level] ?? SPANS[1]
  const rng = mulberry32(hashString(seedKey))
  const lines: ClozeSeg[][] = []
  const blanks: { index: number; answer: string }[] = []
  let blankIdx = 0

  for (const rawLine of text.split('\n')) {
    const words = rawLine.split(/\s+/).filter(Boolean)
    const mask = maskLine(words.length, len, frac, rng)
    const segs: ClozeSeg[] = []
    let i = 0
    while (i < words.length) {
      if (mask[i]) {
        let j = i
        while (j < words.length && mask[j]) j++
        const answer = words.slice(i, j).join(' ')
        segs.push({ kind: 'blank', index: blankIdx, answer, words: j - i })
        blanks.push({ index: blankIdx, answer })
        blankIdx++
        i = j
      } else {
        let j = i
        while (j < words.length && !mask[j]) j++
        segs.push({ kind: 'text', text: words.slice(i, j).join(' ') })
        i = j
      }
    }
    lines.push(segs)
  }

  return { lines, blanks }
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
