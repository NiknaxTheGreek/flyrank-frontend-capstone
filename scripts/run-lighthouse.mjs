// Run against a production preview, never the Vite development server.
// Set AUDIT_URL to the deployed URL; an optional AUDIT_SHARE_URL bootstraps
// existing reviewer access. Credentials are never written to reports.
import fs from 'node:fs/promises';
import path from 'node:path';
import lighthouse from 'lighthouse';
import { chromium } from 'playwright';

const base = process.env.AUDIT_URL || 'http://127.0.0.1:4173';
const phase = process.env.AUDIT_PHASE || 'before';
const directory = path.resolve(process.env.AUDIT_OUTPUT || `docs/assignment-12/evidence/${phase}`);
await fs.mkdir(directory, {recursive:true});
const browser = await chromium.launch({headless:true,executablePath:process.env.AUDIT_CHROME_PATH,args:['--no-sandbox','--remote-debugging-port=9222']});
try {
  const context = await browser.newContext();
  const page = await context.newPage();
  if(process.env.AUDIT_SHARE_URL) await page.goto(process.env.AUDIT_SHARE_URL, {waitUntil:'networkidle'});
  const summary=[];
  for(const [name, route] of [['chat','/pick-a-movie'],['home','/']]) {
    // Keep authentication cookies, but run each navigation with an empty HTTP cache.
    const cdp=await context.newCDPSession(page);
    await cdp.send('Network.clearBrowserCache');
    await cdp.detach();
    const result=await lighthouse(new URL(route,base).href, {
      port:9222,logLevel:'error',output:'html',disableStorageReset:!!process.env.AUDIT_SHARE_URL,
      onlyCategories:['performance','accessibility','best-practices','seo'],
    });
    if(!result || result.lhr.runtimeError) throw Error(JSON.stringify(result?.lhr.runtimeError));
    const {lhr}=result;
    if (new URL(lhr.finalDisplayedUrl).origin !== new URL(base).origin) {
      throw Error('Audit reached another origin instead of the application; authenticate the preview first.');
    }
    await fs.writeFile(path.join(directory,`${name}-mobile.html`),result.report);
    await fs.writeFile(path.join(directory,`${name}-mobile.json`),JSON.stringify(lhr,null,2));
    const item={name,url:lhr.finalDisplayedUrl,lighthouse:lhr.lighthouseVersion,
      fetchedAt:lhr.fetchTime,formFactor:lhr.configSettings.formFactor,
      scores:Object.fromEntries(Object.entries(lhr.categories).map(([k,v])=>[k,Math.round(v.score*100)])),
      metrics:Object.fromEntries(['first-contentful-paint','largest-contentful-paint','total-blocking-time','cumulative-layout-shift','speed-index','total-byte-weight'].map(k=>[k,{value:lhr.audits[k].numericValue,display:lhr.audits[k].displayValue}])),
      failedAudits:Object.values(lhr.audits).filter(a=>a.score!==null && a.score<1).map(a=>({id:a.id,title:a.title,score:a.score,display:a.displayValue,items:a.details?.items})),
    };
    summary.push(item);
    // Screenshot the actual Lighthouse report, without redrawing its scores.
    const report=await context.newPage();
    await report.setViewportSize({width:1280,height:1050});
    await report.goto(`file://${path.join(directory,`${name}-mobile.html`)}`);
    await report.screenshot({path:path.join(directory,`${name}-mobile.jpg`),type:'jpeg',quality:78});
    await report.close();
    console.log(JSON.stringify({name,scores:item.scores,metrics:item.metrics}));
  }
  await fs.writeFile(path.join(directory,'summary.json'),JSON.stringify(summary,null,2));
} finally {await browser.close();}
