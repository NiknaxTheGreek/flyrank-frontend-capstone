# A11Y Project checklist review

Reviewed on 20 November 2026 using the [A11Y Project checklist](https://www.a11yproject.com/checklist/). Scope: public Home, Movie picker, Motion lab and signed-out Account. This records the applicable checks and their evidence; it is not a WCAG conformance certification.

| Area | Review and evidence |
| --- | --- |
| Global structure | `html lang="en"`; viewport allows zoom; semantic header, named navigation and one main landmark. WAVE structure checks and source review. |
| Page titles and headings | Route-specific document titles; one h1 per page; labelled sections. Route-focus tests cover lazy client-side navigation. |
| Keyboard order and focus | Native links, inputs and buttons; no positive tabindex. First Tab exposes the skip link. Catalogue search, details, back navigation, and chat example, input, Send, Stop and retry are reachable using Tab/Enter/Space. See keyboard evidence. |
| Hidden controls | Inactive Motion button faces and feedback use visibility as well as opacity; hidden faces cannot be discovered as visible text. WAVE after has no contrast findings. |
| Images | Movie posters have descriptive alt text, intrinsic dimensions and an accessible unavailable-poster fallback. Decorative logo mark and icons are hidden from assistive technology. |
| Forms | Search, chat, Motion textarea, email and password have explicit labels. Account uses email/current-password/new-password autocomplete and native required/minlength validation. Configured signed-out form is included in deployed WAVE. |
| Feedback and errors | Loading status, chat error alert, retry and typed lookup results are rendered as text. Existing component tests cover failed and interrupted operations. |
| AI output | Actual reply sentences and lookup results update a polite, atomic live region. Stop is a labelled native button. Fixture audit verifies cancellation during streaming; live manual audit verifies cancellation during preparation and successful next-turn recovery. |
| Contrast and appearance | Official WAVE checks four rendered pages; after results and screenshots are linked from AUDIT.md. Keyboard Stop has a visible focus ring. |
| Reflow and touch | Chat fixture checked at 320 and 375 CSS px, including response card and controls. Deployed 375 px layout checked separately. Navigation and IMDb links have 44 px minimum target height. |
| Motion | Reduced-motion CSS and the existing Motion lab controls retain their reduced-motion behavior. Component tests cover the action states. |
| Lists, tables and media | Chat messages use a semantic list. No data tables, autoplay audio/video, charts or maps occur in the audited product pages. Poster text alternatives identify the represented movie. |

Limits: signed-in Favorites and account creation were not manually audited with credentials. Browser zoom at 200%/400%, forced colors, physical touch devices and NVDA/VoiceOver speech were not tested. Narrow viewport checks provide reflow evidence but are not a substitute for those additional sessions. Automated results apply to the recorded states and dates.
