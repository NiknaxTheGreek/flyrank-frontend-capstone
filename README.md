# Reel Good — Frontend Capstone
### Assignment 1: Project setup · Nicholas Perikli

Reel Good is a movie discovery application. Users browse by genre, search for
movies, read plot summaries and details, follow IMDb links, and save favorites
with an account.

This branch, `fe01-project-setup`, contains the setup documentation for the
FlyRank **Frontend** track. 

## Product scope

- Movie browsing and search.
- Movie detail pages and IMDb links.
- Account sign-up/sign-in and personal favorites.
- Later frontend assignments develop chat interactions, resilience, motion,
  arcade/3D experiences, shader visuals, testing and accessibility.

Primary flow: discover or search for a movie → inspect its details → save a
favorite → return to the saved collection.

## Branch scope and status

This is the Assignment 1 documentation branch, not the runnable application.
It contains README.md, CLAUDE.md, LICENSE, .gitignore, .nvmrc, and
[the README review](docs/README_REVIEW.md).

Application code is maintained on later assignment branches; for example,
[fe03-movie-app](https://github.com/NiknaxTheGreek/flyrank-frontend-capstone/tree/fe03-movie-app)
contains the movie application's React/Vite foundation. Follow each application
branch's own README for its run instructions and verification status.

Assignment 1 is recorded as **complete — awaiting submission**.
Screenshot evidence and its limitations are described in
[the submission notes](docs/assignment-1/SUBMISSION.md).

## Stack and tools

The movie-app foundation uses React, TypeScript, Vite, React Router, OMDb for
movie data, and Firebase Authentication and Realtime Database for accounts and
favorites. Component tests use Vitest and React Testing Library. Later
assignments add end-to-end tests and accessibility audits.

Development tools: Node.js 24, npm, Git and VS Code in GitHub Codespaces.
ChatGPT is the selected development assistant. Vercel hosts the later capstone.

## Inspect this setup branch

```bash
git clone --branch fe01-project-setup https://github.com/NiknaxTheGreek/flyrank-frontend-capstone.git
cd flyrank-frontend-capstone
node --version
npm --version
git --version
git log --oneline
```

Where nvm is installed, run `nvm install` and `nvm use` to use .nvmrc.
This branch has no package.json or npm application scripts and needs no API keys.
Do not run application install/start commands here.

## Development conventions

Read [CLAUDE.md](CLAUDE.md). Use focused Conventional Commits such as `chore:`,
`docs:`, `feat:`, `fix:` and `test:`. Preserve meaningful history, keep secrets
out of Git, and report only checks actually run.

The original three setup commits remain in history:
- `chore: initialize frontend capstone repository`
- `chore: add license and development conventions`
- `docs: improve README following AI review`

## AI assistance and review

ChatGPT authored setup files, reviewed the README and applied improvements.
On 20 November 2026 the setup documentation was corrected to match Reel Good,
using the movie-app branch README and package manifest as references.
[README_REVIEW.md](docs/README_REVIEW.md) records the review.

Tool versions originally pasted by Nicholas were Node v24.21.0, npm 11.19.0 and
Git 2.55.0; these were user-supplied, not independently verified in his Codespace.

The assignment names Claude Code or Cursor. This project uses ChatGPT instead.
The stored chat-status screenshot demonstrates status, not an assistant executing
a coding task. Evaluator acceptance of substitute evidence is unconfirmed.

## License

[MIT](LICENSE).

## Submission package
See [submission notes](docs/assignment-1/SUBMISSION.md) and the [completeness audit](docs/assignment-1/AUDIT.md). Submit this branch URL so the reviewer can inspect both files and Git history.
