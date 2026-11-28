# Product integration

**Release date:** 20 November 2026

## Integrated features

| Feature | Implementation |
| --- | --- |
| Planet Studio | Lazy Three.js renderer, touch controls and static fallback |
| Shader Lab | GLSL hero, palette controls, pause and reduced motion |
| Accessibility | Accessible dialog, tabs and disclosure; focus restoration |
| Preferences | Validated notification settings |
| Health | Bounded server-side data fetch |
| Movie application | Existing catalogue, accounts, favorites, streaming chat and recovery |

The shared navigation and Vercel rewrites support direct links and page reloads. Accessibility, lazy loading, Firebase splitting and API safeguards remain in the combined release.

## Deployment

| Item | Value |
| --- | --- |
| Source commit | `86c8b2e686f4e5aa503a8a01d6ac20b4e9b6a065` |
| Vercel deployment | `dpl_3hpwnrctEscMCNfBWN8HE2fjeNdD` |
| Build | Passed; about 32 seconds |
| Initial JS | About 184 KB uncompressed |
| Deferred Three.js chunk | About 532 KB uncompressed |

## Source references

| Feature | Source snapshot |
| --- | --- |
| Planet Studio | `b6d68b4a323bbf14ce2d0a6c4902ddd0d184a3b2` |
| Performance and accessibility | `6d46a81382a8f94e92b9e898d4c31ed35ed9422b` |
| Shader Lab | `47905528da51d62bf4ecc426b675d4403b061139` |
| Accessibility playground | `ff0de2990a71a483fd0b2a12c9fbac09a868e188` |
| Release base | `c889befe6ae8d90671799e0490df74b8eb38cb43` |

## Integration evidence

[Combined CI results](evidence/integrated-ci-suite.png) · [Mocked browser journey](evidence/integrated-movie-picker-fixture.png) · [Production smoke results](evidence/integrated-production-smoke.json)

The initial integrated release passed 100 component/server tests and 24 browser journeys. The smoke test confirmed public route responses, the health API and a real movie lookup. Earlier desktop captures predate lab integration; the integrated mobile capture represents the completed navigation.
