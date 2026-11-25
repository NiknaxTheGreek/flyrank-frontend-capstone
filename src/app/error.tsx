"use client";
export default function ErrorPage({reset}: {error:Error & {digest?:string};reset:()=>void}) {return <section className="space-y-4" role="alert"><h1 className="text-3xl font-bold">Something went wrong</h1><p>Please try loading this screen again.</p><button onClick={reset} className="rounded bg-accent px-6 py-3 font-bold text-background">Retry</button></section>;}
