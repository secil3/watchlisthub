import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MediaCard } from '../Components/Media/MediaCard'
import { useAuth } from '../storage/AuthContext'
import { useMedia } from '../storage/MediaContext'

export function LibraryPage() {
  const { isAuthenticated } = useAuth()
  const { items, updateItem, deleteItem } = useMedia()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'movie' | 'series'>('all')
  const [watched, setWatched] = useState<'all' | 'watched' | 'unwatched'>('all')
  const [minRating, setMinRating] = useState<'all' | '4' | '3' | '2' | '1'>('all')
  const [genre, setGenre] = useState<'all' | string>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating' | 'year' | 'title'>('newest')

  const allGenres = useMemo(() => {
    const set = new Set<string>()
    for (const item of items) {
      for (const g of item.genres) set.add(g)
    }
    return [...set].sort((a, b) => a.localeCompare(b))
  }, [items])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const min = minRating === 'all' ? 0 : Number(minRating)

    const base = items.filter((x) => {
      if (filter !== 'all' && x.type !== filter) return false
      if (watched === 'watched' && !x.isWatched) return false
      if (watched === 'unwatched' && x.isWatched) return false
      if (genre !== 'all' && !x.genres.includes(genre)) return false
      if (x.rating < min) return false
      if (!q) return true
      return (
        x.title.toLowerCase().includes(q) ||
        x.genres.join(' ').toLowerCase().includes(q) ||
        (x.summary ?? '').toLowerCase().includes(q)
      )
    })

    base.sort((a, b) => {
      if (sortBy === 'newest') return b.createdAt.localeCompare(a.createdAt)
      if (sortBy === 'oldest') return a.createdAt.localeCompare(b.createdAt)
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'year') return (b.year ?? 0) - (a.year ?? 0)
      return a.title.localeCompare(b.title)
    })

    return base
  }, [items, query, filter, watched, minRating, genre, sortBy])

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Library</h1>
          <p className="mt-1 text-sm text-slate-300">
            Search, filter, and manage your items.
          </p>
        </div>
        {isAuthenticated ? (
          <Link
            to="/new"
            className="inline-flex items-center justify-center rounded-xl bg-fuchsia-500 px-4 py-2 text-sm font-semibold text-white hover:bg-fuchsia-400"
          >
            Add new
          </Link>
        ) : (
          <Link
            to="/signin"
            className="inline-flex items-center justify-center rounded-xl border border-fuchsia-500/30 bg-fuchsia-500/10 px-4 py-2 text-sm font-semibold text-fuchsia-100 hover:bg-fuchsia-500/20"
          >
            Sign in to add
          </Link>
        )}
      </div>

      <div className="mt-5 grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 sm:grid-cols-6">
        <label className="sm:col-span-2">
          <span className="sr-only">Search</span>
          <input
            className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white outline-none ring-fuchsia-500/30 focus:ring-2"
            placeholder="Search: title, genres, summary…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>

        <select
          className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white outline-none ring-fuchsia-500/30 focus:ring-2"
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
        >
          <option value="all">All</option>
          <option value="movie">Movies</option>
          <option value="series">Series</option>
        </select>

        <select
          className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white outline-none ring-fuchsia-500/30 focus:ring-2"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        >
          <option value="all">Genre: All</option>
          {allGenres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        <select
          className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white outline-none ring-fuchsia-500/30 focus:ring-2"
          value={watched}
          onChange={(e) => setWatched(e.target.value as typeof watched)}
        >
          <option value="all">Status: All</option>
          <option value="watched">Watched</option>
          <option value="unwatched">To watch</option>
        </select>

        <select
          className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white outline-none ring-fuchsia-500/30 focus:ring-2"
          value={minRating}
          onChange={(e) => setMinRating(e.target.value as typeof minRating)}
        >
          <option value="all">Rating: All</option>
          <option value="4">4★ and up</option>
          <option value="3">3★ and up</option>
          <option value="2">2★ and up</option>
          <option value="1">1★ and up</option>
        </select>

        <select
          className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white outline-none ring-fuchsia-500/30 focus:ring-2"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
        >
          <option value="newest">Sort: Newest</option>
          <option value="oldest">Sort: Oldest</option>
          <option value="rating">Sort: Rating</option>
          <option value="year">Sort: Year</option>
          <option value="title">Sort: Title</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
          No results. To add a new item,{' '}
          <Link to="/new" className="font-semibold text-white underline underline-offset-4">
            click here
          </Link>
          .
        </div>
      ) : (
        <div className="mt-6 grid gap-3">
          {filtered.map((item) => (
            <MediaCard
              key={item.id}
              item={item}
              onToggleWatched={() => {
                if (!isAuthenticated) return
                updateItem(item.id, { isWatched: !item.isWatched })
              }}
              onDelete={() => {
                if (!isAuthenticated) return
                deleteItem(item.id)
              }}
              canManage={isAuthenticated}
            />
          ))}
        </div>
      )}
    </div>
  )
}

