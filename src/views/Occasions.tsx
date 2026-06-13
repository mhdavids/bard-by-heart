import { useMemo, useState } from 'react'
import { OCCASIONS, SCENARIOS } from '../data/scenarios'
import { QUOTE_BY_ID } from '../data/quotes'
import { useProgress, recordScenario, updateSettings } from '../lib/store'
import type { Quote, Scenario } from '../types'
import { Attribution, QuoteText } from '../components/QuoteBits'
import { firstLine, attribution, shuffled } from '../lib/util'
import { QUOTES } from '../data/quotes'

export function Occasions({ onOpenQuote }: { onOpenQuote: (q: Quote) => void }) {
  const p = useProgress()
  const [pool, setPool] = useState<Scenario[] | null>(null)
  const [poolName, setPoolName] = useState('')
  const [i, setI] = useState(0)

  function start(occasion?: string) {
    const list = occasion ? SCENARIOS.filter(s => s.occasion === occasion) : SCENARIOS
    // Least-drilled first, shuffled within equal counts.
    const ranked = shuffled(list).sort((a, b) => (p.scenarios[a.id]?.seen ?? 0) - (p.scenarios[b.id]?.seen ?? 0))
    setPool(ranked)
    setPoolName(occasion ?? 'Mixed drill')
    setI(0)
  }

  if (!pool) {
    return (
      <div className="view occasions-landing">
        <p className="view-intro">The other half of quoting well: knowing <em>which</em> line the moment calls for. Read a situation, summon your line, then check.</p>
        <div className="cta-stack">
          <button className="btn big primary" onClick={() => start()}>Mixed drill · all occasions</button>
          {OCCASIONS.map(o => {
            const n = SCENARIOS.filter(s => s.occasion === o).length
            return (
              <button key={o} className="btn big" onClick={() => start(o)}>
                {o} <span className="count">{n}</span>
              </button>
            )
          })}
        </div>
        <label className="mc-toggle">
          <input
            type="checkbox"
            checked={p.settings.multipleChoice}
            onChange={e => updateSettings({ multipleChoice: e.target.checked })}
          />
          Multiple-choice mode (easier — good for the first pass)
        </label>
      </div>
    )
  }

  if (i >= pool.length) {
    return (
      <div className="view">
        <div className="session-summary">
          <h2>{poolName} — drilled</h2>
          <p>You worked through {pool.length} occasion{pool.length === 1 ? '' : 's'}.</p>
        </div>
        <div className="cta-stack">
          <button className="btn big primary" onClick={() => start(poolName === 'Mixed drill' ? undefined : poolName)}>Run it again</button>
          <button className="btn big" onClick={() => setPool(null)}>All occasions</button>
        </div>
      </div>
    )
  }

  return (
    <ScenarioCard
      key={pool[i].id}
      sc={pool[i]}
      mc={p.settings.multipleChoice}
      position={`${i + 1} / ${pool.length}`}
      onOpenQuote={onOpenQuote}
      onNext={() => setI(i + 1)}
      onExit={() => setPool(null)}
    />
  )
}

function ScenarioCard({ sc, mc, position, onOpenQuote, onNext, onExit }: {
  sc: Scenario
  mc: boolean
  position: string
  onOpenQuote: (q: Quote) => void
  onNext: () => void
  onExit: () => void
}) {
  const [revealed, setRevealed] = useState(false)
  const [picked, setPicked] = useState<string | null>(null)
  const best = QUOTE_BY_ID[sc.answers[0]]
  const alternates = sc.answers.slice(1).map(id => QUOTE_BY_ID[id]).filter(Boolean)

  const options = useMemo(() => {
    if (!mc) return []
    const distractors = shuffled(QUOTES.filter(q => !sc.answers.includes(q.id))).slice(0, 3)
    return shuffled([best, ...distractors])
  }, [sc, mc, best])

  const correctPick = picked !== null && sc.answers.includes(picked)

  return (
    <div className="view scenario">
      <p className="position">{position} · {sc.occasion} <button className="linklike" onClick={onExit}>exit</button></p>
      <p className="scenario-prompt">{sc.prompt}</p>

      {!revealed && !mc && (
        <>
          <p className="muted center">Summon your line — out loud counts double.</p>
          <button className="btn big primary" onClick={() => setRevealed(true)}>Reveal the line</button>
        </>
      )}

      {!revealed && mc && (
        <div className="cta-stack">
          {options.map(o => (
            <button
              key={o.id}
              className={`btn option ${picked !== null ? (sc.answers.includes(o.id) ? 'correct' : o.id === picked ? 'wrong' : 'faded') : ''}`}
              disabled={picked !== null}
              onClick={() => { setPicked(o.id); recordScenario(sc.id, sc.answers.includes(o.id)) }}
            >
              <span className="option-line">“{firstLine(o)}”</span>
              <span className="option-attr">{attribution(o)}</span>
            </button>
          ))}
          {picked !== null && (
            <button className="btn big primary" onClick={() => setRevealed(true)}>
              {correctPick ? 'Well struck — see why' : 'See the answer'}
            </button>
          )}
        </div>
      )}

      {revealed && (
        <div className="scenario-answer">
          <QuoteText q={best} />
          <Attribution q={best} />
          <section><h4>Why this one</h4><p>{sc.why}</p></section>
          {alternates.length > 0 && (
            <section>
              <h4>Also fits</h4>
              {alternates.map(a => (
                <button key={a.id} className="alt-quote" onClick={() => onOpenQuote(a)}>
                  “{firstLine(a)}” <span className="option-attr">{attribution(a)}</span>
                </button>
              ))}
            </section>
          )}
          {!mc ? (
            <div className="btn-row">
              <button className="btn" onClick={() => { recordScenario(sc.id, false); onNext() }}>Didn't have it</button>
              <button className="btn primary" onClick={() => { recordScenario(sc.id, true); onNext() }}>I had it</button>
            </div>
          ) : (
            <button className="btn big primary" onClick={onNext}>Next occasion</button>
          )}
        </div>
      )}
    </div>
  )
}
