import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Browse Movies',
};

export default function MoviesPage() {
  return (
    <section aria-labelledby="movies-heading" className="space-y-6">
      <h1 id="movies-heading" className="text-3xl font-bold">
        Browse movies
      </h1>
      <p className="max-w-2xl text-muted">
        Explore the catalogue by title and genre.
      </p>

      <div className="rounded-xl border border-slate-700 bg-surface p-6">
        <h2 className="text-xl font-semibold">Movie catalogue</h2>
        <p className="mt-2 text-muted">
          Assignment 4 placeholder: movie cards, filters, and pagination
          will appear here when the catalogue is connected.
        </p>
      </div>

      <Link href="/" className="inline-block text-accent hover:underline">
        Back to discovery
      </Link>
    </section>
  );
}
