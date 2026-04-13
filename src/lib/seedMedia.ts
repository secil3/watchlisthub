import type { MediaItem } from '../Interfaces/Media'
import { createId } from './id'
import { jsonPlaceholder } from './jsonPlaceholder'

type JPPost = { id: number; title: string; body: string }

function guessTypeFromId(id: number): 'movie' | 'series' {
  return id % 3 === 0 ? 'series' : 'movie'
}

function guessGenresFromId(id: number): string[] {
  const buckets = [
    ['Drama', 'Mystery'],
    ['Action', 'Thriller'],
    ['Sci-Fi', 'Adventure'],
    ['Comedy'],
    ['Romance', 'Drama'],
    ['Animation', 'Family'],
  ]
  return buckets[id % buckets.length] ?? ['Drama']
}

function pick<T>(arr: T[], index: number): T {
  return arr[index % arr.length]
}

function generateEnglishTitle(type: 'movie' | 'series', id: number) {
  const adjectives = ['Silent', 'Neon', 'Crimson', 'Hidden', 'Eternal', 'Arcane', 'Final', 'Lunar', 'Urban', 'Quantum']
  const nounsMovie = ['Run', 'Protocol', 'Signal', 'Revolution', 'Voyage', 'Cipher', 'Rapture', 'Empires', 'Chase', 'Legacy']
  const nounsSeries = ['Chronicle', 'Odyssey', 'Saga', 'Dispatch', 'Rebellion', 'Archive', 'Kingdom', 'Watch', 'Reckoning', 'Frontier']

  const adj = pick(adjectives, id)
  if (type === 'movie') {
    const noun = pick(nounsMovie, id * 3)
    return `${adj} ${noun}`
  }

  const noun = pick(nounsSeries, id * 5)
  return `The ${noun} of ${adj}`
}

function generateEnglishSummary(type: 'movie' | 'series', genres: string[]) {
  const g = genres.slice(0, 3)
  const opening = type === 'movie' ? 'A film centered on' : 'A series following'
  const themes = g.length ? g.join(', ') : 'mystery and adventure'
  return `${opening} ${themes}. This is a demo entry created for your watchlist app (seeded from JSONPlaceholder). It’s designed to be readable and consistent in English.`
}

export async function fetchSeedMedia(limit = 10): Promise<MediaItem[]> {
  const res = await jsonPlaceholder.get<JPPost[]>('/posts', { params: { _limit: limit } })
  const now = new Date().toISOString()
  return res.data.map((p) => {
    const type = guessTypeFromId(p.id)
    const year = 2010 + (p.id % 15)
    const rating = ((p.id % 5) + 1) as 1 | 2 | 3 | 4 | 5
    const title = generateEnglishTitle(type, p.id)
    const summary = generateEnglishSummary(type, guessGenresFromId(p.id))
    const safeTitle = title.slice(0, 28)
    const posterUrl = `https://placehold.co/320x480/png?text=${encodeURIComponent(safeTitle)}`
    return {
      id: createId('media'),
      type,
      title,
      rating,
      year,
      genres: guessGenresFromId(p.id),
      summary,
      posterUrl,
      isWatched: false,
      reviews: [],
      createdAt: now,
      updatedAt: now,
    }
  })
}

