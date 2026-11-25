// CI captures original browser reports/screenshots, then emits a compact archive
// through logs. This works without consuming GitHub Actions artifact storage.
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const root=process.cwd();
const evidence=path.join(root,'docs/assignment-12/evidence');
await fs.rm(evidence,{recursive:true,force:true});
await fs.mkdir(evidence,{recursive:true});
async function run(command,args,{cwd=root,env={}}={}){
  await new Promise((resolve,reject)=>{
    const child=spawn(command,args,{cwd,env:{...process.env,...env},stdio:'inherit'});
    child.on('error',reject);child.on('exit',code=>code===0?resolve():reject(Error(command+' exited '+code)));
  });
}
async function serve(cwd){
  const child=spawn('npm',['run','preview','--','--host','127.0.0.1','--port','4173','--strictPort'],{cwd,stdio:'inherit'});
  for(let i=0;i<60;i++){
    try{if((await fetch('http://127.0.0.1:4173')).ok)return child;}catch{}
    await new Promise(resolve=>setTimeout(resolve,300));
  }
  child.kill();throw Error('Production preview did not start.');
}
async function stop(child){
  // Terminate npm's process group, including its Vite child.
  execFileSync('pkill',['-f','node .*node_modules/.bin/vite preview'],{stdio:'ignore'});
  child.kill();
  await new Promise(resolve=>setTimeout(resolve,500));
}
async function lighthouse(phase,base){
  await run('node',['scripts/run-lighthouse.mjs'],{env:{AUDIT_URL:base,AUDIT_PHASE:phase,AUDIT_OUTPUT:path.join(evidence,phase)}});
}
async function wave(phase,base){
  await run('node',['scripts/run-wave.mjs'],{env:{AUDIT_URL:base,AUDIT_PHASE:phase,AUDIT_OUTPUT:path.join(evidence,phase,'wave')}});
}

const before='/tmp/reel-good-a12-baseline';
await run('git',['worktree','add','--detach',before,'d03e1ec9d7f755e474ef5e084a3da10765666728']);
await run('npm',['ci'],{cwd:before});
await run('npm',['run','build'],{cwd:before});
let server=await serve(before);
try{await lighthouse('local-before','http://127.0.0.1:4173');await wave('local-before','http://127.0.0.1:4173');}finally{await stop(server);}
await run('npm',['run','build']);
server=await serve(root);
try{await lighthouse('local-after','http://127.0.0.1:4173');await wave('local-after','http://127.0.0.1:4173');}finally{await stop(server);}
await run('node',['scripts/audit-keyboard.mjs']);
// This is a read-only audit of the currently public production baseline.
try {
  await lighthouse('live-before','https://flyrank-frontend-capstone-snowy.vercel.app');
} catch (error) {
  await fs.writeFile(path.join(evidence,'live-before-unavailable.json'),JSON.stringify({error:error.message}));
  console.log('Live baseline could not be captured: '+error.message);
}
await fs.writeFile(path.join(evidence,'provenance.json'),JSON.stringify({
  workflow:`https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`,
  sourceCommit:process.env.GITHUB_SHA,baselineCommit:'d03e1ec9d7f755e474ef5e084a3da10765666728',
  liveAfter:'PENDING: deployment access or production promotion requires user approval.',
  note:'Local builds have no OMDb/Firebase credentials. Their home page is the handled unconfigured state. These scores do not prove deployed performance.',
},null,2));

const exportRoot=path.join(root,'test-results/a12-export');
await fs.mkdir(path.join(exportRoot,'docs/assignment-12/evidence'),{recursive:true});
for(const file of await fs.readdir(evidence,{recursive:true})){
  const original=path.join(evidence,file);if(!(await fs.stat(original)).isFile())continue;
  if(!/\.(json|jpg)$/.test(file))continue;
  // Keep the requested Lighthouse screenshots, keyboard screenshots, and the
  // Motion lab WAVE comparison. Machine-readable WAVE data covers every page.
  if(file.includes('/wave/') && file.endsWith('.jpg') && !file.endsWith('/motion.jpg'))continue;
  const destination=path.join(exportRoot,'docs/assignment-12/evidence',file);
  await fs.mkdir(path.dirname(destination),{recursive:true});
  if(file.endsWith('-mobile.json')){
    const lhr=JSON.parse(await fs.readFile(original,'utf8'));
    const data={lighthouseVersion:lhr.lighthouseVersion,fetchTime:lhr.fetchTime,requestedUrl:lhr.requestedUrl,finalDisplayedUrl:lhr.finalDisplayedUrl,
      environment:lhr.environment,configSettings:lhr.configSettings,categories:lhr.categories,
      audits:Object.fromEntries(Object.entries(lhr.audits).filter(([key])=>!['screenshot-thumbnails','final-screenshot'].includes(key))),
      artifactNote:'Embedded screenshot images omitted; numeric audits are unchanged. The accompanying JPG is an actual screenshot of the original Lighthouse HTML report.'};
    await fs.writeFile(destination,JSON.stringify(data,(key,value)=>typeof value==='string'&&value.startsWith('data:image/')?'[image bytes omitted]':value,2));
  }else await fs.copyFile(original,destination);
}
const archive=execFileSync('tar',['-czf','-','-C',exportRoot,'docs'],{maxBuffer:32*1024*1024});
const encoded=archive.toString('base64');
console.log('A12_EVIDENCE_BEGIN '+JSON.stringify({bytes:archive.length,sha256:createHash('sha256').update(archive).digest('hex')}));
for(let i=0;i<encoded.length;i+=12000)console.log('A12_EVIDENCE_CHUNK '+i/12000+' '+encoded.slice(i,i+12000));
console.log('A12_EVIDENCE_END');
