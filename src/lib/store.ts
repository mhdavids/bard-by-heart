import { useSyncExternalStore } from 'react'
import type { CardState, DayLog, Grade, Progress } from '../types'
import { QUOTES } from '../data/quotes'
import { applyGrade, newCard } from './srs'

const KEY = 'by-heart-v1'

const DEFAULT: Progress = {
  cards: {},
  log: {},
  scenarios: {},
  queued: [],
  settings: { newPerDay: 5, multipleChoice: false },
}

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return structuredClone(DEFAULT)
    const parsed = JSON.parse(raw)
    return { ...structuredClone(DEFAULT), ...parsed, settings: { ...DEFAULT.settings, ...parsed.settings } }
  } catch {
    return structuredClone(DEFAULT)
  }
}

let state: Progress = load()
const listeners = new Set<() => void>()

function emit() {
  localStorage.setItem(KEY, JSON.stringify(state))
  listeners.forEach(l => l())
}

export function subscribe(l: () => void): () => void {
  listeners.add(l)
  return () => listeners.delete(l)
}

export function getState(): Progress {
  return state
}

export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, getState)
}

export function todayKey(d = new Date()): string {
  return d.toLocaleDateString('en-CA') // YYYY-MM-DD, local time
}

function bumpLog(patch: Partial<DayLog>) {
  const key = todayKey()
  const cur = state.log[key] ?? { reviews: 0, learned: 0 }
  state = {
    ...state,
    log: { ...state.log, [key]: { reviews: cur.reviews + (patch.reviews ?? 0), learned: cur.learned + (patch.learned ?? 0) } },
  }
}

// ── Actions ──────────────────────────────────────────────────────────────

export function startLearning(quoteId: string): CardState {
  const existing = state.cards[quoteId]
  if (existing) return existing
  const card = newCard(quoteId)
  state = { ...state, cards: { ...state.cards, [quoteId]: card }, queued: state.queued.filter(q => q !== quoteId) }
  bumpLog({ learned: 1 })
  emit()
  return card
}

export function gradeCard(quoteId: string, grade: Grade) {
  const card = state.cards[quoteId]
  if (!card) return
  state = { ...state, cards: { ...state.cards, [quoteId]: applyGrade(card, grade) } }
  bumpLog({ reviews: 1 })
  emit()
}

export function queueQuote(quoteId: string) {
  if (state.cards[quoteId] || state.queued.includes(quoteId)) return
  state = { ...state, queued: [...state.queued, quoteId] }
  emit()
}

export function recordScenario(id: string, got: boolean) {
  const cur = state.scenarios[id] ?? { seen: 0, got: 0 }
  state = { ...state, scenarios: { ...state.scenarios, [id]: { seen: cur.seen + 1, got: cur.got + (got ? 1 : 0) } } }
  emit()
}

export function updateSettings(patch: Partial<Progress['settings']>) {
  state = { ...state, settings: { ...state.settings, ...patch } }
  emit()
}

export function importProgress(json: string): string | null {
  try {
    const parsed = JSON.parse(json)
    if (typeof parsed !== 'object' || !parsed || typeof parsed.cards !== 'object') {
      return 'That file does not look like a By Heart backup.'
    }
    state = { ...structuredClone(DEFAULT), ...parsed, settings: { ...DEFAULT.settings, ...parsed.settings } }
    emit()
    return null
  } catch {
    return 'Could not parse that file as JSON.'
  }
}

export function exportProgress(): string {
  return JSON.stringify(state, null, 2)
}

export function resetProgress() {
  state = structuredClone(DEFAULT)
  emit()
}

// ── Selectors ────────────────────────────────────────────────────────────

export function dueCards(p: Progress, now = Date.now()): CardState[] {
  return Object.values(p.cards).filter(c => c.due <= now).sort((a, b) => a.due - b.due)
}

export function newLearnedToday(p: Progress): number {
  return p.log[todayKey()]?.learned ?? 0
}

/** Next quotes to introduce: explicit queue first, then starters, then the rest. */
export function nextNewQuotes(p: Progress, limit: number): string[] {
  const started = new Set(Object.keys(p.cards))
  const out: string[] = []
  for (const id of p.queued) if (!started.has(id) && out.length < limit) out.push(id)
  const remaining = QUOTES.filter(q => !started.has(q.id) && !out.includes(q.id))
  const ranked = [
    ...remaining.filter(q => q.starter),
    ...remaining.filter(q => !q.starter).sort((a, b) => a.difficulty - b.difficulty),
  ]
  for (const q of ranked) {
    if (out.length >= limit) break
    out.push(q.id)
  }
  return out
}

export function streak(p: Progress): number {
  let n = 0
  const d = new Date()
  // Today counts if any activity; otherwise start from yesterday.
  if (!p.log[todayKey(d)]) d.setDate(d.getDate() - 1)
  while (p.log[todayKey(d)]) {
    n++
    d.setDate(d.getDate() - 1)
  }
  return n
}
