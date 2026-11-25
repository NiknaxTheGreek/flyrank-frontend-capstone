# Assignment 5 — Accessibility playground

**Source branch:** [fe05-accessibility-playground](https://github.com/NiknaxTheGreek/flyrank-frontend-capstone/tree/fe05-accessibility-playground)  
**Public preview:** [Playground](https://flyrank-frontend-capstone-git-fe05-access-b552f6-niknaxthegreek.vercel.app/playground)

## Deliverables

- [Custom disclosure](../../playground/Disclosure.tsx), [tabs](../../playground/Tabs.tsx), and [modal](../../playground/Modal.tsx).
- [shadcn comparison](../../playground/ShadcnComparison.tsx), with [dialog](../../src/components/ui/dialog.tsx) and [tabs](../../src/components/ui/tabs.tsx) source.
- [Keyboard verification and comparison notes](../../NOTES.md).

## Audit — 25 November 2026

The custom components use React and TypeScript without component libraries. The notes record learner keyboard checks of disclosure, tabs, modal focus containment and focus restoration, and three concrete gaps relative to shadcn. The work was AI-assisted, not independently handwritten.

Vercel recorded a READY Git-triggered deployment for `33fe0c4`; Next.js compilation and TypeScript checks completed and the public playground loaded. The subsequent audit restores the missing orientation prop in the shadcn tabs wrapper and removes a nested main landmark. Fresh build and keyboard verification of those changes are outstanding.

## Evidence and limitations

The archived JPEG could not be validated as a usable screenshot. Replacement with the learner's original screenshot is outstanding. The historical manual keyboard checks are documented in NOTES.md; no fresh automated keyboard or screen-reader pass is claimed. The last inspected build reports five moderate dependency vulnerabilities.

Repository-wide historical credential cleanup remains deferred.
