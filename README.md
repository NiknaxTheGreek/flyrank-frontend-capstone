# Reel Good — Assignment 5: Accessibility playground

In this assignment, accessible interaction patterns are explored by implementing a custom disclosure, tabs and modal in React and TypeScript, then comparing them with shadcn/Radix. The goal is to understand keyboard behavior, focus management and semantic UI before relying on a component library.

This branch contains an accessibility playground comparing custom React components with shadcn/Radix. Open `/playground` to review the disclosure, keyboard tabs, modal dialog, and library comparison.

## Run and review

```sh
npm ci
npm run verify
npm start
```

Use Node 24 and open http://localhost:3000/playground. See the [A5 submission index](docs/assignment-5/SUBMISSION.md) and [keyboard/source-review notes](NOTES.md).

The [manual keyboard checks and source-review notes](NOTES.md) document the custom components and shadcn comparison. Open the [deployed playground](https://flyrank-frontend-capstone-git-fe05-access-b552f6-niknaxthegreek.vercel.app/playground) or review the [five original screenshots](docs/assignment-5/SUBMISSION.md#screenshot-evidence). The Git-triggered Next.js build of commit `42e58e6` was READY on 25 November 2026, including successful TypeScript checks and generation of `/playground`.

## Reviewing the assignment

Open the playground and operate the custom widgets using the keyboard. Compare the library versions and read the documented differences.
