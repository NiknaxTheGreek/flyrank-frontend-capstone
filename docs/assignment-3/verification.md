# Assignment 3 — Verification

## Automated verification

- Full `npm test` suite: **passed**
- `npm run build`: **passed**
- `git diff --check`: **clean**
- Routing tests: passed
- Live movie tests: passed
- Authentication/favorites tests: passed
- Favorites service tests: passed
- OMDb API tests: passed

## Movie functionality verified

- 24 featured movies are loaded from OMDb using verified IMDb IDs.
- Featured movies use live OMDb titles, posters, plots and genres.
- Genre filtering works against the live featured catalogue.
- Live title search works.
- Search pagination and URL state are supported.
- Search requests can be cancelled without stale results overwriting newer state.
- Movie details use canonical IMDb-ID routes such as `/movies/tt1375666`.
- Legacy routes such as `/movies/inception` correctly show the recovery state.
- IMDb links remain separate from internal movie navigation.
- Direct search URLs do not unnecessarily load all 24 featured movies.

## Firebase verification

Firebase Email/Password authentication and Realtime Database favorites were manually verified end to end.

Verified flow:

Home → movie → sign in → add favorite → Favorites → refresh → sign out → sign back in → return to Favorites → remove favorite.

Also verified:

- signed-out Favorites route protection;
- favorites stored under the authenticated UID;
- favorites persist after refresh;
- favorites persist across sign-out/sign-in;
- favorite removal works;
- empty Favorites state appears after removal;
- Favorites were saved under the signed-in user’s UID. The database rules restrict access by UID. Cross-account isolation was not tested in the emulator.

## API safeguards

The OMDb API layer verifies:

- input validation;
- canonical IMDb IDs;
- search-result enrichment;
- caching;
- in-flight request reuse;
- maximum detail concurrency of three;
- sanitized errors;
- server-side OMDb credentials;
- 15-second upstream timeout;
- 60 uncached upstream requests per minute per running process.

## Security/configuration

- `.env.local` is ignored by Git.
- The setup example now uses a placeholder for the OMDb key. An earlier commit exposed the key. Provider revocation and runtime replacement require separate verification.
- `OMDB_API_KEY` remains server-side and does not use a `VITE_` prefix.
- Firebase client configuration is supplied through environment variables.
- Realtime Database rules restrict each user to their own path.

## Reproducible implementation snapshot

Implementation commit:

`d2ced0c`

Branch:

`fe03-movie-app`

## Screenshot

The archived movie-detail JPEG is truncated and cannot be used as visual evidence. The submission index links to the movie-detail implementation and routing tests.
