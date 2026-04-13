import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../storage/AuthContext'

export function SignUpPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-semibold text-white">Sign up</h1>
        <p className="mt-1 text-sm text-slate-300">Create an account to manage your watchlist.</p>

        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            const result = signUp(name, email, password)
            if (!result.ok) {
              setError(result.message ?? 'Sign up failed.')
              return
            }
            navigate('/', { replace: true })
          }}
        >
          <label className="block">
            <span className="mb-1 block text-sm text-slate-200">Name</span>
            <input
              type="text"
              required
              className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white outline-none ring-fuchsia-500/30 focus:ring-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm text-slate-200">Email</span>
            <input
              type="email"
              required
              className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white outline-none ring-fuchsia-500/30 focus:ring-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm text-slate-200">Password</span>
            <input
              type="password"
              required
              minLength={6}
              className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white outline-none ring-fuchsia-500/30 focus:ring-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {error ? (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-xl bg-fuchsia-500 px-4 py-2 text-sm font-semibold text-white hover:bg-fuchsia-400"
          >
            Create account
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-300">
          Already have an account?{' '}
          <Link className="font-semibold text-white underline underline-offset-4" to="/signin">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
