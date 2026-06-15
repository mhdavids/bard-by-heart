import type { Quote, Collection } from '../types'
import { hamletMacbeth } from './quotes/hamlet-macbeth'
import { otherTragedies } from './quotes/other-tragedies'
import { comedies } from './quotes/comedies'
import { histories } from './quotes/histories'
import { romancesAndSonnets } from './quotes/romances-sonnets'
import { poetry } from './quotes/poetry'
import { wit } from './quotes/wit'
import { stoics } from './quotes/stoics'
import { philosophy } from './quotes/philosophy'
import { scripture } from './quotes/scripture'

/** Stamp every quote in a source file with its collection. */
function tag(qs: Quote[], collection: Collection): Quote[] {
  return qs.map(q => ({ ...q, collection }))
}

export const QUOTES: Quote[] = [
  ...tag(hamletMacbeth, 'shakespeare'),
  ...tag(otherTragedies, 'shakespeare'),
  ...tag(comedies, 'shakespeare'),
  ...tag(histories, 'shakespeare'),
  ...tag(romancesAndSonnets, 'shakespeare'),
  ...tag(poetry, 'poetry'),
  ...tag(wit, 'wit'),
  ...tag(stoics, 'stoic'),
  ...tag(philosophy, 'stoic'),
  ...tag(scripture, 'scripture'),
]

export const QUOTE_BY_ID: Record<string, Quote> = Object.fromEntries(
  QUOTES.map(q => [q.id, q]),
)

export const COLLECTION_ORDER: Collection[] = ['shakespeare', 'poetry', 'wit', 'stoic', 'scripture']

export function collectionOf(q: Quote): Collection {
  return q.collection ?? 'shakespeare'
}

/** The Library group key: Shakespeare & scripture group by work; the rest by author. */
export function groupKey(q: Quote): string {
  const c = collectionOf(q)
  return c === 'shakespeare' || c === 'scripture' ? q.play : q.speaker
}

/** Display order for Shakespeare play-groups; other collections fall back to first-seen order. */
export const PLAY_ORDER: string[] = [
  'Hamlet', 'Macbeth', 'Romeo and Juliet', 'Julius Caesar', 'King Lear', 'Othello',
  'Antony and Cleopatra', 'Coriolanus', 'Troilus and Cressida',
  "A Midsummer Night's Dream", 'Much Ado About Nothing', 'Twelfth Night', 'As You Like It',
  'The Merchant of Venice', 'Measure for Measure', "All's Well That Ends Well",
  'The Merry Wives of Windsor', 'The Comedy of Errors', "The Winter's Tale",
  'Henry V', 'Henry IV, Part 1', 'Henry IV, Part 2', 'Richard III', 'Richard II',
  'Henry VI, Part 3', 'King John',
  'The Tempest', 'Cymbeline',
  'Sonnet 18', 'Sonnet 29', 'Sonnet 30', 'Sonnet 73', 'Sonnet 116', 'Sonnet 130',
]

/** Stable group ordering: by collection, then PLAY_ORDER (Shakespeare) or first appearance. */
const GROUP_RANK: Map<string, number> = (() => {
  const m = new Map<string, number>()
  QUOTES.forEach((q, i) => {
    const key = groupKey(q)
    if (!m.has(key)) {
      const cRank = COLLECTION_ORDER.indexOf(collectionOf(q)) * 100000
      const within = collectionOf(q) === 'shakespeare'
        ? (PLAY_ORDER.indexOf(q.play) + 1 || 9999)
        : i / 1000
      m.set(key, cRank + within)
    }
  })
  return m
})()

export function groupRank(key: string): number {
  return GROUP_RANK.get(key) ?? Number.MAX_SAFE_INTEGER
}

if (import.meta.env.DEV) {
  const seen = new Set<string>()
  for (const q of QUOTES) {
    if (seen.has(q.id)) console.warn(`[by-heart] duplicate quote id: ${q.id}`)
    seen.add(q.id)
    if (collectionOf(q) === 'shakespeare' && !PLAY_ORDER.includes(q.play)) {
      console.warn(`[by-heart] play missing from PLAY_ORDER: ${q.play}`)
    }
    for (const f of ['text', 'play', 'cite', 'speaker', 'context', 'meaning', 'useWhen'] as const) {
      if (!q[f]) console.warn(`[by-heart] ${q.id} missing ${f}`)
    }
  }
}
