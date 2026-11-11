import { checkHealth } from '../../scaffold/health';
export const dynamic='force-dynamic';
export default async function HealthPage() {
 const result=await checkHealth();
 return <section className="space-y-6"><h1 className="text-3xl font-bold">Service health</h1><p>This checks a real server-side data fetch from JSONPlaceholder. It does not check OMDb, Firebase, or authentication.</p><div className="rounded-xl border border-slate-600 bg-surface p-6" role={result.ok?'status':'alert'}><h2 className="text-2xl font-bold">{result.ok?'Success':'Failure'}</h2><p>{result.message}</p>{result.ok&&<p className="mt-4">Fetched record #{result.id}: {result.title}</p>}</div><a href="/health" className="inline-block text-accent underline">Run health check again</a></section>;
}
