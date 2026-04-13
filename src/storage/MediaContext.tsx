import { createContext, useContext, type ReactNode } from 'react'
import type { ReturnTypeOfUseMediaStore } from './types.ts'

const MediaContext = createContext<ReturnTypeOfUseMediaStore | null>(null)

export function MediaProvider({
  value,
  children,
}: {
  value: ReturnTypeOfUseMediaStore
  children: ReactNode
}) {
  return <MediaContext.Provider value={value}>{children}</MediaContext.Provider>
}

export function useMedia() {
  const ctx = useContext(MediaContext)
  if (!ctx) throw new Error('useMedia must be used within MediaProvider')
  return ctx
}

