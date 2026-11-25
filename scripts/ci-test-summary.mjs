import { appendFileSync, readFileSync } from 'node:fs';

try {
  const report = JSON.parse(readFileSync('test-results/vitest-results.json', 'utf8'));
  const summary = `## Vitest + React Testing Library\n\n${report.numPassedTests}/${report.numTotalTests} tests passed; ${report.numFailedTests} failed.\n\nAI and movie API requests are mocked.\n`;
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
  else process.stdout.write(summary);
} catch {
  process.stderr.write('The test report was not produced. Inspect the preceding failing step.\n');
}
