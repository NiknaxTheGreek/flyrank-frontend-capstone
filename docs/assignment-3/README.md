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

Use Node.js 24 and npm. From the repository root, run:

```sh
npm ci
cp .env.example .env.local
```

Set `OMDB_API_KEY=your_omdb_api_key` in the local file, replacing the placeholder with your own key. Fill in the Firebase web configuration from your Firebase project, then run `npm run dev`. The [setup guide](../../README.md#setup) describes each variable and the rules for account-specific favorites.
