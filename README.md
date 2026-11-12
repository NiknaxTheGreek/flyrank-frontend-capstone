# FlyRank Frontend Capstone

A lightweight SEO growth dashboard designed to showcase FlyRank's analytics and optimization workflow.

## Overview

This frontend capstone is built with React + Vite and presents a mock dashboard for keyword tracking, organic growth, and regional visibility. It is intended as a polished foundation for further feature work, such as interactive filters, lead generation flows, or a product landing page.

## Getting started

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` — start the Vite dev server
- `npm run build` — create a production build
- `npm run preview` — preview the production build locally

## Notes

The project keeps the UI focused on a single-screen dashboard while remaining easy to extend with new pages or data-driven components.

## FE-06: Streaming SEO audit assistant

Open **Audit assistant** from the dashboard. Try the sample prompt, stop the
response while text is arriving, and ask a follow-up about the partial response.
The assistant works with sample dashboard metrics and findings you supply. It
does not crawl websites. The conversation stays in the open page until refresh.

With Node.js 24, run `npm ci` and copy `.env.example` to `.env.local`. Set
`ANTHROPIC_API_KEY` there. In separate terminals run `npm run dev:api` and
`npm run dev`. Vite proxies `/api/audit` to the local API server. Run
`npm run test:audit` for the provider-mocked server checks and `npm run build`
to verify TypeScript and the browser bundle.

For a Vercel preview, import this repository as a Vite project and add
`ANTHROPIC_API_KEY` to the **Preview** environment. Redeploy the branch after
adding the key. Optionally set `ANTHROPIC_MODEL` to override the server default.
Keep the preview access controlled while using a paid API key.

- [Route entry point](api/audit.mjs) and [stream handler](server/audit-handler.mjs)
- [System prompt and model configuration](server/audit-config.mjs)
- [Chat component](src/AuditChat.tsx) and [typed stream reader](src/audit-stream.ts)

The route sends Claude text deltas as server-sent events. The chat renders
plain text throughout so incomplete formatting cannot change the layout.
Stopping cancels the request and keeps any text received. Follow-up requests
include up to 20 recent messages. The response does not force scrolling once
the reviewer scrolls up; **Jump to latest** resumes following the stream.
