export type AuthUser = {
  id: string
  name: string
  email: string
  password: string
}

const USERS_KEY = 'auth:users:v1'
const SESSION_KEY = 'auth:session:v1'

function parseJson<T>(value: string | null): T | null {
  if (!value) return null
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

export function loadUsers(): AuthUser[] {
  const parsed = parseJson<AuthUser[]>(localStorage.getItem(USERS_KEY))
  return Array.isArray(parsed) ? parsed : []
}

export function saveUsers(users: AuthUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function loadSessionUserId(): string | null {
  const parsed = parseJson<{ userId: string }>(localStorage.getItem(SESSION_KEY))
  return parsed?.userId ?? null
}

export function saveSessionUserId(userId: string) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ userId }))
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}
