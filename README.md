# ShowingKit

A multi-page field kit for renters and first-time buyers. Listing photos hide leaks, flex bedrooms, and fake parking. ShowingKit turns a 15–20 minute walkthrough into a same-day **Walk / Negotiate / Offer** brief.

This is a demo: mock auth, seeded showings (Troutman, East Village, Silver Lake, Balham), city habitability heuristics. Advisory only — not a licensed inspection.

## What it does

1. File a showing from listing text and photos.
2. Get a timed room-by-room script with exact shots.
3. Upload visit stills, broker quotes, gut sliders.
4. Diff listing vs visit, score risk, estimate a dollar range, stamp a one-page brief plus three texts to send the listing agent.

## Stack

TanStack Start, React Router (file routes), Tailwind v4, Zustand. Data stays in the browser.

## Run locally

Requires **Node 20+**. In the repo root:

```bash
npm install
npm run dev
```

Open [http://localhost:8080](http://localhost:8080). Demo login: **Continue as demo user**.

If you see `spawn vite ENOENT` or `failed to run vite: not found`, dependencies are not installed. Run `npm install` in this folder (not a parent folder), then `npm run dev` again.

## Routes

Public: `/` `/how-it-works` `/features` `/pricing` `/cities` `/guides` `/sample-brief` `/faq` `/about` `/legal/*` `/login` `/signup`

App: `/app` `/app/showings` `/app/showings/new` `/app/showings/:id/{script,evidence,brief,texts}` `/app/compare` `/app/templates` `/app/dealbreakers` `/app/calendar` `/app/glossary` `/app/settings`

## License

Private demo. Not for production legal advice.
