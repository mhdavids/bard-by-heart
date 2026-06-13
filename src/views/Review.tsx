import { useMemo, useState } from 'react'
import { QUOTE_BY_ID } from '../data/quotes'
import { useProgress, dueCards, nextNewQuotes, newLearnedToday, gradeCard, startLearning, streak, getState } from '../lib/store'
import { clozeLines, firstLetterLines, CLOZE_FRACTION } from '../lib/cloze'
import type { Grade, Quote } from '../types'
import { Attribution, ClozeText, FirstLetters, QuoteText } from '../components/QuoteBits'
import { GradeBar } from '../components/GradeBar'
import { VICTORY_LINES } from '../lib/util'

type Item = { quoteId: string; intro: boolean; requeues: number }
type SessionKind = 'due' | 'new'

export function Review({ launch, onDone }: { launch: SessionKind | null; onDone: () => void }) {
  const p = useProgress()
  const [session, setSession] = useState<Item[] | null>(null)
  const [idx, setIdx] = useState(0)
  const [counts, setCounts] = useState({ reviewed: 0, learned: 0 })
  const [finished, setFinished] = useState(false)

  // Auto-launch when arriving from Today's buttons.
  const [consumedLaunch, setConsumedLaunch] = useState<SessionKind | null>(null)
  if (launch && launch !== consumedLaunch && !session) {
    setConsumedLaunch(launch)
    begin(launch)
  }

  function begin(kind: SessionKind) {
    const state = getState()
    let items: Item[]
    if (kind === 'due') {
      items = dueCards(state).map(c => ({ quoteId: c.id, intro: false, requeues: 0 }))
    } else {
      const budget = Math.max(0, state.settings.newPerDay - newLearnedToday(state))
      items = nextNewQuotes(state, budget).map(id => ({ quoteId: id, intro: true, requeues: 0 }))
    }
    if (items.length === 0) return
    setSession(items)
    setIdx(0)
    setCounts({ reviewed: 0, learned: 0 })
    setFinished(false)
  }

  function advance(items: Item[], from: number) {
    if (from + 1 < items.length) setIdx(from + 1)
    else setFinished(true)
  }

  function handleGrade(item: Item, grade: Grade) {
    gradeCard(item.quoteId, grade)
    setCounts(c => ({ reviewed: c.reviewed + 1, learned: c.learned + (item.intro ? 1 : 0) }))
    let items = session!
    if (grade === 'again' && item.requeues < 2) {
      items = [...items, { quoteId: item.quoteId, intro: false, requeues: item.requeues + 1 }]
      setSession(items)
    }
    advance(items, idx)
  }

  if (!session || finished) {
    const due = dueCards(p).length
    const newBudget = Math.max(0, p.settings.newPerDay - newLearnedToday(p))
    const newAvail = nextNewQuotes(p, newBudget).length
    return (
      <div className="view review-landing">
        {finished && (
          <div className="session-summary">
            <h2>Session complete</h2>
            <p>{counts.reviewed} card{counts.reviewed === 1 ? '' : 's'} practiced{counts.learned > 0 ? ` · ${counts.learned} new line${counts.learned === 1 ? '' : 's'} started` : ''} · {streak(p)}-day streak</p>
            <p className="victory">{VICTORY_LINES[counts.reviewed % VICTORY_LINES.length]}</p>
          </div>
        )}
        <div className="cta-stack">
          <button className="btn big primary" onClick={() => begin('due')} disabled={due === 0}>
            {due > 0 ? `Review · ${due} due` : 'Nothing due right now'}
          </button>
          <button className="btn big" onClick={() => begin('new')} disabled={newAvail === 0}>
            {newAvail > 0 ? `Learn ${newAvail} new line${newAvail === 1 ? '' : 's'}` : 'New lines done for today'}
          </button>
          {finished && <button className="btn big" onClick={onDone}>Back to Today</button>}
        </div>
        {!finished && due === 0 && newAvail === 0 && (
          <p className="muted center">All caught up. Come back tomorrow — or raise your daily new-lines limit in settings.</p>
        )}
      </div>
    )
  }

  const item = session[idx]
  const q = QUOTE_BY_ID[item.quoteId]
  return (
    <PracticeCard
      key={`${item.quoteId}-${idx}`}
      q={q}
      intro={item.intro}
      onGrade={g => handleGrade(item, g)}
      position={`${Math.min(idx + 1, session.length)} / ${session.length}`}
    />
  )
}

function PracticeCard({ q, intro, onGrade, position }: {
  q: Quote
  intro: boolean
  onGrade: (g: Grade) => void
  position: string
}) {
  const p = useProgress()
  const [phase, setPhase] = useState<'intro' | 'practice'>(intro ? 'intro' : 'practice')
  const [revealed, setRevealed] = useState<Set<string>>(new Set())
  const [showFull, setShowFull] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const card = p.cards[q.id]
  const level = card ? Math.min(card.level, 4) : 1

  const lines = useMemo(
    () => clozeLines(q.text, CLOZE_FRACTION[level] ?? 0.3, `${q.id}:${level}`),
    [q, level],
  )
  const letters = useMemo(() => firstLetterLines(q.text), [q])

  if (phase === 'intro') {
    return (
      <div className="view practice">
        <p className="position">new line</p>
        <QuoteText q={q} />
        <Attribution q={q} />
        <section><h4>The scene</h4><p>{q.context}</p></section>
        <section><h4>What it means</h4><p>{q.meaning}</p></section>
        <section><h4>Use it when…</h4><p>{q.useWhen}</p></section>
        {q.alert && <section className="alert-box"><h4>⚠ Get it right</h4><p>{q.alert}</p></section>}
        <button
          className="btn big primary"
          onClick={() => { startLearning(q.id); setPhase('practice') }}
        >
          Read it twice? Now practice it
        </button>
      </div>
    )
  }

  const effectiveCard = card ?? { id: q.id, level: 1, ease: 2.5, ivl: 0, due: Date.now(), reps: 0, lapses: 0 }

  return (
    <div className="view practice">
      <p className="position">{position} · {LEVEL_PROMPTS[level]}</p>

      {level <= 2 && !showFull && (
        <ClozeText
          lines={lines}
          prose={q.prose}
          revealed={revealed}
          onReveal={k => setRevealed(s => new Set(s).add(k))}
        />
      )}

      {level === 3 && !showFull && <FirstLetters lines={letters} prose={q.prose} />}

      {level >= 4 && !showFull && (
        <div className="recall-cue">
          <p className="cue-opening">“{q.text.split(/\s+/).slice(0, 3).join(' ')}…”</p>
          {showHint && <FirstLetters lines={letters} prose={q.prose} />}
          {!showHint && (
            <button className="btn subtle" onClick={() => setShowHint(true)}>Show first letters</button>
          )}
        </div>
      )}

      {showFull && <QuoteText q={q} />}
      <Attribution q={q} />

      {!showFull && (
        <button className="btn" onClick={() => setShowFull(true)}>
          {level <= 2 ? 'Reveal everything' : 'Reveal the full text'}
        </button>
      )}

      <p className="grade-coach">Say it aloud, then grade yourself honestly — Good = a minor stumble, Easy = word-perfect.</p>
      <GradeBar card={effectiveCard} onGrade={onGrade} />
    </div>
  )
}

const LEVEL_PROMPTS: Record<number, string> = {
  1: 'fill the gaps',
  2: 'most words hidden',
  3: 'first letters only',
  4: 'from memory',
}
