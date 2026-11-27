# Reel Good — Assignment 8: Resilience checkpoint

In this assignment, the streaming movie assistant becomes a more resilient application. Network failures, interrupted replies, slow requests and unavailable data are handled with clear feedback, preserved conversation history and a way to recover.

[Open the live checkpoint](https://flyrank-frontend-capstone-git-fe08-resili-0333c8-niknaxthegreek.vercel.app/pick-a-movie) · [Checkpoint implementation](docs/assignment-8/CHECKPOINT.md) · [Submission summary](docs/assignment-8/SUBMISSION.md) · [Original visual evidence](docs/assignment-8/EVIDENCE.md)

## What changed

- Retry failed message resends the failed turn with its previous context and replaces the unsuccessful assistant attempt.
- Interrupted output remains visible until retry; a synchronous in-flight guard prevents duplicate retry requests.
- Loading skeletons and slow-response guidance explain pending requests.
- Empty-state instructions, an example prompt and disabled blank-input submission provide a clear next action.
- Route-level error boundaries, typed SSE validation and structured lookup errors support recovery.
- Responsive sizing, wrapped controls and reduced-motion-aware styling improve usability on smaller screens.

## Reviewing the application

Open the movie picker and request recommendations or factual details about a film of your choice. To explore recovery, use browser network controls to simulate an offline request or interrupt a longer response. Restore connectivity and choose **Retry failed message**. The earlier conversation should remain intact. The [evidence inventory](docs/assignment-8/EVIDENCE.md) shows the original happy path, handled failures, recovery, clean-console capture and Android layout. The [checkpoint notes](docs/assignment-8/CHECKPOINT.md) explain the separate automated sabotage checks and their scope.

The React/Vite implementation uses a route error boundary and local chat error state instead of Next.js `error.tsx` and `useChat.error`. The original verification recorded 53 passing tests and a successful build; the 27 November audit confirmed the current source, deployment and original evidence. Mobile Safari has not been tested.
