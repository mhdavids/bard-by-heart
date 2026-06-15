import { useMemo, useState } from 'react'
import { QUOTES, groupKey, groupRank, collectionOf } from '../data/quotes'
import { useProgress } from '../lib/store'
import { isByHeart } from '../lib/srs'
import type { Quote, Collection } from '../types'
import { COLLECTION_LABEL } from '../types'
import { Badges } from '../components/QuoteBits'
import { firstLine, rowLabel } from '../lib/util'

type Filter = 'all' | 'starter' | 'alert' | 'byheart' | 'learning' | 'unseen'

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'starter', label: '★ Essentials' },
  { key: 'alert', label: '⚠ Get-it-right' },
  { key: 'byheart', label: 'By heart' },
  { key: 'learning', label: 'Learning' },
  { key: 'unseen', label: 'Not started' },
]

const COLLECTION_CHIPS: { key: Collection | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'shakespeare', label: 'Shakespeare' },
  { key: 'poetry', label: 'Poetry' },
  { key: 'wit', label: 'Wit' },
  { key: 'stoic', label: 'Stoics' },
  { key: 'scripture', label: 'Scripture' },
]

export function Library({ onOpenQuote }: { onOpenQuote: (q: Quote) => void }) {
  const p = useProgress()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [collection, setCollection] = useState<Collection | 'all'>('all')

  const visible = useMemo(() => {
    const needle = search.trim().toLowerCase()
    return QUOTES.filter(q => {
      if (collection !== 'all' && collectionOf(q) !== collection) return false
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
  }, [search, filter, collection, p])

  const groups = useMemo(() => {
    const m = new Map<string, Quote[]>()
    for (const q of visible) {
      const key = groupKey(q)
      if (!m.has(key)) m.set(key, [])
      m.get(key)!.push(q)
    }
    return [...m.entries()].sort((a, b) => groupRank(a[0]) - groupRank(b[0]))
  }, [visible])

  const masteredIn = (key: string) =>
    QUOTES.filter(q => groupKey(q) === key && isByHeart(p.cards[q.id])).length
  const totalIn = (key: string) => QUOTES.filter(q => groupKey(q) === key).length

  return (
    <div className="view library">
      <input
        className="search"
        type="search"
        placeholder="Search lines, sources, authors, moods…"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="chip-row collections">
        {COLLECTION_CHIPS.map(c => (
          <button
            key={c.key}
            className={`chip ${collection === c.key ? 'active' : ''}`}
            onClick={() => setCollection(c.key)}
          >
            {c.label}
          </button>
        ))}
      </div>
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

      {groups.length === 0 && <p className="muted center">Nothing matches — try fewer words.</p>}

      {groups.map(([key, quotes]) => (
        <section key={key} className="play-group">
          <h3 className="play-header">
            {key}
            <span className="play-count">
              {collectionOf(quotes[0]) !== 'shakespeare' && (
                <span className="group-collection">{COLLECTION_LABEL[collectionOf(quotes[0])]} · </span>
              )}
              {masteredIn(key)}/{totalIn(key)} by heart
            </span>
          </h3>
          {quotes.map(q => {
            const card = p.cards[q.id]
            return (
              <button key={q.id} className="quote-row" onClick={() => onOpenQuote(q)}>
                <span className="row-line">“{firstLine(q)}”</span>
                <span className="row-meta">
                  <span className="row-speaker">{rowLabel(q)}</span>
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
