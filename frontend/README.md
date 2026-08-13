# PulseChat — Frontend

A frontend-only scaffold for PulseChat, a real-time team chat app (Discord/Slack-style), built from the PulseChat Frontend PRD.

## Stack
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4 (custom design tokens, no default theme)
- Hand-built shadcn/ui-style component library on Radix UI primitives
  (the `shadcn` CLI needs network access that wasn't available while
  scaffolding, so components in `components/ui` were written by hand in
  the same style/API — they're drop-in compatible if you later run
  `npx shadcn add` for anything additional)
- TanStack Query, React Hook Form + Zod, Axios, Lucide icons

## Getting started
```bash
npm install
npm run dev
```
Visit http://localhost:3000 — it redirects to `/dashboard`.

## What's implemented
- **Auth**: login, register, forgot password, reset password, session-expired,
  all with client-side Zod validation
- **Home dashboard**: workspace grid, recent conversations, pinned channels,
  activity feed
- **Main chat layout**: server rail, collapsible channel sidebar with
  favorites/categories/unread badges, message list with grouping + infinite
  scroll trigger + typing indicator, composer with drag-and-drop/paste
  attachments, emoji picker, members sidebar with presence grouping
- **Global search** (⌘K) and a **notifications** popover
- **Settings**: profile, appearance (light/dark/system theme), notifications,
  privacy, and security tabs

## What's intentionally not implemented
Per the PRD, this is a **frontend-only** scaffold:
- No backend, database, or auth logic — `api/*` defines typed request
  functions against a placeholder base URL (`NEXT_PUBLIC_API_URL`)
- No real-time transport (WebSocket) — typing indicators and live updates
  are stubbed with `TODO` comments marking where they'd hook in
- UI is currently populated from `constants/mock-data.ts` fixture data;
  swap components over to the TanStack Query hooks backed by `api/*` once
  a real backend exists

## Design notes
Dark-first, with a violet accent (`--accent`) distinct from the usual
"chat app blurple." The signature motif is the `PulseWaveform` component
(`components/ui/pulse-waveform.tsx`) — a small animated 3-bar waveform
used for typing/presence/voice-activity instead of a generic dot, tying
back to the product name.
