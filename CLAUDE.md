# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # start Vite dev server on port 3000
npm run build       # production build (outputs to dist/)
npm run build:dev   # build in development mode (unminified, useful for debugging build issues)
npm run preview     # preview the production build locally
npm run lint         # eslint .
npm test             # vitest run (single run)
npm run test:watch  # vitest watch mode
```

There is no test suite yet — `npm test` will fail because `vitest.config.ts` points `setupFiles` at `src/test/setup.ts`, which does not exist. Create that file (and jsdom/testing-library setup) before adding the first test.

To run a single test file once tests exist: `npx vitest run path/to/file.test.tsx`.

## Architecture

This is a single-purpose lead-capture chat widget for Tritya Aviation Academy, built with Vite + React 18 + TypeScript, styled with Tailwind and shadcn/ui (Radix primitives under `src/components/ui/`, generated per `components.json`).

**Routing is scoped under `/admission-chat`.** `App.tsx` sets `<BrowserRouter basename="/admission-chat">`, and `vite.config.ts` sets `base: "/admission-chat/"`. Routes: `/` → `Index`, `/thank-you` → `ThankYou`, `*` → `NotFound`. `netlify.toml` mirrors this with redirects (root → `/admission-chat`, asset rewrites for `/admission-chat/assets/*`, and an SPA catch-all to `index.html`). If you change the base path in one place, update all three (vite config, router basename, netlify redirects) or deployed routing/assets will break — this has broken and been fixed across several prior commits.

**The whole product is the conversational flow in [src/components/chat/ChatFlow.tsx](src/components/chat/ChatFlow.tsx).** It's a single component driving a linear state machine (`Step` type: `intro → q1 → q2 → q3 → askPhone → askName → askEmail → askPincode → done`):
- Bot messages are typed out sequentially via `botSequence`, gated by a `runIdRef` counter so that stale async sequences (e.g. after a reset) don't push messages into a newer run.
- `q1`/`q2`/`q3` are answered via `OptionButtons` (button taps → `handleOption`); the remaining steps collect free text via the bottom `<input>` form (→ `handleSubmit`), each with inline `validate()` rules (phone regex, name length, email regex, 6-digit pincode).
- Collected fields accumulate in a `lead` object and are POSTed as JSON to `VITE_LEAD_ENDPOINT` (a Google Apps Script web app that writes to the Google Sheet linked in [README.md](README.md)) via a single `useMutation`. There are two submissions per conversation: an early "phone_capture" partial submit right after the phone number is entered (fire-and-forget, errors only logged), and a "final_submit" with the complete lead once the pincode is entered — on success this redirects the browser to `https://airhostessinstitute.com/thank-you/` via `window.location.replace`.
- `resetKey` (bumped by the Restart button in [src/pages/Index.tsx](src/pages/Index.tsx)) is the mechanism for restarting the whole conversation from scratch; it clears state and increments `runIdRef` to invalidate in-flight typing sequences.

**Environment:** `VITE_LEAD_ENDPOINT` (in `.env`) is the Google Apps Script endpoint the chat submits leads to; see [README.md](README.md) for the associated Google Sheet URL.

**Path alias:** `@/` maps to `src/` (configured in `vite.config.ts`, `vitest.config.ts`, and `tsconfig.json`, kept in sync with `components.json` aliases used by shadcn).
