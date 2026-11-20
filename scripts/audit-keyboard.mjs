// Production-build keyboard audit. Only the AI HTTP boundary is replaced with
// deterministic streamed fixtures; no model or account API is called.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { chromium } from 'playwright';

const base=process.env.AUDIT_URL || 'http://127.0.0.1:4188';
const dist=path.resolve(process.env.AUDIT_DIST || 'dist');
const output=path.resolve(process.env.AUDIT_OUTPUT || 'docs/assignment-12/evidence/keyboard');
await fs.mkdir(output,{recursive:true});
const checks=[];
let failed=false;
const frame=event=>`data: ${JSON.stringify(event)}\n\n`;
const server=http.createServer(async (request,response)=>{
  if (request.method === 'GET') {
    const url = new URL(request.url, base);
    const file = url.pathname.startsWith('/assets/') ? path.resolve(dist, '.' + url.pathname) : path.join(dist, 'index.html');
    if (!file.startsWith(dist + path.sep)) { response.writeHead(403); response.end(); return; }
    try {
      const bytes = await fs.readFile(file);
      response.setHeader('Content-Type', file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html');
      response.end(bytes);
    } catch { response.writeHead(404); response.end(); }
    return;
  }
  response.setHeader('Access-Control-Allow-Origin','*');
  response.setHeader('Access-Control-Allow-Headers','content-type');
  if(request.method==='OPTIONS'){response.end();return;}
  let body='';request.on('data',chunk=>body+=chunk);
  request.on('end',()=>{
    const prompt=JSON.parse(body).messages.at(-1).content;
    response.writeHead(200,{'Content-Type':'text/event-stream'});
    if(prompt.includes('keyboard stop')){
      response.write(frame({type:'text',delta:'Try Arrival. '}));
      const more=setTimeout(()=>response.write(frame({type:'text',delta:'It is thoughtful science fiction.'})),400);
      const finish=setTimeout(()=>response.end(frame({type:'done'})),7000);
      response.on('close',()=>{clearTimeout(more);clearTimeout(finish);});
    }else if(prompt.includes('failure') && !failed){
      failed=true;
      response.end(frame({type:'text',delta:'A partial recommendation.'})+frame({type:'error',message:'Keyboard audit: connection interrupted.'}));
    }else{
      const common={type:'tool',toolName:'lookupMovie',toolCallId:'keyboard-lookup'};
      response.end([
        {...common,state:'input-streaming'},
        {...common,state:'input-available',input:{title:'Inception'}},
        {...common,state:'output-available',input:{title:'Inception'},output:{title:'Inception',year:'2010',genre:'Sci-Fi',runtime:'148 min',rating:8.8,imdbId:'tt1375666',plot:'A team enters dreams to plant an idea.'}},
        {type:'text',delta:'Inception is a dream-heist thriller.'},{type:'done'},
      ].map(frame).join(''));
    }
  });
});
await new Promise(resolve=>server.listen(4188,'127.0.0.1',resolve));
const browser=await chromium.launch({headless:true,executablePath:process.env.AUDIT_CHROME_PATH,args:['--no-sandbox']});
const context=await browser.newContext({viewport:{width:1280,height:900}});
const page=await context.newPage();
const errors=[];page.on('pageerror',error=>errors.push(error.message));
page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
const focused=locator=>locator.evaluate(el=>el===document.activeElement);
async function tabTo(locator){
  for(let i=0;i<45;i++){
    if(await focused(locator)) return;
    await page.keyboard.press('Tab');
  }
  throw Error('Keyboard could not reach '+await locator.innerText());
}
async function typePrompt(text){
  const input=page.getByRole('textbox',{name:'Your movie preferences'});
  await tabTo(input);await page.keyboard.press('ControlOrMeta+A');await page.keyboard.type(text);
  await tabTo(page.getByRole('button',{name:'Send',exact:true}));await page.keyboard.press('Enter');
}
try{
  await page.goto(new URL('/pick-a-movie',base).href,{waitUntil:'networkidle'});
  await page.getByRole('heading',{name:'Help me pick a movie'}).waitFor();
  await page.keyboard.press('Tab');
  assert(await focused(page.getByRole('link',{name:'Skip to main content'})));
  await page.screenshot({path:path.join(output,'skip-link.jpg'),type:'jpeg',quality:80});
  await page.keyboard.press('Enter');
  assert(await focused(page.locator('main')));
  checks.push('First Tab exposes the skip link; Enter focuses main content.');
  await tabTo(page.getByRole('button',{name:'Try an example'}));await page.keyboard.press('Enter');
  assert(await focused(page.getByRole('textbox',{name:'Your movie preferences'})));
  checks.push('Example is keyboard reachable and moves focus to the labelled textarea.');
  await typePrompt('keyboard stop');
  await page.getByRole('region',{name:'Movie conversation'}).getByText('Try Arrival.',{exact:false}).waitFor({timeout:7000});
  await page.waitForFunction(()=>document.querySelector('[role="status"][aria-live="polite"]')?.textContent.includes('Try Arrival.'));
  checks.push('A sentence from a genuinely streamed fixture reaches the polite live region before completion.');
  const stop=page.getByRole('button',{name:'Stop generation'});await tabTo(stop);
  assert.notEqual(await stop.evaluate(el=>getComputedStyle(el).outlineStyle),'none');
  await page.screenshot({path:path.join(output,'stop-focused.jpg'),type:'jpeg',quality:80});
  await page.keyboard.press('Space');
  await page.getByText('Stopped · partial response',{exact:true}).waitFor();
  assert(await focused(page.getByRole('textbox',{name:'Your movie preferences'})));
  checks.push('Tab reaches Stop with a visible ring; Space stops mid-stream and returns focus to the textarea.');
  await typePrompt('Find Inception');
  await page.getByRole('heading',{name:'Inception (2010)'}).waitFor();
  await page.getByRole('button',{name:'Send',exact:true}).waitFor();
  checks.push('A subsequent keyboard-only turn renders a typed movie result card.');
  await typePrompt('failure');
  await page.getByRole('alert').filter({hasText:'connection interrupted'}).waitFor();
  await tabTo(page.getByRole('button',{name:'Retry failed message'}));await page.keyboard.press('Enter');
  await page.getByRole('alert').waitFor({state:'detached'});
  checks.push('An interrupted reply is announced, and Retry recovers with Enter.');
  await page.screenshot({path:path.join(output,'recovered-tool.jpg'),type:'jpeg',quality:80});
  for(const width of [375,320]){
    await page.setViewportSize({width,height:812});
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  }
  await page.screenshot({path:path.join(output,'phone-conversation.jpg'),type:'jpeg',quality:80,fullPage:true});
  checks.push('Conversation, result card and controls fit 375 px and 320 px with no horizontal overflow.');
  assert.deepEqual(errors,[]);
  const result={base,at:new Date().toISOString(),browser:await browser.version(),fixtures:'AI route only; no provider requests',checks,errors};
  await fs.writeFile(path.join(output,'checks.json'),JSON.stringify(result,null,2));
  console.log(JSON.stringify(result));
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
