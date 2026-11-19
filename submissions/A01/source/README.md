# AI Growth Workspace
### FlyRank Frontend Capstone — Nicholas Perikli

A planned workspace for sales and marketing users to review a company's website,
assess customer fit, and ask questions about their saved lead pipeline.

## Product scope

| Direction | Planned feature | Output |
| --- | --- | --- |
| FE2 | Review website metadata | Findings with supporting evidence |
| FE1 | Score a lead against explicit fit criteria | Score card, reasons and missing facts |
| FE3 | Query saved leads and reviews | Tables, summaries and comparisons |

Primary flow: enter a company URL and known business details → review the website
→ calculate customer fit → save the record → ask questions about the pipeline.

Website quality and customer fit are separate measures. A weak website does not
establish budget or buying intent. Unknown facts remain unknown.

## Current status

This repository contains Assignment 1 setup and documentation only.
There is no runnable application, AI integration, database or deployed URL yet.
All product features above are planned.

Completed repository work:
- README, MIT license, .gitignore and assistant conventions in CLAUDE.md.
- Node major-version selection in .nvmrc.
- Three Conventional Commits.
- An AI README critique and applied improvement recorded in docs/README_REVIEW.md.

Remaining submission evidence: a genuine screenshot showing the chosen assistant
completing a task in the development environment. Repository visibility was private
when checked; the evaluator needs access.

## Planned stack

Next.js App Router, React, TypeScript and Tailwind CSS.
Vitest with React Testing Library for component tests; Playwright for end-to-end
tests. WAVE for accessibility audits. Vercel is the planned deployment platform.
The runtime AI provider and persistence backend remain to be selected.

ChatGPT assists development. The app's future LLM API is a separate integration.

## Getting started

Open this repository in GitHub Codespaces (VS Code in the browser), or clone it:

```bash
git clone https://github.com/NiknaxTheGreek/flyrank-frontend-capstone.git
cd flyrank-frontend-capstone
```

Private-repository cloning requires authorized GitHub access.

In Codespaces, check the tools:

```bash
node --version
npm --version
git --version
```

The project targets Node.js 24 LTS. If another major version is active, use
`nvm install` and `nvm use` where nvm is available; these read .nvmrc.

If your Codespace was opened before the setup commits, synchronize it with:

```bash
git pull --ff-only
git log --oneline -3
```

There is no package.json yet, so npm install, npm run dev and test commands
are not available. Exact application run instructions will be added with scaffolding.
No API credentials are required for Assignment 1.

## Planned architecture

The Next.js interface will display website findings, lead score cards and chat
results. Server-side tools will handle website retrieval, deterministic scoring,
and bounded queries against saved records. The AI will invoke those tools and
explain their outputs. Provider credentials stay on the server.

Planned tools: reviewWebsite, scoreLead and queryPipeline. Their schemas and return
shapes will be documented when implemented.

## Development conventions

Read [CLAUDE.md](CLAUDE.md) before making changes. Use focused Conventional Commits:
`chore:` for setup, `docs:` for documentation, `feat:` for features and `fix:` for fixes.
Keep credentials out of Git. Use synthetic demo records. Verify changes and
report only tests actually run.

## How AI is used

ChatGPT helped select the combined scope, authored setup documentation, reviewed
the original README, and applied the documented improvement through GitHub.
Nicholas selected the combined product direction and uses an Android-accessible
Codespace. Tool versions pasted by Nicholas were Node v24.21.0, npm 11.19.0 and
Git 2.55.0; ChatGPT has not independently verified that Codespace.

The assignment explicitly requests Claude Code or Cursor screenshot evidence.
This project intentionally uses ChatGPT instead; evaluator acceptance of that
substitution has not been confirmed. No Claude Code or Cursor use is claimed.

## Roadmap

1. Scaffold the app and shared interface with synthetic records.
2. Build website review and transparent lead scoring.
3. Save records and enable bounded pipeline questions.
4. Add resilience, motion, optional 3D and shader experiences.
5. Verify tests, accessibility and production readiness.

## License

[MIT](LICENSE).
