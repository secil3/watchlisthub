import { useState } from 'react'

export function ReviewForm({
  onSubmit,
}: {
  onSubmit: (value: { author: string; rating: 1 | 2 | 3 | 4 | 5; comment: string }) => void
}) {
  const [author, setAuthor] = useState('')
  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5>(5)
  const [comment, setComment] = useState('')

  const canSubmit = author.trim().length > 0 && comment.trim().length > 0

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault()
        if (!canSubmit) return
        onSubmit({ author: author.trim(), rating, comment: comment.trim() })
        setAuthor('')
        setRating(5)
        setComment('')
      }}
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block space-y-1 sm:col-span-1">
          <span className="text-xs font-medium text-slate-300">Name</span>
          <input
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none ring-fuchsia-500/30 focus:ring-2"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Your name"
          />
        </label>

        <label className="block space-y-1 sm:col-span-1">
          <span className="text-xs font-medium text-slate-300">Rating</span>
          <select
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none ring-fuchsia-500/30 focus:ring-2"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value) as 1 | 2 | 3 | 4 | 5)}
          >
            <option value={5}>5 - Excellent</option>
            <option value={4}>4 - Great</option>
            <option value={3}>3 - Good</option>
            <option value={2}>2 - Okay</option>
            <option value={1}>1 - Bad</option>
          </select>
        </label>

        <div className="sm:col-span-1 sm:flex sm:items-end">
          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Add review
          </button>
        </div>
      </div>

      <label className="block space-y-1">
        <span className="text-xs font-medium text-slate-300">Comment</span>
        <textarea
          className="min-h-24 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none ring-fuchsia-500/30 focus:ring-2"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What did you like / dislike?"
        />
      </label>
    </form>
  )
}

