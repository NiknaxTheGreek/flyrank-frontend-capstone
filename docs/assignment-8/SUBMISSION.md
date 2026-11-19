# Checkpoint 1 — Reel Good

Preview: use the seven-day share link supplied in the A8 conversation. Bare deployment URL: https://flyrank-frontend-capstone-1o85s91sn-niknaxthegreek.vercel.app/pick-a-movie (Vercel authentication required without the share link).

Repository branch: https://github.com/NiknaxTheGreek/flyrank-frontend-capstone/tree/fe08-resilience-checkpoint

Reel Good supports streaming movie recommendations and a typed OMDb lookup card. I implemented loading skeletons, slow-response guidance, error boundaries, designed tool errors, empty-state onboarding and retry for failed messages. Retry preserves earlier turns, replaces the failed assistant attempt and guards against duplicate clicks.

I manually tested the happy path, offline-before-send failure and recovery, interrupted output and retry, blank input, example prompts, valid lookup, missing titles and Android keyboard/scroll behavior. Screenshots show a completed happy-path request with an empty Console and at least two handled failure states. Automated sabotage also verifies HTTP 429 recovery, malformed tool output recovery, truncated streams, slow requests and route-boundary recovery. All 53 tests and the TypeScript/production build pass.

Testing exposed an OMDb environment mismatch between A7 and A8; I corrected the Preview configuration and verified both Arrival and a nonexistent title afterward.

Limitations: Safari/mobile Safari was not tested because no Apple device was available. 429 and malformed-output sabotage were tested automatically rather than injected into the live deployment. The reviewer share link expires after seven days and must be renewed if needed.

Suggested attachments: image(20261119-181933).png, image(20261119-155900).png, image(20261119-160035).png, image(20261119-160734).png, image(20261119-161330).png, image(20261119-183216).png, image(20261119-183241).png, 1000160253.jpg.
