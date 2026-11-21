# Checkpoint 1 — Reel Good

[Public checkpoint preview](https://flyrank-frontend-capstone-28gj4vsrm-niknaxthegreek.vercel.app/pick-a-movie). Signed-out access and a live Inception lookup were verified on 21 November 2026.

Repository branch: https://github.com/NiknaxTheGreek/flyrank-frontend-capstone/tree/fe08-resilience-checkpoint

Reel Good supports streaming movie recommendations and a typed OMDb lookup card. I implemented loading skeletons, slow-response guidance, error boundaries, designed tool errors, empty-state onboarding and retry for failed messages. Retry preserves earlier turns, replaces the failed assistant attempt and guards against duplicate clicks.

I manually tested the happy path, offline-before-send failure and recovery, interrupted output and retry, blank input, example prompts, valid lookup, missing titles and Android keyboard/scroll behavior. Screenshots show a completed happy-path request with an empty Console and at least two handled failure states. Automated sabotage also verifies HTTP 429 recovery, malformed tool output recovery, truncated streams, slow requests and route-boundary recovery. All 53 tests and the TypeScript/production build pass.

Testing exposed an OMDb environment mismatch between A7 and A8; I corrected the Preview configuration and verified both Arrival and a nonexistent title afterward.

Limitations: Safari/mobile Safari was not tested because no Apple device was available. 429 and malformed-output sabotage were tested automatically rather than injected into the live deployment.

[Review the nine checkpoint screenshots](EVIDENCE.md).

All nine screenshots are committed to this branch, with cropped review copies and the original files linked in the inventory. Download the relevant images if the Portal requires separate attachments.

**Status: complete and packaged — awaiting Portal submission.**
