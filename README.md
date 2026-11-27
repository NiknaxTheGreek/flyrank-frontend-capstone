# Reel Good — Assignment 12: Performance and accessibility

In this assignment, the application is measured and improved using mobile Lighthouse, WAVE and keyboard verification. The goal is to reduce loading cost and improve access to the primary movie discovery and chat flows, with documented before/after results.

[Production application](https://flyrank-frontend-capstone-snowy.vercel.app/) · [Performance and accessibility audit](AUDIT.md) · [Submission and evidence](docs/assignment-12/SUBMISSION.md)

## Implementation and results

The recorded mobile Home audit improved performance from 81 to 98 and accessibility from 96 to 100. Movie picker performance improved from 97 to 100, with accessibility at 100. The audit documents route splitting, loading and accessibility improvements, WAVE results and keyboard checks. Scores describe the measured snapshot rather than a fresh audit of the combined release.

## Reviewing the assignment

Review the measured before/after reports and keyboard checks, then explore the application using keyboard navigation. The audit results refer to the dated source snapshot.

## Evidence and verification

See [AUDIT.md](AUDIT.md), the [accessibility checklist](docs/assignment-12/CHECKLIST.md) and [original reports](docs/assignment-12/evidence/). The recorded release verification passed 91 component/server tests and 10 browser journeys. Assistive-technology and physical-device limitations are documented in the audit.
