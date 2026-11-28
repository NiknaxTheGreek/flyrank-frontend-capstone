# Reel Good — Assignment 6: Streaming interface

In this assignment, Reel Good gains a conversational movie assistant that streams recommendations as they arrive. The interface gives users control over generation, retains conversational context and accommodates scrolling and phone-sized layouts.

[Open the streaming movie picker preview](https://flyrank-frontend-capstone-git-fe06-reel-g-fc0292-niknaxthegreek.vercel.app/pick-a-movie). See the [submission and audit record](docs/assignment-6/SUBMISSION.md) for source links, screenshot descriptions and verification.

## Screenshot evidence

- [Movie recommendation and Jump to latest control](docs/assignment-6/evidence/movie-recommendation.png): the transcript is scrolled up, showing the request for a scary but not too intense movie and a recommendation for Shaun of the Dead.
- [Follow-up asking which film is least scary](docs/assignment-6/evidence/follow-up-question.png): the assistant responds with ParaNorman and continues the conversation in context.
- [Stopped generation with the partial response visible](docs/assignment-6/evidence/stopped-response.png): the incomplete response is retained, marked Stopped, and the input has visible focus.

- [Mobile stop and follow-up](docs/assignment-6/evidence/mobile-stop-and-follow-up.webp): the 26 November phone capture shows the retained stopped response, a subsequent user request and assistant reply, Jump to latest, and the visible input and controls.

## Reviewing the chat


Enter a movie preference of your choice or use the example prompt. The reply appears as it arrives. Stop a longer response, then send a follow-up to explore how the conversation retains context.
Scroll up during a longer reply to check that the transcript keeps your place;
**Jump to latest** resumes following new text.

- [Chat component](src/components/MovieChat.tsx): what the user sees and clicks.
- [API route](api/movie-chat.mjs) and [stream handler](server/movie-chat-handler.mjs):
  validate the conversation, call Gemini, and stream the reply back.
- [Model and instructions](server/movie-chat-config.mjs): server-only settings.

Set `GEMINI_API_KEY` in your local `.env.local` for Vite and as a server-side
**Preview** environment variable in Vercel. Redeploy the branch after setting it.
`GEMINI_MODEL` is an optional server environment override. Never put the key
in a `VITE_` variable. The movie picker does not require OMDb or Firebase
credentials; those are for the existing search and favourites features.

ChatGPT was used as a development tool. The app calls the Gemini streaming API at
runtime. This replaces the Claude provider named in the original brief.
Run `npm test` for the mocked streaming checks and `npm run build` to verify
the production bundle. The preview needs its own API credentials for live testing.

On Vercel, verify **Source** is `fe06-reel-good-movie-chat` as well as **Environment** being **Preview**. A Preview built from `main` shows the assignment index and does not include the movie picker.

The default model is gemini-3.5-flash-lite. Keep Google Cloud billing disabled to use only your available free-tier quota; quota exhaustion returns an error, with no paid-provider fallback. Deploy branch fe06-reel-good-movie-chat, not main.
