import Link from 'next/link';
export default function NotFound() {return <section className="space-y-4"><h1 className="text-3xl font-bold">Movie not found</h1><p>This address is unavailable in the current scaffold.</p><Link href="/movies" className="text-accent underline">Back to movie browsing</Link></section>;}
