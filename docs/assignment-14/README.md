# Release verification

**Production:** https://flyrank-frontend-capstone-snowy.vercel.app

## Verification results

| Check | Result |
| --- | --- |
| TypeScript and production build | Passed |
| Component/server tests | 100/100 |
| Browser journeys | 24 passed; six intentional GPU-specific skips outside Chromium |
| Live movie lookup | Chromium, Firefox, desktop WebKit and mobile WebKit passed |
| Firebase authorization | Owner write/read passed; anonymous and other-user reads rejected |
| Public routes and health API | HTTP 200 in the combined release smoke test |
| Manual production review | Completed on 28 November 2026; no page errors reported |

Release verified on 20 November. Regression and live browser checks passed again on 25 November.

[Combined release CI](https://github.com/NiknaxTheGreek/flyrank-frontend-capstone/actions/runs/44790607562) · [Latest recorded regression CI](https://github.com/NiknaxTheGreek/flyrank-frontend-capstone/actions/runs/45669501719) · [Live browser workflow](https://github.com/NiknaxTheGreek/flyrank-frontend-capstone/actions/runs/45669501603)

## Evidence

| Evidence | Record |
| --- | --- |
| Integrated production interface | [Mobile screenshot](evidence/production-integrated-mobile-2026-11-20.jpeg) |
| Live movie lookup and full production address | [Desktop screenshot before lab integration](evidence/production-inception-live-chrome-2026-11-20.jpg) |
| Save a movie | [Signed-in confirmation](evidence/production-joker-favorite-saved-mobile-2026-11-20.jpeg) |
| View saved movies | [Favorites list](evidence/production-favorites-joker-mobile-2026-11-20.jpeg) |
| Combined regression results | [CI screenshot](evidence/integrated-ci-suite.png) |
| Combined browser journey | [Mocked CI screenshot](evidence/integrated-movie-picker-fixture.png) |
| Production API and route checks | [Smoke results](evidence/integrated-production-smoke.json) |
| Cross-browser live lookup | [Browser results](evidence/live-browsers.json) |
| Firebase access controls | [Authorization results](evidence/firebase-smoke.json) |

## Scope and limitations

- Real Safari and iPhone Safari were unavailable. Desktop and mobile WebKit tests passed.
- GPU-specific checks ran in Chromium; other engines tested static fallbacks.
- Favorites persistence and isolation passed. A separate sign-out/sign-in cycle was not recorded.
- HTTP 429 and `Retry-After` passed unit tests, but were not reproduced live. Rate limits are per instance.
- Lighthouse and WAVE results refer to the [audited deployment](../../AUDIT.md).


## Review

Explore movies, streaming recommendations, Stop and retry, and the interactive labs. Sign in to manage favorites.
