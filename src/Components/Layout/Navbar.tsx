import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../storage/AuthContext'

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'rounded-full px-3.5 py-2 text-sm font-medium transition',
          isActive
            ? 'bg-white text-slate-950 shadow-sm'
            : 'text-slate-200 hover:bg-white/10 hover:text-white',
        ].join(' ')
      }
      end
    >
      {label}
    </NavLink>
  )
}

export function Navbar() {
  const { currentUser, isAuthenticated, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-cyan-500 text-sm font-semibold text-white shadow-sm">
            W
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-wide text-white">WatchlistHub</p>
            <p className="text-[11px] text-slate-300">Movies, series & reviews</p>
          </div>
        </Link>
        <nav className="flex items-center gap-1 rounded-full border border-white/10 bg-slate-900/80 px-1.5 py-1 shadow-sm">
          <NavItem to="/" label="Dashboard" />
          <NavItem to="/library" label="Library" />
          {isAuthenticated ? <NavItem to="/new" label="Add" /> : null}
        </nav>
        <div className="ml-3 flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <span className="hidden text-xs text-slate-300 sm:inline">{currentUser?.name}</span>
              <button
                onClick={signOut}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="rounded-xl bg-fuchsia-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-fuchsia-400"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

