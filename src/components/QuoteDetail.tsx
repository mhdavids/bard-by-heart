import type { Quote } from '../types'
import { useProgress, queueQuote, startLearning } from '../lib/store'
import { isByHeart, dueLabel } from '../lib/srs'
import { Attribution, Badges, QuoteText } from './QuoteBits'

const LEVEL_NAMES = ['', 'learning · light cloze', 'learning · heavy cloze', 'learning · first letters', 'by heart']

export function QuoteDetail({ q, onClose }: { q: Quote; onClose: () => void }) {
  const progress = useProgress()
  const card = progress.cards[q.id]
  const queued = progress.queued.includes(q.id)

  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()}>
        <button className="sheet-close" onClick={onClose} aria-label="Close">✕</button>
        <div className="sheet-scroll">
          <QuoteText q={q} />
          <Attribution q={q} />
          <Badges q={q} byHeart={isByHeart(card)} learning={!!card && !isByHeart(card)} />

          <section>
            <h4>The scene</h4>
            <p>{q.context}</p>
          </section>
          <section>
            <h4>What it means</h4>
            <p>{q.meaning}</p>
          </section>
          <section>
            <h4>Use it when…</h4>
            <p>{q.useWhen}</p>
          </section>
          {q.alert && (
            <section className="alert-box">
              <h4>⚠ Get it right</h4>
              <p>{q.alert}</p>
            </section>
          )}

          <div className="tag-row">
            {q.tags.map(t => <span className="tag" key={t}>{t}</span>)}
          </div>

          <div className="detail-actions">
            {card ? (
              <p className="study-status">
                {isByHeart(card) ? '♥ You know this by heart' : `In rotation — ${LEVEL_NAMES[Math.min(card.level, 4)]}`}
                {' · '}{dueLabel(card)}
              </p>
            ) : queued ? (
              <p className="study-status">Queued — it will come up next time you learn new lines.</p>
            ) : (
              <div className="btn-row">
                <button className="btn primary" onClick={() => { startLearning(q.id) }}>Start learning now</button>
                <button className="btn" onClick={() => queueQuote(q.id)}>Queue for later</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
