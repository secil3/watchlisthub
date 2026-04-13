import type { MediaItem } from '../Interfaces/Media'

const STORAGE_KEY = 'media:v1'

function safeParse(json: string | null): unknown {
  if (!json) return null
  try {
    return JSON.parse(json)
  } catch {
    return null
  }
}

function normalizeItem(item: MediaItem): MediaItem {
  const ratingValue = Number(item.rating)
  const rating: 1 | 2 | 3 | 4 | 5 =
    ratingValue >= 1 && ratingValue <= 5 ? (Math.round(ratingValue) as 1 | 2 | 3 | 4 | 5) : 3

  return {
    ...item,
    rating,
    genres: Array.isArray(item.genres) ? item.genres : [],
    reviews: Array.isArray(item.reviews) ? item.reviews : [],
    isWatched: Boolean(item.isWatched),
  }
}

export function loadMedia(): MediaItem[] {
  const parsed = safeParse(localStorage.getItem(STORAGE_KEY))
  if (!Array.isArray(parsed)) return []
  return parsed
    .filter(Boolean)
    .map((x) => x as MediaItem)
    .map(normalizeItem)
}

export function saveMedia(items: MediaItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

