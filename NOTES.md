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
to TabsPrimitive.Root. We added orientation={orientation}. This was found
through source review; the demonstrated keyboard checks were horizontal.

Generated utility imports used "cn". We changed these to "@/lib/utils"
to reference this project's local helper.

The custom modal uses native dialog.showModal() for browser modal
behaviour, plus explicit Tab wrapping and focus restoration. shadcn
delegates behaviour to Radix primitives. The generated wrapper source
is not the complete implementation of Radix focus management.

An overly broad TypeScript include pulled older A3 Vite components into
the Next.js check. We narrowed it to the relevant UI directory while
explicitly including playground files. The subsequent type check passed.

Installing shadcn changed global styles, producing the light-theme
comparison shown in the latest screenshot.

## References

- https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
- https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
- https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- https://ui.shadcn.com/docs/components/dialog
- https://ui.shadcn.com/docs/components/tabs

## Remaining verification

Production build passed, including TypeScript checks and static generation of /playground. Final Git push is pending.
