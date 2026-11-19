import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';

// This report is built only from the real machine-readable outputs of both suites.
// It is intentionally labelled as a report, rather than imitating GitHub's interface.
const vitest = JSON.parse(await readFile('test-results/vitest-results.json', 'utf8'));
const playwright = JSON.parse(await readFile('test-results/e2e-results.json', 'utf8'));
if (!vitest.success || vitest.numFailedTests || !vitest.numPassedTests ||
    playwright.stats.unexpected || playwright.stats.flaky || playwright.stats.skipped || !playwright.stats.expected) {
  throw new Error('Both complete suites must pass before creating passing CI evidence.');
}

const escape = value => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character]));
const inCI = process.env.GITHUB_ACTIONS === 'true';
const runUrl = inCI
  ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
  : 'Local run; this is not GitHub CI evidence.';
const testGroups = [
  ['Message renderer', 'MovieMessage.test.tsx'],
  ['Chat states, retry and tool lifecycle', 'MovieChat'],
  ['Validated preferences form', 'NotificationSettings.test.tsx'],
  ['Structured movie result card', 'MovieToolCard.test.tsx'],
];
const counts = testGroups.map(([label, match]) => [label, vitest.testResults
  .filter(file => file.name.includes(match))
  .flatMap(file => file.assertionResults).filter(result => result.status === 'passed').length]);
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><title>A10 verified test report</title>
<style>
body{margin:0;background:#101521;color:#eef3ff;font:18px/1.5 system-ui,sans-serif;padding:56px}
main{max-width:1080px;margin:auto}small{letter-spacing:.12em;text-transform:uppercase;color:#a8b8d2}
h1{font-size:44px;line-height:1.15;margin:18px 0}p{color:#bfcbdf}.badge{display:inline-block;color:#9cf0bc;border:1px solid #3c805a;background:#15382b;padding:8px 16px;border-radius:999px}
.cards{display:flex;gap:24px;margin:34px 0}.card{flex:1;border:1px solid #33425b;border-radius:16px;padding:24px;background:#182133}.number{font-size:44px;font-weight:700;color:#9cf0bc}
table{width:100%;border-collapse:collapse;margin:24px 0}th,td{text-align:left;padding:12px 16px;border-bottom:1px solid #33425b}th{color:#a8b8d2}td:last-child{color:#9cf0bc}
.meta{font:14px/1.7 ui-monospace,monospace;overflow-wrap:anywhere;border-top:1px solid #33425b;padding-top:20px}footer{font-size:14px;color:#91a4c1}
</style><main><small>Reel Good · Assignment 10 · ${inCI ? 'GitHub Actions' : 'Local verification'}</small>
<h1>Automated test report</h1><span class="badge">Both suites passed</span>
<div class="cards"><section class="card"><div class="number">${vitest.numPassedTests}/${vitest.numTotalTests}</div>Vitest + React Testing Library</section>
<section class="card"><div class="number">${playwright.stats.expected}/${playwright.stats.expected}</div>Playwright · desktop + 375px phone</section></div>
<table><thead><tr><th>Required UI coverage</th><th>Passing tests</th></tr></thead><tbody>${counts.map(([label, count]) => `<tr><td>${escape(label)}</td><td>${count}</td></tr>`).join('')}</tbody></table>
<p>Thinking and streaming, all four tool states, interrupted replies, retry, form validation, and contextual follow-up are covered. API requests are mocked.</p>
<div class="meta">Source: ${escape(runUrl)}<br>Commit: ${escape(process.env.GITHUB_SHA || 'local working copy')}<br>Generated: ${escape(new Date().toISOString())}</div>
<footer>This screenshot renders actual Vitest JSON and Playwright JSON results. The linked workflow is the authority for overall CI status.</footer></main></html>`;
await mkdir('test-results', { recursive: true });
await writeFile('test-results/ci-suite.html', html);
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(resolve('test-results/ci-suite.html')).href);
  await page.screenshot({ path: 'test-results/ci-suite.png', fullPage: true });
} finally {
  await browser.close();
}
console.log(`Captured ${inCI ? 'GitHub Actions' : 'local'} report: test-results/ci-suite.png`);
