export type MediaType = 'movie' | 'series'

export interface Review {
  id: string
  author: string
  rating: 1 | 2 | 3 | 4 | 5
  comment: string
  createdAt: string
}

export interface MediaItem {
  id: string
  type: MediaType
  title: string
  rating: 1 | 2 | 3 | 4 | 5
  year?: number
  genres: string[]
  posterUrl?: string
  summary?: string
  isWatched: boolean
  reviews: Review[]
  createdAt: string
  updatedAt: string
}

