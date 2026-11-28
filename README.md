# Reel Good — Assignment 1: Project setup

In this assignment, the foundation for Reel Good is established through a consistent development environment, repository conventions and an AI-assisted documentation review. These decisions make the later assignments reproducible and easier to maintain.

FlyRank Frontend · Assignment 1 · Nicholas Perikli

Reel Good is a movie discovery app. Users browse by genre or search for a title, read its plot, follow its IMDb link, and save favorites to their account.

## Project setup

The repository is organized into 14 assignments, each with its own branch or comparison variant.

The [movie app branch](https://github.com/NiknaxTheGreek/flyrank-frontend-capstone/tree/fe03-movie-app) contains the runnable React and TypeScript application.

The app uses Vite and React Router, OMDb for movie data, and Firebase Authentication and Realtime Database for accounts and favorites. Component tests use Vitest and React Testing Library.

Development uses Node.js 24, npm, Git and VS Code in GitHub Codespaces. ChatGPT was used as a tool for project setup, README review and refinements.

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

## Reviewing the assignment

Inspect the setup files, the three initial Conventional Commits and the README review.
