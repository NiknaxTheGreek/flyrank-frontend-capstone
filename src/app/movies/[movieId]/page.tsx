import Link from 'next/link';
import { notFound } from 'next/navigation';
import { catalog, safeReturn, type SearchParams } from '../../../scaffold/catalog';
export default async function MoviePage({params,searchParams}: {params:Promise<{movieId:string}>;searchParams:Promise<SearchParams>}) {
 const {movieId}=await params;
 const movie=catalog.find(m=>m.id===movieId);
 if(!/^tt\d{7,10}$/.test(movieId)||!movie) notFound();
 const returnTo=safeReturn((await searchParams).returnTo);
 return <section className="space-y-6"><Link href={returnTo} className="text-accent underline">Back to browsing</Link><h1 className="text-3xl font-bold">{movie.title}</h1><div className="grid gap-6 sm:grid-cols-[1fr_2fr]"><div className="flex aspect-[2/3] items-center justify-center rounded-xl bg-surface" role="img" aria-label={'Poster unavailable for '+movie.title}>Poster unavailable</div><div className="space-y-4"><p>{movie.year} · {movie.genre}</p><p>IMDb rating: not loaded</p><p>{movie.plot}</p><p>Full plot, director, and runtime will appear when live details are connected.</p><a href={'https://www.imdb.com/title/'+movie.id+'/'} className="block text-accent underline" target="_blank" rel="noopener noreferrer">View on IMDb (new tab)</a><button disabled className="rounded border border-slate-500 p-3" aria-describedby="favorite-note">Add to favorites</button><p id="favorite-note" className="text-muted">Favorites are not connected in this scaffold. No changes are saved.</p></div></div></section>;
}
