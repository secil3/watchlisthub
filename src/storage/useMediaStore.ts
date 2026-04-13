import { useEffect, useMemo, useState } from 'react'
import type { MediaItem, Review } from '../Interfaces/Media'
import { createId } from '../lib/id'
import { fetchSeedMedia } from '../lib/seedMedia'
import { starterMedia } from '../lib/starterMedia'
import { loadMedia, saveMedia } from './mediaStorage'

export function useMediaStore() {
  const [items, setItems] = useState<MediaItem[]>(() => {
    const existing = loadMedia()
    return existing.length > 0 ? existing : starterMedia
  })
  const [isSeeding, setIsSeeding] = useState(false)
  const [seedError, setSeedError] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  function showToast(message: string) {
    setToastMessage(message)
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev))
    }, 1800)
  }

  useEffect(() => {
    saveMedia(items)
  }, [items])

  async function seedFromApi() {
    setIsSeeding(true)
    setSeedError(null)
    try {
      const seeded = await fetchSeedMedia(12)
      setItems(seeded) // replace existing items
      showToast('Sample data fetched from API.')
    } catch (e) {
      setSeedError(e instanceof Error ? e.message : 'Seed failed')
      showToast('Failed to fetch API data.')
    } finally {
      setIsSeeding(false)
    }
  }

  function addItem(input: Omit<MediaItem, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString()
    const next: MediaItem = { ...input, id: createId('media'), createdAt: now, updatedAt: now }
    setItems((prev) => [next, ...prev])
    showToast('Item added.')
  }

  function updateItem(id: string, patch: Partial<Omit<MediaItem, 'id' | 'createdAt'>>) {
    const now = new Date().toISOString()
    setItems((prev) =>
      prev.map((x) => (x.id === id ? { ...x, ...patch, updatedAt: now } : x)),
    )
    showToast('Item updated.')
  }

  function deleteItem(id: string) {
    setItems((prev) => prev.filter((x) => x.id !== id))
    showToast('Item deleted.')
  }

  function addReview(mediaId: string, input: Omit<Review, 'id' | 'createdAt'>) {
    const now = new Date().toISOString()
    const review: Review = { ...input, id: createId('review'), createdAt: now }
    updateItem(mediaId, {
      reviews: (items.find((x) => x.id === mediaId)?.reviews ?? []).concat(review),
    })
    showToast('Review added.')
  }

  function exportAsJson() {
    const payload = JSON.stringify(items, null, 2)
    const blob = new Blob([payload], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `watchlist-export-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Exported watchlist JSON.')
  }

  async function importFromJson(file: File) {
    try {
      const text = await file.text()
      const parsed = JSON.parse(text) as unknown
      if (!Array.isArray(parsed)) throw new Error('Invalid JSON format')
      const imported = parsed.map((x) => x as MediaItem)
      setItems(imported)
      showToast('Imported watchlist JSON.')
    } catch {
      showToast('Import failed: invalid JSON file.')
      throw new Error('Invalid JSON file')
    }
  }

  const stats = useMemo(() => {
    const total = items.length
    const watched = items.filter((x) => x.isWatched).length
    const reviews = items.reduce((acc, x) => acc + x.reviews.length, 0)
    return { total, watched, reviews }
  }, [items])

  return {
    items,
    stats,
    isSeeding,
    seedError,
    toastMessage,
    seedFromApi,
    addItem,
    updateItem,
    deleteItem,
    addReview,
    exportAsJson,
    importFromJson,
  }
}

