import { QUOTES } from '../data/quotes'
import { useProgress, dueCards, nextNewQuotes, newLearnedToday, streak, todayKey } from '../lib/store'
import { isByHeart } from '../lib/srs'
import { quoteOfTheDay, firstLine, attribution } from '../lib/util'
import type { Quote } from '../types'

export function Today({
  onStartReview, onStartLearn, onDrill, onOpenQuote,
}: {
  onStartReview: () => void
  onStartLearn: () => void
  onDrill: () => void
  onOpenQuote: (q: Quote) => void
}) {
  const p = useProgress()
  const due = dueCards(p).length
  const learnedToday = newLearnedToday(p)
  const newBudget = Math.max(0, p.settings.newPerDay - learnedToday)
  const newAvailable = nextNewQuotes(p, newBudget).length
  const byHeart = Object.values(p.cards).filter(isByHeart).length
  const inRotation = Object.keys(p.cards).length
  const qotd = quoteOfTheDay(QUOTES, todayKey())
  const s = streak(p)

  return (
    <div className="view today">
      <div className="qotd" onClick={() => onOpenQuote(qotd)}>
        <p className="qotd-eyebrow">Today's line</p>
        <p className="qotd-text">“{firstLine(qotd)}”</p>
        <p className="qotd-attr">{attribution(qotd)}</p>
        <p className="qotd-hint">tap for the story behind it</p>
      </div>

      <div className="stats-row">
        <div className="stat"><span className="stat-num">{due}</span><span className="stat-label">due now</span></div>
        <div className="stat"><span className="stat-num">{byHeart}</span><span className="stat-label">by heart</span></div>
        <div className="stat"><span className="stat-num">{inRotation}/{QUOTES.length}</span><span className="stat-label">in rotation</span></div>
        <div className="stat"><span className="stat-num">{s}</span><span className="stat-label">day streak</span></div>
      </div>

      <div className="cta-stack">
        <button className="btn big primary" onClick={onStartReview} disabled={due === 0}>
          {due > 0 ? `Review · ${due} due` : 'Nothing due — well played'}
        </button>
        <button className="btn big" onClick={onStartLearn} disabled={newAvailable === 0}>
          {newAvailable > 0 ? `Learn ${newAvailable} new line${newAvailable === 1 ? '' : 's'}` : `New lines done for today`}
        </button>
        <button className="btn big" onClick={onDrill}>Occasion drill</button>
      </div>

      <p className="epigraph">“What's past is prologue.”</p>
    </div>
  )
}
