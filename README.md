# Reel Good — Frontend Capstone

FlyRank Frontend · Assignment 1 · Nicholas Perikli

Reel Good is a movie discovery app. Users browse by genre or search for a title, read its plot, follow its IMDb link, and save favorites to their account.

## Project setup

Reel Good is split into several frontend assignments, each with its own branch. Assignment 1 establishes the development environment, repository structure and Git conventions for the later assignments. It also records how an AI-assisted review improved the project README.

The [movie app branch](https://github.com/NiknaxTheGreek/flyrank-frontend-capstone/tree/fe03-movie-app) contains the runnable React and TypeScript application.

The app uses Vite and React Router, OMDb for movie data, and Firebase Authentication and Realtime Database for accounts and favorites. Component tests use Vitest and React Testing Library.

Development uses Node.js 24, npm, Git and VS Code in GitHub Codespaces. ChatGPT authored the setup files, reviewed the README and applied improvements.

## Inspect the branch

```bash
git clone --branch fe01-project-setup https://github.com/NiknaxTheGreek/flyrank-frontend-capstone.git
cd flyrank-frontend-capstone
git log --reverse --oneline
```

With nvm installed, run `nvm install` and `nvm use` from the repository root to select the Node version in [`.nvmrc`](.nvmrc).

## Assignment files

- [Development conventions](ChatGPT.md)
- [README critique and applied improvement](docs/README_REVIEW.md)
- [Screenshot of the ChatGPT setup summary](docs/assignment-1/evidence/a1-setup-summary.webp)
- [Submission file index](docs/assignment-1/SUBMISSION.md)
- [MIT license](LICENSE)
