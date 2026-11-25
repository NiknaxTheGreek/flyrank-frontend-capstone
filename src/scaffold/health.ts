export async function checkHealth(fetcher: typeof fetch = fetch) {
 try {
  const response=await fetcher('https://jsonplaceholder.typicode.com/todos/1', {cache:'no-store',signal:AbortSignal.timeout(5000),redirect:'error'});
  if(!response.ok) return {ok:false as const,message:`Data request failed (HTTP ${response.status}).`};
  const data=await response.json();
  if(data?.id!==1||typeof data.title!=='string'||!data.title.trim()) return {ok:false as const,message:'The data service returned an unexpected response.'};
  return {ok:true as const,message:'Data fetched successfully.',title:data.title.slice(0,200),id:data.id};
 } catch {return {ok:false as const,message:'The data service could not be reached within the request timeout. Please retry.'};}
}
