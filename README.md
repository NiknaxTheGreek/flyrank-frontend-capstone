# Reel Good — Assignment 9: Button lifecycle

In this assignment, asynchronous actions are designed as a reusable, accessible five-state button. Motion Lab demonstrates how idle, loading, success, error and disabled states communicate progress and recovery without distracting motion or layout shifts.

[Live Motion Lab](https://flyrank-frontend-capstone-git-fe09-button-d06295-niknaxthegreek.vercel.app/motion-lab) · [Component and motion rationale](docs/assignment-9/README.md) · [Submission and evidence](docs/assignment-9/submission.md)

## Implementation

The reusable component provides five states, stable dimensions, keyboard and focus feedback, duplicate-request protection, recovery and reduced-motion alternatives.

## Reviewing the assignment

Open Motion Lab and exercise success, failure and retry. Try keyboard activation, repeated activation and reduced motion. Both actions are simulated.

## Local development and verification

Use Node 24, `npm ci`, `npm run dev`, `npm test` and `npm run build`. No credentials are needed for this demo. See the linked implementation notes for detailed commands and recorded checks.

## Connection to the capstone

The button lifecycle builds on the recovery interactions from A8 and provides a reusable pattern for the finished product.
