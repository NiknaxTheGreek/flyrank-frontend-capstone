# Assignment 14 — Production release / Checkpoint 2

Production address: https://flyrank-frontend-capstone-snowy.vercel.app  
Release branch: `fe14-production-release`, based on the tested A10 Reel Good app. Standalone A11/A13 demos remain on their own branches.

## Safeguards

- 10 chat requests/minute/client IP and 1,000/hour/warm instance, bounded memory, HTTP 429 + Retry-After.
- Same-origin browser requests; POST only; 192 KB body, 20 messages, 8,000 characters/message, 32,000 total characters.
- 700 output tokens, one read-only validated movie tool, 40-second upstream deadline, 60-second Vercel maxDuration.
- Cancellation on disconnect/Stop; sanitized errors; provider secrets remain server-side.
- Rate counters are per-instance and reset on cold starts. Provider quotas or shared storage/firewall rules are required for an account-wide budget.

## Checks performed

- Clean `npm ci` succeeded on Node 24.22.3.
- Application and test TypeScript checks passed.
- 89 Vitest tests passed across 17 files, including rate limit, origin rejection and oversized-input checks.
- Production bundle built successfully. The main JS bundle is approximately 650 KB uncompressed; Vite's size warning is a known performance follow-up.
- Local Playwright launch was blocked by the workspace's socket restrictions; no local browser pass is claimed. A release workflow runs the same mocked journey in Chromium, Firefox, desktop WebKit and iPhone-sized WebKit on GitHub Actions.
- Production OMDb and Firebase environment targets were configured; existing production Gemini credential retained. Values were not committed.

## Pending release results

CI results, screenshots, deployment ID/commit and live smoke results will be added after the release build completes. Real Safari and mobile Safari are not equivalent to Linux Playwright WebKit and remain manual device checks. Live Firebase sign-in/favorite persistence also needs a test account and authorized-domain verification; configuration presence alone does not prove it works.

## Reviewer walkthrough

Open Movie picker, request recommendations, stop a reply, send a follow-up, request Inception's facts and inspect the movie card. Search a movie and open details. Sign in with a test account to save/remove a favorite. Repeated chat requests should eventually return a designed retryable 429. Tests use mocks and do not spend provider credits.

## History and AI assistance

Focused Conventional Commits preserve earlier assignment work; no shared history was rewritten. The root README records actual ChatGPT contributions, runtime provider, architecture, environment variables, local run commands and known limitations. This status file does not claim portal submission.
