import Link from 'next/link';

export default function HomePage() {
  return (
    <section aria-labelledby="discover-heading" className="space-y-8">
      <div className="space-y-3">
        <p className="font-semibold text-accent">Reel Good</p>
        <h1 id="discover-heading" className="text-3xl font-bold sm:text-5xl">
          Discover your next movie
        </h1>
        <p className="max-w-2xl text-muted">
          Explore movies, find something new, and save your favorites.
        </p>
      </div>

      <div className="rounded-xl border border-slate-700 bg-surface p-6">
        <h2 className="text-xl font-semibold">Movie discovery</h2>
        <p className="mt-2 text-muted">
          Search, genre filters, and featured movies are coming to this
          Next.js screen. This is the Assignment 4 scaffold.
        </p>
        <Link
          href="/movies"
          className="mt-4 inline-block font-semibold text-accent hover:underline"
        >
          Browse movies
        </Link>
      </div>
    </section>
  );
}
