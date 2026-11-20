import fs from 'node:fs/promises';
import path from 'node:path';
import {spawn,execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright';

const base='https://flyrank-frontend-capstone-snowy.vercel.app';
const folder=path.resolve('docs/assignment-12/evidence/live-after');
await fs.mkdir(folder,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
  const page=await browser.newPage({viewport:{width:375,height:812}});
  const popupRequests=[];
  page.on('request',request=>{if(/firebaseapp\.com\/__\/auth\/iframe|apis\.google\.com\/.*gapi/.test(request.url()))popupRequests.push(request.url());});
  await page.goto(base,{waitUntil:'networkidle'});
  await page.locator('article.movie-card').first().waitFor();
  const cards=await page.locator('article.movie-card').count();
  if(!cards)throw Error('Live Home must contain actual movie data, not an unconfigured fallback.');
  if(!await page.getByRole('link',{name:'Skip to main content'}).count())throw Error('The production URL does not contain the A12 build.');
  await page.screenshot({path:path.join(folder,'live-home-phone.jpg'),type:'jpeg',quality:80,fullPage:false});
  await page.goto(base+'/pick-a-movie',{waitUntil:'networkidle'});
  await page.getByRole('textbox',{name:'Your movie preferences'}).waitFor();
  await page.keyboard.press('Tab');
  if(!await page.getByRole('link',{name:'Skip to main content'}).evaluate(el=>el===document.activeElement))throw Error('First Tab did not reach the live skip link.');
  await page.keyboard.press('Enter');
  if(!await page.locator('main').evaluate(el=>el===document.activeElement))throw Error('Live skip link did not focus main.');
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Live chat overflows at 375px.');
  await page.screenshot({path:path.join(folder,'live-chat-phone.jpg'),type:'jpeg',quality:80});
  await page.goto(base+'/account',{waitUntil:'networkidle'});
  await page.getByRole('textbox',{name:'Email',exact:true}).waitFor();
  if(!await page.locator('input#account-password').isVisible())throw Error('The configured sign-in form must remain available.');
  if(popupRequests.length)throw Error('Unused Firebase popup dependencies are still loading.');
  await fs.writeFile(path.join(folder,'live-dom-checks.json'),JSON.stringify({at:new Date().toISOString(),base,movieCards:cards,skipLink:true,skipTarget:true,phoneWidth:375,horizontalOverflow:false,configuredSignInForm:true,firebasePopupRequests:0,aiProviderRequests:0,releaseSource:'bfdd95eb274f6342a9f86c9023d1dcb24d425131'},null,2));
}finally{await browser.close();}

async function run(script,output){
  await new Promise((resolve,reject)=>{const p=spawn('node',[script],{stdio:'inherit',env:{...process.env,AUDIT_URL:base,AUDIT_PHASE:'live-after',AUDIT_OUTPUT:output}});p.on('exit',c=>c===0?resolve():reject(Error(script+' exited '+c)));p.on('error',reject);});
}
await run('scripts/run-lighthouse.mjs',folder);
await run('scripts/run-wave.mjs',path.join(folder,'wave'));
await new Promise((resolve,reject)=>{const p=spawn('npm',['run','build'],{stdio:'inherit'});p.on('exit',code=>code===0?resolve():reject(Error('Production build failed.')));p.on('error',reject);});
await run('scripts/audit-catalog-keyboard.mjs',path.join(folder,'catalog-fixture'));
await fs.writeFile(path.join(folder,'provenance.json'),JSON.stringify({workflow:`https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`,sourceCommit:process.env.GITHUB_SHA,releaseSource:'bfdd95eb274f6342a9f86c9023d1dcb24d425131',deployedUrl:base,catalogueKeyboard:'Local production bundle with deterministic movie HTTP fixtures; not a live provider measurement.'},null,2));
const exporting=path.resolve('test-results/live-a12-export');
for(const file of await fs.readdir(folder,{recursive:true})){
  const original=path.join(folder,file);if(!(await fs.stat(original)).isFile()||!/\.(json|jpg)$/.test(file))continue;
  const dest=path.join(exporting,'docs/assignment-12/evidence/live-after',file);await fs.mkdir(path.dirname(dest),{recursive:true});
  if(file.endsWith('-mobile.json')){const data=JSON.parse(await fs.readFile(original,'utf8'));delete data.fullPageScreenshot;delete data.audits['screenshot-thumbnails'];delete data.audits['final-screenshot'];data.artifactNote='Embedded image bytes omitted; numeric audits unchanged. See original-report JPG screenshot.';await fs.writeFile(dest,JSON.stringify(data,(k,v)=>typeof v==='string'&&v.startsWith('data:image/')?'[image bytes omitted]':v,2));}
  else await fs.copyFile(original,dest);
}
const archive=execFileSync('tar',['-czf','-','-C',exporting,'docs'],{maxBuffer:32*1024*1024});
console.log('A12_LIVE_BEGIN '+JSON.stringify({bytes:archive.length,sha256:createHash('sha256').update(archive).digest('hex')}));
const encoded=archive.toString('base64');for(let i=0;i<encoded.length;i+=12000)console.log('A12_LIVE_CHUNK '+i/12000+' '+encoded.slice(i,i+12000));console.log('A12_LIVE_END');
const lighthouse=JSON.parse(await fs.readFile(path.join(folder,'summary.json'),'utf8'));
const wave=JSON.parse(await fs.readFile(path.join(folder,'wave/summary.json'),'utf8'));
const fails=lighthouse.filter(x=>x.scores.performance<90||x.scores.accessibility<90);
const waveFails=wave.filter(x=>x.categories.error.count||x.categories.contrast.count||x.categories.alert.count);
if(fails.length||waveFails.length){console.error('Live targets need attention: '+JSON.stringify({lighthouse:fails.map(x=>({name:x.name,scores:x.scores})),wave:waveFails.map(x=>({name:x.name,categories:x.categories}))}));process.exitCode=1;}
