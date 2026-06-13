import type { Quote } from '../types'
import { hamletMacbeth } from './quotes/hamlet-macbeth'
import { otherTragedies } from './quotes/other-tragedies'
import { comedies } from './quotes/comedies'
import { histories } from './quotes/histories'
import { romancesAndSonnets } from './quotes/romances-sonnets'

export const QUOTES: Quote[] = [
  ...hamletMacbeth,
  ...otherTragedies,
  ...comedies,
  ...histories,
  ...romancesAndSonnets,
]

export const QUOTE_BY_ID: Record<string, Quote> = Object.fromEntries(
  QUOTES.map(q => [q.id, q]),
)

/** Display order for the Library: most-quoted plays first within each group. */
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

if (import.meta.env.DEV) {
  const seen = new Set<string>()
  for (const q of QUOTES) {
    if (seen.has(q.id)) console.warn(`[by-heart] duplicate quote id: ${q.id}`)
    seen.add(q.id)
    if (!PLAY_ORDER.includes(q.play)) console.warn(`[by-heart] play missing from PLAY_ORDER: ${q.play}`)
  }
}
