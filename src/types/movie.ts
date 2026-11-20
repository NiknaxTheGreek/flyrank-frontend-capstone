export type Movie = {
  id: string;
  title: string;
  year: number | string;
  genre: string;
  rating: number | null;
  imdbId?: string;
  plot?: string;
  director?: string;
  runtime?: string;
  posterUrl: string;
};

