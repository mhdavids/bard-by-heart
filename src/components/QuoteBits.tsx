import type { Quote } from '../types'
import type { TokenLine } from '../lib/cloze'
import { attribution } from '../lib/util'

/** Full quote text with verse-style hanging indents (or prose flow). */
export function QuoteText({ q, size = 'lg' }: { q: Quote; size?: 'lg' | 'md' }) {
  if (q.prose) return <p className={`quote-text prose ${size}`}>{q.text}</p>
  return (
    <div className={`quote-text ${size}`}>
      {q.text.split('\n').map((line, i) => (
        <span className="vline" key={i}>{line}</span>
      ))}
    </div>
  )
}

export function Attribution({ q }: { q: Quote }) {
  return <p className="attribution">— {attribution(q)}</p>
}

export function Badges({ q, byHeart, learning }: { q: Quote; byHeart?: boolean; learning?: boolean }) {
  return (
    <span className="badges">
      {byHeart && <span className="badge byheart" title="Known by heart">by heart</span>}
      {!byHeart && learning && <span className="badge learning" title="In your study rotation">learning</span>}
      {q.alert && <span className="badge alert" title="Misquote / context alert">⚠</span>}
      {q.starter && <span className="badge starter" title="Recommended essential">★</span>}
    </span>
  )
}

/** Cloze rendering: hidden words are tappable chips that reveal on touch. */
export function ClozeText({
  lines, prose, revealed, onReveal,
}: {
  lines: TokenLine[]
  prose?: boolean
  revealed: Set<string>
  onReveal: (key: string) => void
}) {
  return (
    <div className={`quote-text lg ${prose ? 'prose-flow' : ''}`}>
      {lines.map((line, li) => (
        <span className="vline" key={li}>
          {line.map((tok, ti) => {
            const key = `${li}-${ti}`
            if (!tok.hidden || revealed.has(key)) {
              return (
                <span key={key} className={tok.hidden ? 'tok peeked' : 'tok'}>
                  {tok.word}{' '}
                </span>
              )
            }
            return (
              <button key={key} className="tok-hidden" onClick={() => onReveal(key)} aria-label="Reveal word">
                {' '.repeat(Math.max(3, Math.min(10, tok.core.length)))}{' '}
              </button>
            )
          })}
        </span>
      ))}
    </div>
  )
}

export function FirstLetters({ lines, prose }: { lines: string[]; prose?: boolean }) {
  return (
    <div className={`quote-text lg first-letters ${prose ? 'prose-flow' : ''}`}>
      {lines.map((line, i) => (
        <span className="vline" key={i}>{line}</span>
      ))}
    </div>
  )
}
