import { useMemo, useState } from 'react'
import type { Quote } from '../types'
import type { TokenLine } from '../lib/cloze'
import { firstLetterLines } from '../lib/cloze'
import { normalizeWord, scoreRecall, missedWords, type RecallResult } from '../lib/diff'
import { FirstLetters } from './QuoteBits'

// ── Typed cloze: fill the blanks, then check (levels 1–2) ────────────────

export function ClozeAttempt({
  lines, prose, onChecked, onRedo,
}: {
  lines: TokenLine[]
  prose?: boolean
  onChecked: (accuracy: number, usedHint: boolean) => void
  onRedo: () => void
}) {
  const [values, setValues] = useState<Record<string, string>>({})
  const [revealed, setRevealed] = useState<Set<string>>(new Set())
  const [checked, setChecked] = useState(false)

  const blanks = useMemo(() => {
    const keys: { key: string; answer: string }[] = []
    lines.forEach((line, li) =>
      line.forEach((tok, ti) => { if (tok.hidden) keys.push({ key: `${li}-${ti}`, answer: tok.word }) }),
    )
    return keys
  }, [lines])

  function isCorrect(key: string, answer: string): boolean {
    return normalizeWord(values[key] ?? '') === normalizeWord(answer)
  }

  function check() {
    setChecked(true)
    const correct = blanks.filter(b => !revealed.has(b.key) && isCorrect(b.key, b.answer)).length
    const accuracy = blanks.length === 0 ? 1 : correct / blanks.length
    onChecked(accuracy, revealed.size > 0)
  }

  function redo() {
    setChecked(false)
    setValues({})
    setRevealed(new Set())
    onRedo()
  }

  return (
    <div>
      <div className={`quote-text lg ${prose ? 'prose-flow' : ''}`}>
        {lines.map((line, li) => (
          <span className="vline" key={li}>
            {line.map((tok, ti) => {
              const key = `${li}-${ti}`
              if (!tok.hidden) return <span className="tok" key={key}>{tok.word}{' '}</span>
              if (revealed.has(key) && !checked) {
                return <span className="tok peeked" key={key}>{tok.word}{' '}</span>
              }
              if (checked) {
                const ok = !revealed.has(key) && isCorrect(key, tok.word)
                return (
                  <span key={key} className={`cloze-mark ${ok ? 'ok' : 'no'}`}>
                    {tok.word}
                    {!ok && values[key] && <span className="cloze-typed">{values[key]}</span>}
                    {' '}
                  </span>
                )
              }
              return (
                <span className="cloze-slot" key={key}>
                  <input
                    className="cloze-input"
                    style={{ width: `${Math.max(3, normalizeWord(tok.word).length + 1)}ch` }}
                    value={values[key] ?? ''}
                    onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))}
                    autoCapitalize="none" autoCorrect="off" spellCheck={false}
                    aria-label="Missing word"
                  />
                  {' '}
                </span>
              )
            })}
          </span>
        ))}
      </div>

      {!checked ? (
        <div className="attempt-actions">
          <button className="btn big primary" onClick={check}>Check my answer</button>
          <button
            className="btn subtle"
            onClick={() => setRevealed(new Set(blanks.map(b => b.key)))}
          >Stuck? Reveal the blanks</button>
        </div>
      ) : (
        <button className="btn subtle" onClick={redo}>Try the blanks again</button>
      )}
    </div>
  )
}

// ── Full typed recall: produce the whole passage, then diff (levels 3–4) ──

export function RecallProduction({
  q, hint, onChecked, onRedo,
}: {
  q: Quote
  hint: 'firstletters' | 'none'
  onChecked: (accuracy: number, usedHint: boolean) => void
  onRedo: () => void
}) {
  const [text, setText] = useState('')
  const [result, setResult] = useState<RecallResult | null>(null)
  const letters = useMemo(() => firstLetterLines(q.text), [q])
  const lineCount = q.text.split('\n').length

  function check() {
    const r = scoreRecall(text, q.text)
    setResult(r)
    onChecked(r.accuracy, false)
  }

  function giveUp() {
    const r = scoreRecall('', q.text)
    setResult(r)
    onChecked(0, true)
  }

  function redo() {
    setResult(null)
    setText('')
    onRedo()
  }

  if (result) {
    return (
      <div>
        <ResultDiff result={result} prose={q.prose} />
        <button className="btn subtle" onClick={redo}>Type it again</button>
      </div>
    )
  }

  return (
    <div className="production">
      {hint === 'firstletters' && (
        <>
          <p className="hint-label">your skeleton — fill in the words</p>
          <FirstLetters lines={letters} prose={q.prose} />
        </>
      )}
      <textarea
        className="recall-textarea"
        rows={Math.min(12, lineCount + 1)}
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={hint === 'firstletters' ? 'Type the full lines from the skeleton…' : 'Type the passage from memory — punctuation and line breaks don\'t matter'}
        autoCapitalize="sentences" autoCorrect="off" spellCheck={false}
      />
      <div className="attempt-actions">
        <button className="btn big primary" onClick={check} disabled={text.trim().length === 0}>Check my recall</button>
        <button className="btn subtle" onClick={giveUp}>Can't remember — show me</button>
      </div>
    </div>
  )
}

export function ResultDiff({ result, prose }: { result: RecallResult; prose?: boolean }) {
  const missed = missedWords(result)
  return (
    <div>
      <div className={`quote-text lg result-diff ${prose ? 'prose-flow' : ''}`}>
        {result.lines.map((line, li) => (
          <span className="vline" key={li}>
            {line.map((w, wi) => (
              <span key={wi} className={`rw rw-${w.status}`}>
                {w.text}
                {w.status === 'wrong' && w.typed && <span className="rw-typed">{w.typed}</span>}
                {' '}
              </span>
            ))}
          </span>
        ))}
      </div>
      <div className={`recall-score ${result.perfect ? 'perfect' : ''}`}>
        {result.perfect ? (
          <span>Word-perfect — that one's truly by heart. ✓</span>
        ) : (
          <span>{result.hits} / {result.total} words{missed.length > 0 && <> · missed <em>{missed.slice(0, 6).join(', ')}{missed.length > 6 ? '…' : ''}</em></>}</span>
        )}
        {result.extras.length > 0 && <span className="recall-extras"> · added {result.extras.slice(0, 4).join(', ')}</span>}
      </div>
    </div>
  )
}
