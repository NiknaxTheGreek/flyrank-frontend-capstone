import Discovery from '../scaffold/discovery';
import type { SearchParams } from '../scaffold/catalog';
export default async function Page({searchParams}: {searchParams: Promise<SearchParams>}) {
 return <Discovery params={await searchParams} base="/" />;
}
