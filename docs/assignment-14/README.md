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

The combined release was tested on 20 November 2026. Regression CI and the live browser workflow passed again on 25 November. The application source remained unchanged during subsequent documentation updates.

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

The screenshots record individual test cases. The interface supports any available movie, not only the titles shown in these captures.

## Scope and limitations

- Real Safari and iPhone Safari were not tested because Apple devices were unavailable. Playwright desktop/mobile WebKit passed.
- GPU tests ran in Chromium; other engines tested static and reduced-motion fallbacks.
- The signed-in save and Favorites-list flow was observed. A separate sign-out/sign-in cycle was not captured; backend persistence and isolation passed.
- Live invalid requests returned HTTP 400. Unit tests verify HTTP 429 and `Retry-After`; a live 429 was not reproduced. Rate limits are per instance.
- The earlier accessibility and performance measurements apply to their audited deployment.
- A separate automated page-inspection environment returned route error screens on 28 November. Manual production checks succeeded, and the unchanged deployment had passed independent browser tests. The discrepancy remains unconfirmed outside that inspection environment.

## Review

Explore the movie catalogue, submit a recommendation request, stop or retry a reply and request a movie lookup. Sign in to save or remove a movie of your choice. Explore the integrated labs and preferences.

Checkpoint 2 is ready for submission, with the device-access limitation disclosed.
