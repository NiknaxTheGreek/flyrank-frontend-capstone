# Active Assignment 4 context

Reel Good uses Next.js App Router, TypeScript and Tailwind on `fe04-scaffold-deploy`.
The notes below are retained historical context and do not override the current Assignment 4 screen spec.

- Preserve Assignment 3 branch/tag/history. Never move a frozen assignment tag.
- Pages/layouts are Server Components; use Client Components only for interaction.
- No secrets in Git; OMDb keys stay server-only. NEXT_PUBLIC variables are public.
- Keep account/favorites placeholders honest until real authenticated per-user access is implemented.
- Run `npm run verify`; validate the actual Git-triggered preview at 375px and 1280px before freezing.
- Prefer free/simple implementations; document fallback and outstanding evidence.

# ChatGPT project notes

Reel Good is a React 18 and TypeScript frontend built with Vite.

## Useful commands

- `npm run dev` starts the local development server.
- `npm run build` runs the TypeScript project build and creates a production bundle.
- `npm run preview` serves the production bundle locally.

## Project conventions

- Application code lives in `src/`.
- Keep changes focused and consistent with the existing React and TypeScript patterns.
- There is currently no configured lint script.

## Testable rules learned

- Add settings in a separate component and preserve existing dashboard sections. Verify that dashboard headings and sections remain rendered after adding settings.
- Validate data read from `localStorage` and handle both read and write failures. Verify malformed or unavailable stored data does not crash the page, and assert success feedback appears only after a successful write.
- Form changes require role- and label-based behavioural tests for invalid input, persistence, and save failures. Query controls by accessible role/name; verify invalid fields and their associated errors, saved values, and visible failure feedback.
