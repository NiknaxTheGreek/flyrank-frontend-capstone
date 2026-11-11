import Link from 'next/link';
import { safeReturn, type SearchParams } from '../../scaffold/catalog';
export default async function AccountPage({searchParams}: {searchParams:Promise<SearchParams>}) {
 const returnTo=safeReturn((await searchParams).returnTo);
 return <section className="max-w-xl space-y-6"><h1 className="text-3xl font-bold">Account / Sign in</h1><p>Authentication placeholder. Sign-in, account creation, validation and sign-out will be connected to Firebase in a later implementation.</p><p className="rounded bg-surface p-4">This preview does not accept credentials or establish a signed-in session.</p><p>Intended destination after authentication: <code className="break-all">{returnTo}</code></p><Link href="/movies" className="text-accent underline">Continue browsing</Link></section>;
}
