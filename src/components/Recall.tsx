import { useMemo, useState } from 'react'
import type { Quote } from '../types'
import { firstLetterLines, type ClozeModel } from '../lib/cloze'
import { scoreRecall, aggregate, missedWords, type RecallResult } from '../lib/diff'
import { FirstLetters } from './QuoteBits'

// ── Phrase cloze: fill the multi-word gaps, scored by closeness (levels 1–2) ──

export function GapFill({
  model, prose, onChecked, onRedo,
}: {
  model: ClozeModel
  prose?: boolean
  onChecked: (accuracy: number, usedHint: boolean) => void
  onRedo: () => void
}) {
  const [values, setValues] = useState<Record<number, string>>({})
  const [results, setResults] = useState<Record<number, RecallResult> | null>(null)

  function grade(typedFor: (index: number, answer: string) => string, usedHint: boolean) {
    const map: Record<number, RecallResult> = {}
    for (const b of model.blanks) map[b.index] = scoreRecall(typedFor(b.index, b.answer), b.answer)
    setResults(map)
    onChecked(aggregate(Object.values(map)).accuracy, usedHint)
  }

  const check = () => grade(i => values[i] ?? '', false)
  const giveUp = () => grade(() => '', true)
  const redo = () => { setResults(null); setValues({}); onRedo() }

  const agg = results ? aggregate(Object.values(results)) : null

  return (
    <div>
      <div className={`quote-text lg ${prose ? 'prose-flow' : ''}`}>
        {model.lines.map((line, li) => (
          <span className="vline" key={li}>
            {line.map((seg, si) => {
              if (seg.kind === 'text') return <span className="tok" key={si}>{seg.text}{' '}</span>
              const idx = seg.index!
              if (results) {
                return <span className="gap-result" key={si}><PhraseDiff result={results[idx]} />{' '}</span>
              }
              return (
                <span className="gap-ph" key={si} aria-label={`blank ${idx + 1}`}>
                  <span className="gap-num">{idx + 1}</span>
                  <span className="gap-dashes">{'·'.repeat(Math.min(8, seg.words ?? 1))}</span>
                  {' '}
                </span>
              )
            })}
          </span>
        ))}
      </div>

      {!results ? (
        <div className="gap-inputs">
          {model.blanks.map(b => (
            <label className="gap-row" key={b.index}>
              <span className="gap-num">{b.index + 1}</span>
              <input
                className="gap-input"
                value={values[b.index] ?? ''}
                onChange={e => setValues(v => ({ ...v, [b.index]: e.target.value }))}
                placeholder="the missing words…"
                autoCapitalize="none" autoCorrect="off" spellCheck={false}
                aria-label={`Missing words for blank ${b.index + 1}`}
              />
            </label>
          ))}
          <div className="attempt-actions">
            <button className="btn big primary" onClick={check}>Check my answer</button>
            <button className="btn subtle" onClick={giveUp}>Stuck? Show the gaps</button>
          </div>
        </div>
      ) : (
        <>
          <div className={`recall-score ${agg!.perfect ? 'perfect' : ''}`}>
            {agg!.perfect
              ? <span>Every gap filled, word for word. ✓</span>
              : <span>{agg!.hits} / {agg!.total} hidden words recalled</span>}
          </div>
          <button className="btn subtle" onClick={redo}>Try the gaps again</button>
        </>
      )}
    </div>
  )
}

/** Inline word-by-word diff of one filled phrase. */
function PhraseDiff({ result }: { result: RecallResult }) {
  return (
    <>
      {result.lines.flat().map((w, i) => (
        <span key={i} className={`rw rw-${w.status}`}>
          {w.text}
          {w.status === 'wrong' && w.typed && <span className="rw-typed">{w.typed}</span>}
          {i < result.lines.flat().length - 1 ? ' ' : ''}
        </span>
      ))}
    </>
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
