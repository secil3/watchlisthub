import { useMemo, useState } from 'react'
import type { MediaItem, MediaType } from '../../Interfaces/Media'

type Draft = {
  type: MediaType
  title: string
  rating: 1 | 2 | 3 | 4 | 5
  year: string
  genres: string
  summary: string
  posterUrl: string
  isWatched: boolean
}

function toDraft(item?: MediaItem): Draft {
  return {
    type: item?.type ?? 'movie',
    title: item?.title ?? '',
    rating: item?.rating ?? 4,
    year: item?.year ? String(item.year) : '',
    genres: (item?.genres ?? []).join(', '),
    summary: item?.summary ?? '',
    posterUrl: item?.posterUrl ?? '',
    isWatched: item?.isWatched ?? false,
  }
}

function parseGenres(genres: string): string[] {
  return genres
    .split(',')
    .map((g) => g.trim())
    .filter(Boolean)
    .slice(0, 8)
}

export function MediaForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial?: MediaItem
  submitLabel: string
  onSubmit: (value: Omit<MediaItem, 'id' | 'createdAt' | 'updatedAt'>) => void
}) {
  const [draft, setDraft] = useState<Draft>(() => toDraft(initial))
  const [touched, setTouched] = useState(false)

  const yearNumber = useMemo(() => {
    if (!draft.year.trim()) return undefined
    const n = Number(draft.year)
    return Number.isFinite(n) ? Math.trunc(n) : undefined
  }, [draft.year])

  const errors = useMemo(() => {
    const out: Record<string, string> = {}
    if (!draft.title.trim()) out.title = 'Title is required'
    if (draft.year.trim() && !yearNumber) out.year = 'Year must be a number'
    return out
  }, [draft.title, draft.year, yearNumber])

  const canSubmit = Object.keys(errors).length === 0

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        setTouched(true)
        if (!canSubmit) return
        onSubmit({
          type: draft.type,
          title: draft.title.trim(),
          rating: draft.rating,
          year: yearNumber,
          genres: parseGenres(draft.genres),
          summary: draft.summary.trim() || undefined,
          posterUrl: draft.posterUrl.trim() || undefined,
          isWatched: draft.isWatched,
          reviews: initial?.reviews ?? [],
        })
      }}
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="space-y-1">
          <span className="text-xs font-medium text-slate-300">Type</span>
          <select
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none ring-fuchsia-500/30 focus:ring-2"
            value={draft.type}
            onChange={(e) => setDraft((p) => ({ ...p, type: e.target.value as MediaType }))}
          >
            <option value="movie">Movie</option>
            <option value="series">Series</option>
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-xs font-medium text-slate-300">Rating</span>
          <select
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none ring-fuchsia-500/30 focus:ring-2"
            value={draft.rating}
            onChange={(e) =>
              setDraft((p) => ({ ...p, rating: Number(e.target.value) as 1 | 2 | 3 | 4 | 5 }))
            }
          >
            <option value={5}>5 ★★★★★</option>
            <option value={4}>4 ★★★★☆</option>
            <option value={3}>3 ★★★☆☆</option>
            <option value={2}>2 ★★☆☆☆</option>
            <option value={1}>1 ★☆☆☆☆</option>
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-xs font-medium text-slate-300">Year</span>
          <input
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none ring-fuchsia-500/30 focus:ring-2"
            value={draft.year}
            onChange={(e) => setDraft((p) => ({ ...p, year: e.target.value }))}
            placeholder="e.g. 2021"
            inputMode="numeric"
          />
          {touched && errors.year ? <p className="text-xs text-rose-200">{errors.year}</p> : null}
        </label>
      </div>

      <label className="block space-y-1">
        <span className="text-xs font-medium text-slate-300">Title</span>
        <input
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none ring-fuchsia-500/30 focus:ring-2"
          value={draft.title}
          onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))}
          placeholder="e.g. Interstellar"
        />
        {touched && errors.title ? (
          <p className="text-xs text-rose-200">{errors.title}</p>
        ) : null}
      </label>

      <label className="block space-y-1">
        <span className="text-xs font-medium text-slate-300">Genres (comma separated)</span>
        <input
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none ring-fuchsia-500/30 focus:ring-2"
          value={draft.genres}
          onChange={(e) => setDraft((p) => ({ ...p, genres: e.target.value }))}
          placeholder="e.g. Sci-Fi, Drama"
        />
      </label>

      <label className="block space-y-1">
        <span className="text-xs font-medium text-slate-300">Summary</span>
        <textarea
          className="min-h-28 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none ring-fuchsia-500/30 focus:ring-2"
          value={draft.summary}
          onChange={(e) => setDraft((p) => ({ ...p, summary: e.target.value }))}
          placeholder="Short description…"
        />
      </label>

      <label className="block space-y-1">
        <span className="text-xs font-medium text-slate-300">Poster URL (optional)</span>
        <input
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none ring-fuchsia-500/30 focus:ring-2"
          value={draft.posterUrl}
          onChange={(e) => setDraft((p) => ({ ...p, posterUrl: e.target.value }))}
          placeholder="https://…"
        />
      </label>

      <label className="flex items-center gap-2 text-sm text-slate-200">
        <input
          type="checkbox"
          checked={draft.isWatched}
          onChange={(e) => setDraft((p) => ({ ...p, isWatched: e.target.checked }))}
        />
        I’ve watched it
      </label>

      <button
        type="submit"
        className="w-full rounded-xl bg-fuchsia-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-fuchsia-400 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={!canSubmit}
      >
        {submitLabel}
      </button>
    </form>
  )
}

