import { describe, it, expect, vi } from 'vitest';
import { checkHealth } from './health';
import { safeReturn } from './catalog';
describe('health fetch',()=>{
 it('renders success only for valid fetched data',async()=>{const f=vi.fn().mockResolvedValue({ok:true,json:async()=>({id:1,title:'Fetched title'})});expect(await checkHealth(f)).toMatchObject({ok:true,title:'Fetched title'});expect(f.mock.calls[0][1].cache).toBe('no-store');});
 it('handles HTTP failure',async()=>expect(await checkHealth(vi.fn().mockResolvedValue({ok:false,status:503}))).toMatchObject({ok:false}));
 it('handles network failure',async()=>expect(await checkHealth(vi.fn().mockRejectedValue(new Error('offline')))).toMatchObject({ok:false}));
 it('rejects unexpected data',async()=>expect(await checkHealth(vi.fn().mockResolvedValue({ok:true,json:async()=>({})}))).toMatchObject({ok:false}));
 it('handles malformed JSON',async()=>expect(await checkHealth(vi.fn().mockResolvedValue({ok:true,json:async()=>{throw new Error('JSON')}}))).toMatchObject({ok:false}));
});
describe('return destination',()=>{
 it('keeps browsing state',()=>expect(safeReturn('/movies?q=Inception&page=2')).toBe('/movies?q=Inception&page=2'));
 it.each(['https://evil.test','//evil.test','/\\evil.test','/account','javascript:alert(1)'])('rejects unsafe destination %s',p=>expect(safeReturn(p)).toBe('/favorites'));
});
