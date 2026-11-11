import { chromium } from 'playwright';
const browser=await chromium.launch({args:['--no-sandbox']});
const base=process.env.PREVIEW_URL || 'http://127.0.0.1:3000';
const rows=[];
for(const width of [375,1280]){
 const page=await browser.newPage({viewport:{width,height:900}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const path of ['/','/movies','/?q=Inception','/?q=nomatch','/?page=2','/movies/tt1375666','/movies/invalid','/account?returnTo=%2Ffavorites','/favorites','/missing','/health']) {
  const res=await page.goto(base+path);await page.waitForLoadState('networkidle');
  const heading=await page.locator('h1').innerText();
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  if(overflow)throw Error('Overflow '+width+' '+path);
  if(!res||res.status()>=500)throw Error('Server error '+path);
  rows.push({width,path,status:res.status(),heading});
 }
 await page.goto(base+'/');await page.getByLabel('Movie title').fill('Inception');await page.getByRole('button',{name:'Search',exact:true}).click();await page.waitForURL('**/?q=Inception*');
 if(await page.locator('article').count()!==1)throw Error('Search failed');
 await page.getByRole('link',{name:'Movie details',exact:true}).click();await page.getByRole('link',{name:'Back to browsing'}).click();
 if(await page.getByLabel('Movie title').inputValue()!=='Inception')throw Error('Return failed');
 await page.goto(base+'/');
 if(errors.length)throw Error(errors.join('\n'));
 await page.close();
}
console.log(JSON.stringify(rows,null,2));await browser.close();
