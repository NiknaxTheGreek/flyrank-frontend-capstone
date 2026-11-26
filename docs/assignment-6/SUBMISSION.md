# Assignment 6 — Streaming movie picker

**Source:** [fe06-reel-good-movie-chat](https://github.com/NiknaxTheGreek/flyrank-frontend-capstone/tree/fe06-reel-good-movie-chat)  
**Live preview:** [Movie picker](https://flyrank-frontend-capstone-git-fe06-reel-g-fc0292-niknaxthegreek.vercel.app/pick-a-movie)

## Deliverables

- [API route](../../api/movie-chat.mjs), [server stream handler](../../server/movie-chat-handler.mjs), [Node streaming adapter](../../server/movie-chat-node.mjs).
- [Chat component](../../src/components/MovieChat.tsx), [typed SSE consumer](../../src/services/movie-chat-stream.ts), [server-only model and prompt configuration](../../server/movie-chat-config.mjs).
- [Component test](../../src/components/MovieChat.test.tsx) and [server tests](../../server/movie-chat-handler.test.mjs).

The app directly calls Gemini's streaming endpoint, rather than the Claude SDK named in the brief. This provider substitution is documented; explicit rubric acceptance of the substitution has not been verified. Responses are plain text and typed text/done/error SSE events, avoiding incomplete Markdown rendering. Conversation state is retained during the mounted session; refresh persistence is not implemented (optional stretch goal).

## Evaluation and verification — 26 November 2026

| Requirement | Evidence |
|---|---|
| Real incremental streaming | Server forwards upstream text deltas; client appends each delta. Mocked split-event and thinking-to-text tests exist. Static historical captures alone do not measure delivery timing. |
| Stop and preserve partial text | AbortController on client, cancellation propagation on server, partial outcome label and focus returned to input. Screenshot shows a stopped partial reply. Component test exercises stop then send again and asserts retained history. |
| Multi-turn context | Client sends up to 20 recent nonempty messages, server maps assistant to model role. Screenshot shows a contextual follow-up; mocked component/server tests assert history. |
| Thinking and styled messages | Thinking text appears in an empty assistant message and is replaced by streamed text; distinct bubble styling and live status announcements. |
| Auto-scroll | Source tracks pinned state, releases on upward scrolling and offers Jump to latest. Historical screenshot shows the control. The 26 November phone capture also shows the Jump to latest control; continuous scroll behavior is not established by a still image. |
| Server-side key | Server reads GEMINI_API_KEY; .env.example has blank values, local env files are ignored, no VITE_ key for Gemini. Repository-wide historical secret remediation remains separate. |
| Phone width | CSS uses bounded transcript width, wrapping controls, full-width textarea, 44px minimum button height and wrapping long text. A learner-supplied Samsung Browser screenshot from 26 November shows readable messages, wrapped text, the input and both action buttons within the phone display. Exact CSS viewport width (375px) was not measured. |

The Git-triggered Vercel deployment for source commit `e18541983098d320837a45a34315091c6581ea87` is READY. Build logs show TypeScript and Vite production build success; a large-bundle warning is non-fatal. The public branch preview returned the expected movie-picker content on 26 November without signing in. The learner's subsequent live phone capture on 26 November demonstrates a retained stopped reply followed by another user message and an assistant reply. The audit did not independently measure live chunk timing or execute a fresh automated test suite.

## Original screenshot evidence — 12 November 2026

| Screenshot | What it demonstrates |
|---|---|
| [Movie recommendation](evidence/movie-recommendation.png) | User asks for a scary but not too intense movie; recommendation for Shaun of the Dead is visible, and Jump to latest appears while the transcript is scrolled up. |
| [Follow-up](evidence/follow-up-question.png) | User asks which suggestion is least scary; assistant recommends ParaNorman and offers a contextual next question. |
| [Stopped response](evidence/stopped-response.png) | Incomplete generated text is retained with the Stopped · partial response label, and the textarea has visible focus. |

All three original PNGs were retrieved and visually inspected on 26 November. These desktop captures support the historical UI states and conversation behavior, not independent timing measurements.

## Mobile evidence — 26 November 2026

[Original Samsung Browser screenshot](evidence/mobile-stop-and-follow-up.webp) (709 × 1536 image pixels, not CSS viewport pixels) shows the previous reply marked **Stopped · partial response**, a subsequent user request ('Something scary but not too scary.'), a new assistant reply, the **Jump to latest** control, and the visible textarea and Send/Stop buttons. It demonstrates actual phone use and continued conversation after stopping, with no apparent horizontal clipping of the visible controls. The original WebP bytes are preserved. This still image does not establish the exact CSS viewport width, chunk arrival timing, or the entire scrolling sequence.

## Reviewer checks

Open the public preview at 375px. Send a longer recommendation prompt, observe incremental text, scroll up while streaming, stop mid-response and send a follow-up. Confirm the partial answer remains, the input is usable and the transcript resumes correctly.
