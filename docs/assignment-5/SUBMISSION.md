# Assignment 5 — Accessibility playground

In this assignment, accessible interaction patterns are explored by implementing a custom disclosure, tabs and modal in React and TypeScript, then comparing them with shadcn/Radix. The goal is to understand keyboard behavior, focus management and semantic UI before relying on a component library.

**Public preview:** [Playground](https://flyrank-frontend-capstone-git-fe05-access-b552f6-niknaxthegreek.vercel.app/playground)

## Deliverables

- [Custom disclosure](../../playground/Disclosure.tsx), [tabs](../../playground/Tabs.tsx), and [modal](../../playground/Modal.tsx).
- [shadcn comparison](../../playground/ShadcnComparison.tsx), with [dialog](../../src/components/ui/dialog.tsx) and [tabs](../../src/components/ui/tabs.tsx) source.
- [Keyboard verification and comparison notes](../../NOTES.md).

## Screenshot evidence

Original browser captures from 12 November 2026. The screenshots document successive implementation stages in Codespaces; the light theme appears after shadcn installation.

| Screenshot | What it demonstrates |
|---|---|
| [Codespaces startup](evidence/01-branch-startup.webp) | Terminal shows switching to `fe05-accessibility-playground`, running `npm run dev`, Next.js 16.4.2 ready, and successful HTTP 200 responses for `/`. |
| [Expanded disclosure](evidence/02-disclosure-expanded.webp) | The earlier dark-theme playground shows the expanded disclosure with minus indicator, keyboard instructions and the W3C link visible. |
| [Custom components](evidence/03-custom-components.webp) | Shows the collapsed disclosure (plus indicator), three custom tabs with Overview selected and its panel visible, and the modal trigger. |
| [Custom modal focus](evidence/04-modal-focus.webp) | Shows the open dialog, dimmed background, Close and Done buttons, and the visible focus ring around Done. It supports visible focus inside the dialog, not proof of the entire focus trap or focus return sequence. |
| [shadcn comparison](evidence/05-shadcn-comparison.webp) | Shows the later light-theme playground after shadcn installation, with custom tabs and modal trigger alongside Radix-backed tabs and the shadcn modal trigger. |

## Verification

The custom components use React and TypeScript without component libraries. NOTES.md records manual keyboard checks of disclosure, tabs, modal focus containment and restoration, plus three concrete gaps relative to shadcn. Implementation was AI-assisted.

The Git-triggered Vercel deployment of source commit `42e58e61c44ff42d8f4771a6f2d91eea85179709` reached READY on 25 November 2026. Next.js compilation and TypeScript checks passed, including generation of `/playground`. Manual keyboard results refer to the original testing session; no fresh post-correction keyboard or screen-reader pass is claimed.

The inspected build reported five moderate dependency vulnerabilities and non-fatal tooling warnings. Repository-wide historical credential remediation is tracked separately.

## Reviewing the assignment

Open the playground and operate the custom widgets using the keyboard. Compare the library versions and read the documented differences.
