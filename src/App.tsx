import { useState } from 'react'
import type { Quote } from './types'
import { Today } from './views/Today'
import { Review } from './views/Review'
import { Occasions } from './views/Occasions'
import { Library } from './views/Library'
import { Settings } from './views/Settings'
import { QuoteDetail } from './components/QuoteDetail'
import { useProgress, dueCards, streak } from './lib/store'

type Tab = 'today' | 'review' | 'occasions' | 'library'

export default function App() {
  const p = useProgress()
  const [tab, setTab] = useState<Tab>('today')
  const [detail, setDetail] = useState<Quote | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [reviewLaunch, setReviewLaunch] = useState<'due' | 'new' | null>(null)
  const [launchNonce, setLaunchNonce] = useState(0)

  const due = dueCards(p).length
  const s = streak(p)

  function goReview(kind: 'due' | 'new') {
    setReviewLaunch(kind)
    setLaunchNonce(n => n + 1)
    setTab('review')
  }

  return (
    <div className="app">
      <header className="topbar">
        <span className="wordmark" onClick={() => setTab('today')}>By Heart</span>
        <span className="topbar-right">
          {s > 0 && <span className="streak-pill" title="Day streak">{s}🔥</span>}
          <button className="icon-btn" onClick={() => setShowSettings(true)} aria-label="Settings">⚙</button>
        </span>
      </header>

      <main className="content">
        {tab === 'today' && (
          <Today
            onStartReview={() => goReview('due')}
            onStartLearn={() => goReview('new')}
            onDrill={() => setTab('occasions')}
            onOpenQuote={setDetail}
          />
        )}
        {tab === 'review' && (
          <Review key={launchNonce} launch={reviewLaunch} onDone={() => { setReviewLaunch(null); setTab('today') }} />
        )}
        {tab === 'occasions' && <Occasions onOpenQuote={setDetail} />}
        {tab === 'library' && <Library onOpenQuote={setDetail} />}
      </main>

      <nav className="tabbar">
        {(
          [
            ['today', 'Today'],
            ['review', due > 0 ? `Review · ${due}` : 'Review'],
            ['occasions', 'Occasions'],
            ['library', 'Library'],
          ] as [Tab, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            className={`tab ${tab === key ? 'active' : ''}`}
            onClick={() => { if (key !== 'review') setReviewLaunch(null); setTab(key) }}
          >
            {label}
          </button>
        ))}
      </nav>

      {detail && <QuoteDetail q={detail} onClose={() => setDetail(null)} />}
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
    </div>
  )
}
