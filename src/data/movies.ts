import type { Movie } from '../types/movie';

const posterBaseUrl = 'https://image.tmdb.org/t/p/w500';

export const movies: Movie[] = [
  {
    id: 'shawshank-redemption',
    title: 'The Shawshank Redemption',
    year: 1994,
    genre: 'Drama',
    rating: 9.3,
    posterUrl: `${posterBaseUrl}/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg`,
  },
  {
    id: 'dark-knight',
    title: 'The Dark Knight',
    year: 2008,
    genre: 'Action',
    rating: 9.0,
    posterUrl: `${posterBaseUrl}/qJ2tW6WMUDux911r6m7haRef0WH.jpg`,
  },
  {
    id: 'inception',
    title: 'Inception',
    year: 2010,
    genre: 'Sci-Fi',
    rating: 8.8,
    posterUrl: `${posterBaseUrl}/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg`,
  },
  {
    id: 'pulp-fiction',
    title: 'Pulp Fiction',
    year: 1994,
    genre: 'Crime',
    rating: 8.9,
    posterUrl: `${posterBaseUrl}/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg`,
  },
  {
    id: 'interstellar',
    title: 'Interstellar',
    year: 2014,
    genre: 'Sci-Fi',
    rating: 8.7,
    posterUrl: `${posterBaseUrl}/yQvGrMoipbRoddT0ZR8tPoR7NfX.jpg`,
  },
  {
    id: 'spirited-away',
    title: 'Spirited Away',
    year: 2001,
    genre: 'Animation',
    rating: 8.6,
    posterUrl: `${posterBaseUrl}/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg`,
  },
];
