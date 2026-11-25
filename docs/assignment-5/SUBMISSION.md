# Assignment 5 — Accessibility playground

**Source branch:** [fe05-accessibility-playground](https://github.com/NiknaxTheGreek/flyrank-frontend-capstone/tree/fe05-accessibility-playground)  
**Public preview:** [Playground](https://flyrank-frontend-capstone-git-fe05-access-b552f6-niknaxthegreek.vercel.app/playground)

## Deliverables

- [Custom disclosure](../../playground/Disclosure.tsx), [tabs](../../playground/Tabs.tsx), and [modal](../../playground/Modal.tsx).
- [shadcn comparison](../../playground/ShadcnComparison.tsx), with [dialog](../../src/components/ui/dialog.tsx) and [tabs](../../src/components/ui/tabs.tsx) source.
- [Keyboard verification and comparison notes](../../NOTES.md).

## Screenshot evidence

Original learner captures from 12 November 2026. The screenshots document successive implementation stages in Codespaces; the light theme appears after shadcn installation.

| Screenshot | What it demonstrates |
|---|---|
| [Codespaces startup](evidence/01-branch-startup.webp) | Terminal shows switching to `fe05-accessibility-playground`, running `npm run dev`, Next.js 16.4.2 ready, and successful HTTP 200 responses for `/`. The visible React 18 warning is non-fatal. |
| [Expanded disclosure](evidence/02-disclosure-expanded.webp) | The earlier dark-theme playground shows the expanded disclosure with minus indicator, keyboard instructions and the W3C link visible. |
| [Custom components](evidence/03-custom-components.webp) | Shows the collapsed disclosure (plus indicator), three custom tabs with Overview selected and its panel visible, and the modal trigger. |
| [Custom modal focus](evidence/04-modal-focus.webp) | Shows the open dialog, dimmed background, Close and Done buttons, and the visible focus ring around Done. It supports visible focus inside the dialog, not proof of the entire focus trap or focus return sequence. |
| [shadcn comparison](evidence/05-shadcn-comparison.webp) | Shows the later light-theme playground after shadcn installation, with custom tabs and modal trigger alongside Radix-backed tabs and the shadcn modal trigger. |

## Verification

The custom components use React and TypeScript without component libraries. NOTES.md records learner keyboard checks of disclosure, tabs, modal focus containment and restoration, plus three concrete gaps relative to shadcn. Implementation was AI-assisted.

The Git-triggered Vercel deployment of corrected source commit `42e58e61c44ff42d8f4771a6f2d91eea85179709` reached READY on 25 November 2026. Next.js compilation and TypeScript checks passed, including generation of `/playground`. The correction forwards orientation to the Radix tabs root and avoids a nested main landmark. Manual keyboard results refer to the original testing session; no fresh post-correction keyboard or screen-reader pass is claimed.

The inspected build reported five moderate dependency vulnerabilities and non-fatal tooling warnings. Repository-wide historical credential remediation is tracked separately.
