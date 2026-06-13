import type { Quote } from '../types'

export function firstLine(q: Quote): string {
  const line = q.text.split('\n')[0]
  return line.length > 64 ? line.slice(0, 61).trimEnd() + '…' : line
}

export function attribution(q: Quote): string {
  return q.category === 'sonnet' ? q.cite : `${q.speaker} · ${q.play}, ${q.cite}`
}

/** Deterministic pick for quote-of-the-day. */
export function quoteOfTheDay<T>(items: T[], dateKey: string): T {
  let h = 0
  for (let i = 0; i < dateKey.length; i++) h = (h * 31 + dateKey.charCodeAt(i)) >>> 0
  return items[h % items.length]
}

export function shuffled<T>(items: T[]): T[] {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export const VICTORY_LINES = [
  '“Well roared, Lion!” — A Midsummer Night\'s Dream',
  '“This was the noblest Roman of them all.” — Julius Caesar',
  '“O brave new world, that has such people in\'t!” — The Tempest',
  '“All\'s well that ends well.” — All\'s Well That Ends Well',
  '“The game\'s afoot!” — Henry V',
  '“There was a star danced, and under that was I born.” — Much Ado About Nothing',
]
