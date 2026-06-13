/**
 * Word-level recall verification. The user types a passage from memory; we
 * compare it to the canonical text token-by-token with an edit-distance
 * alignment so a single dropped or added word doesn't cascade-misalign the
 * rest. Forgiving on punctuation, case, and curly vs. straight quotes; strict
 * on the words themselves — that's the whole point.
 */

export type WordStatus = 'hit' | 'wrong' | 'miss' | 'plain'

export interface ResultWord {
  /** The canonical word, with its original punctuation, for display. */
  text: string
  status: WordStatus
  /** What the user actually typed in this slot (for 'wrong'). */
  typed?: string
}

export interface RecallResult {
  lines: ResultWord[][]
  /** Words the user added that don't belong. */
  extras: string[]
  hits: number
  total: number
  accuracy: number
  /** True only when every scored word was recalled exactly. */
  perfect: boolean
}

/** Lowercase, straighten apostrophes, drop everything but letters/digits/apostrophes. */
export function normalizeWord(w: string): string {
  return w
    .toLowerCase()
    .replace(/[‘’ʼ]/g, "'")
    .replace(/[^a-z0-9']/g, '')
    .replace(/^'+|'+$/g, '')
}

interface DisplayWord {
  text: string
  norm: string
  line: number
  col: number
}

function layout(text: string): { lines: string[][]; words: DisplayWord[] } {
  const lines = text.split('\n').map(l => l.split(/\s+/).filter(Boolean))
  const words: DisplayWord[] = []
  lines.forEach((line, li) => {
    line.forEach((w, col) => {
      const norm = normalizeWord(w)
      if (norm) words.push({ text: w, norm, line: li, col })
    })
  })
  return { lines, words }
}

interface Op {
  type: 'match' | 'sub' | 'del' | 'ins'
  ansIdx?: number
  userIdx?: number
}

/** Needleman–Wunsch / edit-distance backtrace over normalized tokens. */
function align(user: string[], ans: string[]): Op[] {
  const m = user.length
  const n = ans.length
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (user[i - 1] === ans[j - 1]) dp[i][j] = dp[i - 1][j - 1]
      else dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1])
    }
  }
  const ops: Op[] = []
  let i = m
  let j = n
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && user[i - 1] === ans[j - 1] && dp[i][j] === dp[i - 1][j - 1]) {
      ops.push({ type: 'match', ansIdx: j - 1, userIdx: i - 1 }); i--; j--
    } else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) {
      ops.push({ type: 'sub', ansIdx: j - 1, userIdx: i - 1 }); i--; j--
    } else if (j > 0 && dp[i][j] === dp[i][j - 1] + 1) {
      ops.push({ type: 'del', ansIdx: j - 1 }); j--
    } else {
      ops.push({ type: 'ins', userIdx: i - 1 }); i--
    }
  }
  return ops.reverse()
}

export function scoreRecall(userText: string, answerText: string): RecallResult {
  const { lines, words } = layout(answerText)
  const ansNorm = words.map(w => w.norm)
  const userWords = userText.split(/\s+/).map(normalizeWord).filter(Boolean)

  const ops = align(userWords, ansNorm)
  const status = new Array<WordStatus>(words.length).fill('plain')
  const typed = new Array<string | undefined>(words.length).fill(undefined)
  const extras: string[] = []
  let hits = 0
  for (const op of ops) {
    if (op.type === 'match') { status[op.ansIdx!] = 'hit'; hits++ }
    else if (op.type === 'sub') { status[op.ansIdx!] = 'wrong'; typed[op.ansIdx!] = userWords[op.userIdx!] }
    else if (op.type === 'del') { status[op.ansIdx!] = 'miss' }
    else if (op.type === 'ins') { extras.push(userWords[op.userIdx!]) }
  }

  // Re-assemble into display lines, marking non-scored words (pure punctuation) plain.
  const byPos = new Map<string, { status: WordStatus; typed?: string }>()
  words.forEach((w, idx) => byPos.set(`${w.line}:${w.col}`, { status: status[idx], typed: typed[idx] }))
  const resultLines: ResultWord[][] = lines.map((line, li) =>
    line.map((text, col) => {
      const hit = byPos.get(`${li}:${col}`)
      return { text, status: hit?.status ?? 'plain', typed: hit?.typed }
    }),
  )

  const total = words.length
  const accuracy = total === 0 ? 1 : hits / total
  return { lines: resultLines, extras, hits, total, accuracy, perfect: hits === total && extras.length === 0 }
}

/** The missed/wrong canonical words, for a compact "you missed:" summary. */
export function missedWords(r: RecallResult): string[] {
  const out: string[] = []
  for (const line of r.lines)
    for (const w of line)
      if (w.status === 'miss' || w.status === 'wrong') out.push(w.text.replace(/^[^A-Za-z0-9']+|[^A-Za-z0-9']+$/g, ''))
  return out
}

if (import.meta.env.DEV) {
  const perfect = scoreRecall('To be, or not to be', 'To be, or not to be')
  console.assert(perfect.perfect && perfect.accuracy === 1, '[by-heart] diff: exact match should be perfect')
  const fuzzy = scoreRecall('to be or not to be', 'To be, or not to be,')
  console.assert(fuzzy.perfect, '[by-heart] diff: punctuation/case must be forgiven')
  const dropped = scoreRecall('To be or to be', 'To be or not to be')
  console.assert(dropped.hits === 5 && !dropped.perfect, '[by-heart] diff: a dropped word should not misalign the rest')
}
