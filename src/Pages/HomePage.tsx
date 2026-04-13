import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useMedia } from '../storage/MediaContext'

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm">
      <p className="text-xs font-medium text-slate-300">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
    </div>
  )
}

export function HomePage() {
  const { items, stats, seedFromApi, isSeeding, seedError, exportAsJson, importFromJson } = useMedia()
  const featured = items.slice(0, 6)
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-fuchsia-500/15 via-white/5 to-cyan-500/10 p-6 shadow-sm sm:p-10">
        <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-fuchsia-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Your watchlist, beautifully organized.
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-200/90 sm:text-base">
              Track movies & series, add reviews, and keep everything saved in your browser.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                to="/library"
                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-100"
              >
                Browse library
              </Link>
              <Link
                to="/new"
                className="rounded-xl bg-fuchsia-500 px-4 py-2 text-sm font-semibold text-white hover:bg-fuchsia-400"
              >
                Add new
              </Link>
              <button
                onClick={() => void seedFromApi()}
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                disabled={isSeeding}
              >
                {isSeeding ? 'Loading…' : 'Fetch sample data (API)'}
              </button>
              <button
                onClick={exportAsJson}
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
              >
                Export JSON
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
              >
                Import JSON
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  try {
                    await importFromJson(file)
                  } catch {
                    // handled as user feedback via toast and console
                    console.error('Invalid import file')
                  } finally {
                    e.target.value = ''
                  }
                }}
              />
            </div>

            {seedError ? (
              <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-100">
                Seed error: {seedError}
              </div>
            ) : null}
          </div>

          <div className="grid w-full max-w-md grid-cols-3 gap-3">
            <Stat label="Total" value={stats.total} />
            <Stat label="Watched" value={stats.watched} />
            <Stat label="Reviews" value={stats.reviews} />
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">Featured</h2>
            <p className="mt-1 text-sm text-slate-300">A quick look at your latest items.</p>
          </div>
          <Link to="/library" className="text-sm font-semibold text-white/90 hover:text-white">
            View all →
          </Link>
        </div>

        {featured.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
            Your library is empty. Add a movie/series to see it here.
          </div>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((x) => {
              const poster = x.posterUrl || 'https://placehold.co/640x960/png?text=Poster'
              return (
                <Link
                  key={x.id}
                  to={`/library/${x.id}`}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10"
                >
                  <div className="flex gap-4 p-4">
                    <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-slate-950/40">
                      <img
                        src={poster}
                        alt={`${x.title} poster`}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">{x.title}</p>
                      <p className="mt-1 text-xs text-slate-300">
                        {x.type === 'movie' ? 'Movie' : 'Series'}
                        {x.year ? ` • ${x.year}` : ''}
                        {x.isWatched ? ' • Watched' : ' • To watch'}
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm text-slate-300">
                        {x.summary ?? '—'}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {x.genres.slice(0, 2).map((g) => (
                          <span key={g} className="text-xs text-slate-400">
                            #{g}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      <section className="mt-8 grid gap-3 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-base font-semibold text-white">How this project works</h2>
          <p className="mt-1 text-sm text-slate-200/90">
            Sample data is fetched from <span className="font-semibold">JSONPlaceholder</span> using{' '}
            <span className="font-semibold">Axios</span>. Your add/edit/delete actions are saved to{' '}
            <span className="font-semibold">LocalStorage</span>.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">React</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              TypeScript
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Vite</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Axios</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              Tailwind
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-5">
          <h2 className="text-base font-semibold text-white">Quick tips</h2>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li>Use posters to make your library pop.</li>
            <li>Add short summaries for better browsing.</li>
            <li>Mark items as watched to track progress.</li>
          </ul>
        </div>
      </section>
    </div>
  )
}

