import { Link, useNavigate, useParams } from 'react-router-dom'
import { MediaForm } from '../Components/Media/MediaForm'
import { ReviewForm } from '../Components/Media/ReviewForm'
import { useMedia } from '../storage/MediaContext'

export function MediaDetailPage() {
  const { id } = useParams()
  const nav = useNavigate()
  const { items, updateItem, deleteItem, addReview } = useMedia()

  const item = items.find((x) => x.id === id)
  if (!item) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
          Item not found.{' '}
          <Link to="/library" className="text-white underline">
            Back to library
          </Link>
        </div>
      </div>
    )
  }

  const poster = item.posterUrl || 'https://placehold.co/600x900/png?text=Poster'
  const itemStars = `${'★'.repeat(item.rating)}${'☆'.repeat(5 - item.rating)}`
  const reviewAverage =
    item.reviews.length > 0
      ? (item.reviews.reduce((acc, r) => acc + r.rating, 0) / item.reviews.length).toFixed(1)
      : null

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="relative h-28 w-20 overflow-hidden rounded-xl border border-white/10 bg-slate-950/40 sm:h-36 sm:w-24">
            <img src={poster} alt={`${item.title} poster`} className="h-full w-full object-cover" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white">{item.title}</h1>
            <p className="mt-1 text-sm text-amber-200">
              Overall rating: {itemStars} ({item.rating}/5)
            </p>
            <p className="mt-1 text-sm text-slate-300">
              Edit details, add reviews, or delete this item.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            deleteItem(item.id)
            nav('/library')
          }}
          className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-100 hover:bg-rose-500/15"
        >
          Delete
        </button>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-sm font-semibold text-white">Edit</h2>
          <div className="mt-4">
            <MediaForm
              initial={item}
              submitLabel="Update"
              onSubmit={(value) => {
                updateItem(item.id, value)
                nav('/library')
              }}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-sm font-semibold text-white">Reviews</h2>
          {reviewAverage ? (
            <p className="mt-1 text-xs text-slate-300">Average user review: {reviewAverage}/5</p>
          ) : null}
          <div className="mt-4">
            <ReviewForm onSubmit={(v) => addReview(item.id, v)} />
          </div>

          <div className="mt-5 space-y-3">
            {item.reviews.length === 0 ? (
              <p className="text-sm text-slate-300">No reviews yet.</p>
            ) : (
              item.reviews
                .slice()
                .reverse()
                .map((r) => (
                  <div key={r.id} className="rounded-xl border border-white/10 bg-slate-950/30 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-white">{r.author}</p>
                      <p className="text-xs text-slate-300">{'★'.repeat(r.rating)}</p>
                    </div>
                    <p className="mt-2 text-sm text-slate-200/90">{r.comment}</p>
                    <p className="mt-2 text-xs text-slate-400">
                      {new Date(r.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

