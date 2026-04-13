import { createContext, useContext, useMemo, useState } from 'react'
import { createId } from '../lib/id'
import {
  clearSession,
  loadSessionUserId,
  loadUsers,
  saveSessionUserId,
  saveUsers,
  type AuthUser,
} from './authStorage'

type PublicUser = Omit<AuthUser, 'password'>

type AuthContextValue = {
  currentUser: PublicUser | null
  isAuthenticated: boolean
  signUp: (name: string, email: string, password: string) => { ok: boolean; message?: string }
  signIn: (email: string, password: string) => { ok: boolean; message?: string }
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function toPublicUser(user: AuthUser): PublicUser {
  return { id: user.id, name: user.name, email: user.email }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<AuthUser[]>(() => loadUsers())
  const [sessionUserId, setSessionUserId] = useState<string | null>(() => loadSessionUserId())

  const currentUser = useMemo(() => {
    const found = users.find((u) => u.id === sessionUserId)
    return found ? toPublicUser(found) : null
  }, [users, sessionUserId])

  function signUp(name: string, email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase()
    const normalizedName = name.trim()
    if (!normalizedName || !normalizedEmail || !password) {
      return { ok: false, message: 'All fields are required.' }
    }
    if (password.length < 6) {
      return { ok: false, message: 'Password must be at least 6 characters.' }
    }
    if (users.some((u) => u.email === normalizedEmail)) {
      return { ok: false, message: 'Email is already registered.' }
    }

    const next: AuthUser = {
      id: createId('user'),
      name: normalizedName,
      email: normalizedEmail,
      password,
    }
    const nextUsers = [...users, next]
    setUsers(nextUsers)
    saveUsers(nextUsers)
    setSessionUserId(next.id)
    saveSessionUserId(next.id)
    return { ok: true }
  }

  function signIn(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase()
    const found = users.find((u) => u.email === normalizedEmail && u.password === password)
    if (!found) return { ok: false, message: 'Invalid email or password.' }
    setSessionUserId(found.id)
    saveSessionUserId(found.id)
    return { ok: true }
  }

  function signOut() {
    setSessionUserId(null)
    clearSession()
  }

  const value: AuthContextValue = {
    currentUser,
    isAuthenticated: Boolean(currentUser),
    signUp,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
