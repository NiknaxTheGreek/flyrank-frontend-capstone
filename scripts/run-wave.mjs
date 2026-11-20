// Use an unpacked copy of the official WAVE Chrome extension, without modifying
// its evaluation engine. The extension is not redistributed in this repository.
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const extension = process.env.WAVE_EXTENSION;
if (!extension) throw Error('Set WAVE_EXTENSION to the official unpacked Chrome extension directory.');
const base = process.env.AUDIT_URL || 'http://127.0.0.1:4173';
const phase = process.env.AUDIT_PHASE || 'before';
const directory = path.resolve(process.env.AUDIT_OUTPUT || `docs/assignment-12/evidence/${phase}/wave`);
await fs.mkdir(directory, {recursive:true});
const context = await chromium.launchPersistentContext(`/tmp/reel-good-wave-${phase}-${Date.now()}`, {
  executablePath:process.env.AUDIT_CHROME_PATH || chromium.executablePath(),headless:true,viewport:{width:1365,height:1000},
  args:['--no-sandbox',`--disable-extensions-except=${extension}`,`--load-extension=${extension}`],
});
try {
  let worker=context.serviceWorkers()[0];
  if(!worker) worker=await context.waitForEvent('serviceworker');
  const results=[];
  for(const [name,route] of [['chat','/pick-a-movie'],['home','/'],['motion','/motion-lab'],['account','/account']]) {
    const page=await context.newPage();
    await page.goto(new URL(route,base).href,{waitUntil:'networkidle'});
    await page.locator('h1').waitFor();
    await worker.evaluate(async url => {
      const [tab]=await chrome.tabs.query({url});
      // This is the extension's own action handler used by its toolbar button.
      await serviceworker.func.runWave(tab.id,tab.url);
    },page.url());
    await page.waitForFunction(() => !!window.wave?.results?.success);
    const result=await page.evaluate(() => ({version:window.wave.version,...window.wave.results}));
    const report={name,url:page.url(),at:new Date().toISOString(),...result};
    await fs.writeFile(path.join(directory,`${name}.json`),JSON.stringify(report,null,2));
    await page.screenshot({path:path.join(directory,`${name}.jpg`),type:'jpeg',quality:78});
    results.push({name,version:result.version,statistics:result.statistics,categories:Object.fromEntries(Object.entries(result.categories).map(([k,v])=>[k,{count:v.count,items:v.items}]))});
    console.log(JSON.stringify({name,categories:Object.fromEntries(Object.entries(result.categories).map(([k,v])=>[k,v.count]))}));
    await page.close();
  }
  await fs.writeFile(path.join(directory,'summary.json'),JSON.stringify(results,null,2));
} finally {await context.close();}
