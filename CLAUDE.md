# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SkillSpaRK is a community skill-sharing platform — "a dating app for skills." Users post what they can teach and what they want to learn; the app surfaces automatic matches when offered skills align with desired skills. Built with React + Vite, Firebase Auth, and Firestore.

## Dev Commands

```bash
npm install       # install deps (first time)
npm run dev       # start dev server at localhost:5173
npm run build     # production build → dist/
npm run preview   # serve the production build locally
```

Requires a `.env` file with Firebase config (see `.env.example`).

## Architecture

```
src/
├── main.jsx            # React root mount
├── App.jsx             # Auth gate + top-level layout + hero header
├── firebase.js         # Firebase app init; exports auth and db
├── index.css           # Global resets + @keyframes animations (no component styles here)
└── components/
    ├── Auth.jsx         # Sign up / sign in form; calls Firebase Auth directly
    ├── Board.jsx        # Firestore real-time board + Card sub-component
    ├── PostForm.jsx     # New post form; writes to Firestore `posts` collection
    └── FloatingShapes.jsx  # Animated background blobs (pure presentational)
```

Root-level `App.jsx`, `Board.jsx`, `PostForm.jsx`, `Matches.jsx` are **legacy stubs** — the live code is in `src/`.

## Firebase Data Model

**Collection: `posts`**
```js
{
  name:      string,     // from user.displayName or derived from email
  email:     string,
  userId:    string,     // Firebase Auth uid — used for ownership checks
  offer:     string,     // skill they can teach (required)
  want:      string,     // skill they want to learn (required)
  note:      string,     // optional bio
  community: string,     // optional neighborhood
  createdAt: Timestamp,  // serverTimestamp() — used for ordering
}
```

## Key Patterns

**Auth state** — `App.jsx` uses `onAuthStateChanged`; `user === undefined` means loading, `user === null` means logged out. Logged-out state renders `<Auth />`.

**Real-time board** — `Board.jsx` subscribes to Firestore via `onSnapshot` (query ordered by `createdAt desc`). No manual refresh needed.

**Matching algorithm** — `getMatches(posts)` in `Board.jsx` is O(n²), runs in-browser on every render. It produces a `matchMap: { [postId]: string[] }` mapping each post to names of users who want to learn that skill. Match is exact case-insensitive string equality on `offer === want`.

**Styling** — all component styles are inline objects. Global animations (`popUp`, `blobFloat`, `wiggle`, `slideIn`, `spin`) live in `src/index.css`. Color palettes and emoji maps are defined as module-level constants in `Board.jsx`.

**Owner actions** — cards check `post.userId === user.uid`; owners see a delete button that calls `deleteDoc`.

## Environment Variables

All prefixed with `VITE_` so Vite exposes them to the browser bundle. See `.env.example` for the full list. Must also be set in Vercel project settings for production.
