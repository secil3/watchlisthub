import type { MediaItem } from '../../Interfaces/Media'
import { Badge } from '../Common/Badge'
import { Link } from 'react-router-dom'

export function MediaCard({
  item,
  onToggleWatched,
  onDelete,
}: {
  item: MediaItem
  onToggleWatched: () => void
  onDelete: () => void
}) {
  const poster = item.posterUrl || 'https://placehold.co/320x480/png?text=Poster'
  const stars = `${'★'.repeat(item.rating)}${'☆'.repeat(5 - item.rating)}`
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-sm">
      <div className="grid grid-cols-[96px,1fr,auto] gap-4 p-4 sm:grid-cols-[112px,1fr,auto]">
        <div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-slate-950/40 sm:h-40 sm:w-28">
          <img
            src={poster}
            alt={`${item.title} poster`}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/70 to-transparent" />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-base font-semibold text-white">{item.title}</h3>
            <Badge>{item.type === 'movie' ? 'Movie' : 'Series'}</Badge>
            <Badge>{`Rating ${item.rating}/5`}</Badge>
            {item.year ? <Badge>{item.year}</Badge> : null}
            {item.isWatched ? <Badge>Watched</Badge> : <Badge>To watch</Badge>}
          </div>
          <p className="mt-1 text-xs tracking-wide text-amber-200">{stars}</p>
          <p className="mt-2 line-clamp-2 text-sm text-slate-300">{item.summary ?? '—'}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {item.genres.slice(0, 3).map((g) => (
              <span key={g} className="text-xs text-slate-400">
                #{g}
              </span>
            ))}
            {item.genres.length > 3 ? (
              <span className="text-xs text-slate-500">+{item.genres.length - 3}</span>
            ) : null}
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2 self-start">
          <Link
            to={`/library/${item.id}`}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-100 hover:bg-white/10"
          >
            Details
          </Link>
          <button
            onClick={onToggleWatched}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-100 hover:bg-white/10"
          >
            {item.isWatched ? 'Mark unwatched' : 'Mark watched'}
          </button>
          <button
            onClick={onDelete}
            className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-100 hover:bg-rose-500/15"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

