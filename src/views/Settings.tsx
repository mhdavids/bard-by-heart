import { useRef, useState } from 'react'
import { useProgress, updateSettings, exportProgress, importProgress, resetProgress } from '../lib/store'
import { QUOTES } from '../data/quotes'
import { SCENARIOS } from '../data/scenarios'

export function Settings({ onClose }: { onClose: () => void }) {
  const p = useProgress()
  const fileRef = useRef<HTMLInputElement>(null)
  const [confirmReset, setConfirmReset] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  function download() {
    const blob = new Blob([exportProgress()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `by-heart-progress-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function onImportFile(file: File | undefined) {
    if (!file) return
    const err = importProgress(await file.text())
    setMessage(err ?? 'Progress imported.')
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()}>
        <button className="sheet-close" onClick={onClose} aria-label="Close">✕</button>
        <div className="sheet-scroll">
          <h2>Settings</h2>

          <section>
            <h4>New lines per day</h4>
            <div className="chip-row">
              {[3, 5, 8, 12].map(n => (
                <button
                  key={n}
                  className={`chip ${p.settings.newPerDay === n ? 'active' : ''}`}
                  onClick={() => updateSettings({ newPerDay: n })}
                >{n}</button>
              ))}
            </div>
            <p className="muted">Reviews of lines you already know don't count against this.</p>
          </section>

          <section>
            <h4>Occasion drills</h4>
            <label className="mc-toggle">
              <input
                type="checkbox"
                checked={p.settings.multipleChoice}
                onChange={e => updateSettings({ multipleChoice: e.target.checked })}
              />
              Multiple-choice mode
            </label>
          </section>

          <section>
            <h4>Your progress</h4>
            <p className="muted">Progress lives in this browser only. Export a backup before switching devices, then import it there.</p>
            <div className="btn-row">
              <button className="btn" onClick={download}>Export backup</button>
              <button className="btn" onClick={() => fileRef.current?.click()}>Import backup</button>
            </div>
            <input
              ref={fileRef} type="file" accept="application/json" hidden
              onChange={e => onImportFile(e.target.files?.[0])}
            />
            {message && <p className="muted">{message}</p>}
          </section>

          <section>
            <h4>Danger zone</h4>
            {!confirmReset ? (
              <button className="btn" onClick={() => setConfirmReset(true)}>Reset all progress…</button>
            ) : (
              <div className="btn-row">
                <button className="btn danger" onClick={() => { resetProgress(); setConfirmReset(false); setMessage('Progress reset.') }}>
                  Yes, wipe everything
                </button>
                <button className="btn" onClick={() => setConfirmReset(false)}>Keep my progress</button>
              </div>
            )}
          </section>

          <section>
            <h4>About</h4>
            <p className="muted">
              {QUOTES.length} quotes · {SCENARIOS.length} occasions. Texts follow standard modern-spelling
              editions; act/scene numbering and punctuation vary slightly between editions (Folio vs. Quarto
              vs. modern editors), so don't panic if your copy differs by a comma.
            </p>
            <p className="muted">Learning ladder: read it → type the missing words → recall it from a first-letter skeleton → recite the whole thing from memory, on a spaced-repetition schedule. Every rung is <em>typed and checked word-by-word</em> against the text — no peeking-and-guessing. Your measured accuracy gates the grade, so “Easy” is only on offer when you got every word.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
