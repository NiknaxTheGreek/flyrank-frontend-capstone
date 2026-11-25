# Assignment 5 — Accessibility playground

## Implementation and assistance

The custom disclosure, tabs and modal were implemented in React and
TypeScript without a component library, with ChatGPT-generated code
and guided explanations. I ran the keyboard checks myself and supplied
screenshots. This was AI-assisted work, not independently handwritten code.

Custom components are in playground/. The /playground route also displays
shadcn dialog and tabs for comparison.

## Keyboard verification

I confirmed these manual checks passed:
- Disclosure: Tab focus, Enter/Space toggle, access to the expanded link,
  and exclusion of the hidden link from the Tab sequence.
- Tabs: Left/Right arrows, wrapping, Home/End, Tab into the content panel,
  and Shift+Tab back to the selected tab.
- Modal: initial focus, forward/backward focus wrapping, Escape dismissal,
  button dismissal, and focus returning to the opening button.
- shadcn comparison: tab navigation, dialog focus containment, and Escape
  dismissal with focus restoration.

Home/End were tested using the Windows on-screen keyboard.
Screenshots support the visual evidence; they do not alone prove keyboard
behaviour or complete screen-reader accessibility.

## Concrete gaps in the custom versions

1. Reusable dialog composition:
   My modal hardcodes its title, description, trigger and buttons.
   shadcn exposes separate DialogTitle, DialogDescription, DialogTrigger
   and DialogClose components with typed props and children. I did not
   initially provide that flexibility.

2. An accessible icon-only close control:
   My modal uses visible text buttons. shadcn includes an optional X icon
   with an sr-only "Close" label. I had not implemented an icon-only
   control or its accessible-name treatment. My text buttons already
   have accessible names; this is an additional supported use case.

3. Configurable tab orientation:
   My tabs implement horizontal navigation only. The shadcn wrapper
   exposes orientation through the Radix root props. Supporting vertical
   tabs requires matching keyboard behaviour as well as vertical styling.

## Source review and corrections

The generated tabs wrapper extracted orientation but did not forward it
to TabsPrimitive.Root. The 25 November source audit found that the forwarded prop was missing in the current branch, despite the earlier correction note. The audit restores `orientation={orientation}` on `TabsPrimitive.Root`. This is a source correction; the demonstrated keyboard checks were horizontal and vertical keyboard behavior has not been newly tested.

Generated utility imports used "cn". We changed these to "@/lib/utils"
to reference this project's local helper.

The custom modal uses native dialog.showModal() for browser modal
behaviour, plus explicit Tab wrapping and focus restoration. shadcn
delegates behaviour to Radix primitives. The generated wrapper source
is not the complete implementation of Radix focus management.

An overly broad TypeScript include pulled older A3 Vite components into
the Next.js check. We narrowed it to the relevant UI directory while
explicitly including playground files. The subsequent type check passed.

Installing shadcn changed global styles to the light theme. The 25 November audit also removed a nested `main` landmark from the playground page, retaining the root layout's main landmark.

## References

- https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
- https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
- https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- https://ui.shadcn.com/docs/components/dialog
- https://ui.shadcn.com/docs/components/tabs

## 25 November 2026 audit

- The Vercel Git deployment of `33fe0c4` reached READY; its build compiled Next.js and completed TypeScript checking, including `/playground`. This was before the two narrow source corrections above.
- The public playground returned expected page content. This is not a fresh keyboard interaction test.
- No explicit `any` prop escapes were found in the three custom components or the reviewed shadcn wrappers. The strict TypeScript configuration includes the playground.
- The latest inspected install log reports five moderate dependency vulnerabilities and a non-fatal React 18 deprecation warning. No dependency upgrade was performed during this audit.
- The original manual keyboard results above are learner-reported historical evidence. No A5-specific automated keyboard test suite was found.
- The archived screenshot JPEG is not reliable visual evidence. The original learner captures could not be recovered in this audit; replacement is pending. No new screenshot or test pass is claimed.
- Independently handwritten implementation was not demonstrated; the assistance disclosure above remains accurate.
