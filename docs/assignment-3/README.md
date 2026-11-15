# Reel Good — Assignment 3

Reel Good is a React 18 + TypeScript + Vite movie-browsing application using live OMDb movie data, Firebase Authentication, and Firebase Realtime Database favorites.

## Implemented features

- 24 featured movies loaded from OMDb using curated verified IMDb IDs.
- Featured movies grouped and filterable by live OMDb genre metadata.
- Live title search with pagination, loading, empty, error, retry and cancellation states.
- IMDb-ID movie detail routes such as `/movies/tt1375666`.
- Separate accessible movie-detail and IMDb profile links.
- Firebase Email/Password sign-up, sign-in and sign-out.
- Protected Favorites route.
- Per-user favorites stored under the authenticated UID in Firebase Realtime Database.
- Favorites persist across refresh and signing out/back in.
- UID-scoped Firebase database rules.
- Responsive layout, keyboard-accessible controls and poster fallbacks.
- Search query/page state preserved in the URL and browser navigation.

## Run locally

Use Node 24 and npm.

```bash
npm ci
cp .env.example .env.local
npm run dev
cat > .env.local <<'EOF'
OMDB_API_KEY=<set privately in Vercel or .env.local>
VITE_FIREBASE_API_KEY=AIzaSyBRC7hQDXSbs0yLmK1pJTLWHGFcjYOXe4o
VITE_FIREBASE_APP_ID=1:958569647843:web:c57a1b957b9e64016affd6
VITE_FIREBASE_AUTH_DOMAIN=reel-good-60497.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://reel-good-60497-default-rtdb.europe-west1.firebasedatabase.app
VITE_FIREBASE_PROJECT_ID=reel-good-60497

## Combined A3 + A6 deployment

The movie chat branch retains the A3 search, movie details, IMDb links, Firebase accounts and favorites. Configure all six A3 variables plus GEMINI_API_KEY for Preview on fe06-reel-good-movie-chat; VITE_FIREBASE_* values are bundled at build time, so rebuild after changing them. Keep OMDB_API_KEY server-side. Verify search, details, sign-in, saving/removing favorites and chat on the same preview.
