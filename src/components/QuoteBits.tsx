import type { Quote } from '../types'
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

export function FirstLetters({ lines, prose }: { lines: string[]; prose?: boolean }) {
  return (
    <div className={`quote-text lg first-letters ${prose ? 'prose-flow' : ''}`}>
      {lines.map((line, i) => (
        <span className="vline" key={i}>{line}</span>
      ))}
    </div>
  )
}
