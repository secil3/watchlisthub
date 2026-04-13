import type { MediaItem } from '../Interfaces/Media'

const now = new Date().toISOString()

export const starterMedia: MediaItem[] = [
  {
    id: 'media_starter_interstellar',
    type: 'movie',
    title: 'Interstellar',
    rating: 5,
    year: 2014,
    genres: ['Sci-Fi', 'Drama', 'Adventure'],
    posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    summary:
      'A team of explorers travel through a wormhole in space in an attempt to ensure humanity’s survival.',
    isWatched: true,
    reviews: [],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'media_starter_inception',
    type: 'movie',
    title: 'Inception',
    rating: 5,
    year: 2010,
    genres: ['Sci-Fi', 'Action', 'Thriller'],
    posterUrl: 'https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg',
    summary:
      'A thief who steals corporate secrets through dream-sharing technology is given an impossible task: inception.',
    isWatched: false,
    reviews: [],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'media_starter_breakingbad',
    type: 'series',
    title: 'Breaking Bad',
    rating: 5,
    year: 2008,
    genres: ['Crime', 'Drama', 'Thriller'],
    posterUrl: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
    summary:
      'A chemistry teacher diagnosed with cancer turns to manufacturing and selling methamphetamine.',
    isWatched: true,
    reviews: [],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'media_starter_strangerthings',
    type: 'series',
    title: 'Stranger Things',
    rating: 4,
    year: 2016,
    genres: ['Sci-Fi', 'Mystery', 'Drama'],
    posterUrl: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
    summary:
      'When a young boy vanishes, a small town uncovers a mystery involving secret experiments and supernatural forces.',
    isWatched: false,
    reviews: [],
    createdAt: now,
    updatedAt: now,
  },
]

