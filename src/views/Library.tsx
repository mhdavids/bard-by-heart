import { useMemo, useState } from 'react'
import { QUOTES, PLAY_ORDER } from '../data/quotes'
import { useProgress } from '../lib/store'
import { isByHeart } from '../lib/srs'
import type { Quote } from '../types'
import { Badges } from '../components/QuoteBits'
import { firstLine } from '../lib/util'

type Filter = 'all' | 'starter' | 'alert' | 'byheart' | 'learning' | 'unseen'

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'starter', label: '★ Essentials' },
  { key: 'alert', label: '⚠ Get-it-right' },
  { key: 'byheart', label: 'By heart' },
  { key: 'learning', label: 'Learning' },
  { key: 'unseen', label: 'Not started' },
]

export function Library({ onOpenQuote }: { onOpenQuote: (q: Quote) => void }) {
  const p = useProgress()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  const visible = useMemo(() => {
    const needle = search.trim().toLowerCase()
    return QUOTES.filter(q => {
      if (filter === 'starter' && !q.starter) return false
      if (filter === 'alert' && !q.alert) return false
      const card = p.cards[q.id]
      if (filter === 'byheart' && !isByHeart(card)) return false
      if (filter === 'learning' && (!card || isByHeart(card))) return false
      if (filter === 'unseen' && card) return false
      if (!needle) return true
      const hay = `${q.text} ${q.play} ${q.speaker} ${q.tags.join(' ')} ${q.useWhen}`.toLowerCase()
      return hay.includes(needle)
    })
  }, [search, filter, p])

  const byPlay = useMemo(() => {
    const m = new Map<string, Quote[]>()
    for (const q of visible) {
      if (!m.has(q.play)) m.set(q.play, [])
      m.get(q.play)!.push(q)
    }
    return [...m.entries()].sort((a, b) => PLAY_ORDER.indexOf(a[0]) - PLAY_ORDER.indexOf(b[0]))
  }, [visible])

  const mastered = (play: string) =>
    QUOTES.filter(q => q.play === play && isByHeart(p.cards[q.id])).length

  return (
    <div className="view library">
      <input
        className="search"
        type="search"
        placeholder="Search lines, plays, speakers, moods…"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="chip-row">
        {FILTERS.map(f => (
          <button
            key={f.key}
            className={`chip ${filter === f.key ? 'active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {byPlay.length === 0 && <p className="muted center">Nothing matches — try fewer words.</p>}

      {byPlay.map(([play, quotes]) => (
        <section key={play} className="play-group">
          <h3 className="play-header">
            {play}
            <span className="play-count">{mastered(play)}/{QUOTES.filter(q => q.play === play).length} by heart</span>
          </h3>
          {quotes.map(q => {
            const card = p.cards[q.id]
            return (
              <button key={q.id} className="quote-row" onClick={() => onOpenQuote(q)}>
                <span className="row-line">“{firstLine(q)}”</span>
                <span className="row-meta">
                  <span className="row-speaker">{q.category === 'sonnet' ? q.cite : `${q.speaker} · ${q.cite}`}</span>
                  <Badges q={q} byHeart={isByHeart(card)} learning={!!card && !isByHeart(card)} />
                </span>
              </button>
            )
          })}
        </section>
      ))}
    </div>
  )
}
