# ChatGPT project notes

FlyRank is a React 18 and TypeScript frontend built with Vite.

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
## Assignment 10 testing rules

- Query interactive components by role and accessible name; avoid CSS selectors and test IDs.
- Keep all AI and movie requests mocked. The Vitest setup rejects unmocked fetches.
- Run `npm run typecheck` for both application and test source before reporting success.
- Run the component suite, production build, and mocked Playwright journeys after changing the chat or its stream contract.
- A passing workflow is distinct from an enforced branch protection rule. Report both honestly.

