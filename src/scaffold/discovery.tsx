import Link from 'next/link';
import { catalog, single, type SearchParams } from './catalog';
export default function Discovery({params, base = '/'}: {params: SearchParams; base?: string}) {
 const q=single(params.q).slice(0,100), genre=single(params.genre);
 const matches=catalog.filter(m=>m.title.toLowerCase().includes(q.trim().toLowerCase()) && (!genre||m.genre===genre));
 const totalPages=Math.max(1,Math.ceil(matches.length/2));
 const page=Math.min(totalPages, Math.max(1,Number.parseInt(single(params.page),10)||1));
 const url=(p:number)=>base+'?'+new URLSearchParams({q,genre,page:String(p)});
 return <section className="space-y-8" aria-labelledby="discover-heading">
 <div><p className="text-accent">Reel Good</p><h1 id="discover-heading" className="text-3xl font-bold sm:text-5xl">{base==='/movies'?'Browse movies':'Discover your next movie'}</h1><p className="mt-4 text-muted">Search a title, browse a genre, and explore the details.</p></div>
 <p className="rounded-xl border border-slate-700 bg-surface p-4">Scaffold preview — three sample titles. Live catalogue and account features are not connected yet.</p>
 <form action={base} className="grid gap-4 sm:grid-cols-[1fr_auto_auto]">
 <div><label htmlFor="q" className="block">Movie title</label><input id="q" name="q" defaultValue={q} maxLength={100} className="w-full rounded border border-slate-500 bg-surface p-3" /></div>
 <div><label htmlFor="genre" className="block">Genre</label><select id="genre" name="genre" defaultValue={genre} className="w-full rounded border border-slate-500 bg-surface p-3"><option value="">All genres</option><option>Sci-Fi</option><option>Drama</option></select></div>
 <button className="self-end rounded bg-accent px-6 py-3 font-bold text-background">Search</button></form>
 {q&&<p>Results for “{q}”</p>}
 {matches.length===0?<div role="status"><h2 className="text-xl font-bold">No movies found</h2><p>Try another title or genre.</p><Link href={base} className="text-accent underline">Clear filters</Link></div>:<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{matches.slice((page-1)*2,page*2).map(m=><article key={m.id} className="min-w-0 rounded-xl border border-slate-700 bg-surface p-5"><div className="mb-4 flex aspect-[3/2] items-center justify-center rounded bg-background text-muted" role="img" aria-label={'Poster unavailable for '+m.title}>Poster unavailable</div><h2 className="text-xl font-bold">{m.title}</h2><p className="text-muted">{m.year} · {m.genre}</p><p className="mt-2">Rating: not loaded</p><p className="my-4">{m.plot}</p><div className="flex flex-wrap gap-4"><Link className="text-accent underline" href={'/movies/'+m.id+'?'+new URLSearchParams({returnTo:url(page)})}>Movie details</Link><a className="text-accent underline" href={'https://www.imdb.com/title/'+m.id+'/'} target="_blank" rel="noopener noreferrer">IMDb (new tab)</a></div></article>)}</div>}
 <nav aria-label="Movie pagination" className="flex flex-wrap gap-6">{page>1&&<Link href={url(page-1)} className="text-accent underline">Previous</Link>}<span>Page {page} of {totalPages}</span>{page<totalPages&&<Link href={url(page+1)} className="text-accent underline">Next</Link>}</nav>
 </section>;
}
