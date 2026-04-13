import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-xl font-semibold text-white">Page not found</h1>
        <p className="mt-2 text-sm text-slate-300">
          Go back to the dashboard{' '}
          <Link to="/" className="font-semibold text-white underline underline-offset-4">
            here
          </Link>
          .
        </p>
      </div>
    </div>
  )
}

