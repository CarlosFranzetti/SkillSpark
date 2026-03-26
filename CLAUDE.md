# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SkillSpaRK is a community skill-sharing platform — "a dating app for skills." Users post what they can teach and what they want to learn; the app surfaces automatic matches when offered skills align with desired skills. Built with React + Vite, Supabase Auth, and Supabase Postgres.

## Dev Commands

```bash
npm install       # install deps (first time)
npm run dev       # start dev server at localhost:5173
npm run build     # production build → dist/
npm run preview   # serve the production build locally
```

Requires a `.env` file with Supabase config (see `.env.example`).

## Architecture

```
src/
├── main.jsx            # React root mount
├── App.jsx             # Auth gate + top-level layout + hero header
├── supabase.js         # Supabase client init; exports supabase
├── index.css           # Global resets + @keyframes animations (no component styles here)
└── components/
    ├── Auth.jsx         # Sign up / sign in form; calls Supabase Auth
    ├── Board.jsx        # Supabase real-time board + Card sub-component
    ├── PostForm.jsx     # New post form; inserts into Supabase `posts` table
    └── FloatingShapes.jsx  # Animated background blobs (pure presentational)
```

Root-level `App.jsx`, `Board.jsx`, `PostForm.jsx`, `Matches.jsx` are **legacy stubs** — the live code is in `src/`.

## Supabase Data Model

**Table: `posts`** (with RLS enabled)
```sql
id         uuid primary key default gen_random_uuid()
user_id    uuid references auth.users(id) on delete cascade
name       text        -- display name (from user_metadata or email)
email      text
offer      text        -- skill they can teach (required)
want       text        -- skill they want to learn (required)
note       text        -- optional bio
community  text        -- optional neighborhood
created_at timestamptz -- default now(), ordered desc
```

**RLS policies:** authenticated users can read all posts, insert their own (`auth.uid() = user_id`), and delete their own.

## Key Patterns

**Auth state** — `App.jsx` calls `supabase.auth.getSession()` on mount and subscribes via `onAuthStateChange`; `user === undefined` means loading, `user === null` means logged out. Logged-out state renders `<Auth />`.

**Real-time board** — `Board.jsx` fetches posts on mount, then subscribes to Supabase Realtime (`postgres_changes` on the `posts` table) to refetch on any insert/update/delete.

**Matching algorithm** — `getMatches(posts)` in `Board.jsx` is O(n²), runs in-browser on every render. It produces a `matchMap: { [postId]: string[] }` mapping each post to names of users who want to learn that skill. Match is exact case-insensitive string equality on `offer === want`.

**Styling** — all component styles are inline objects. Global animations (`popUp`, `blobFloat`, `wiggle`, `slideIn`, `spin`) live in `src/index.css`. Color palettes and emoji maps are defined as module-level constants in `Board.jsx`.

**Owner actions** — cards check `post.user_id === user.id`; owners see a delete button. Deletion is also enforced server-side by RLS.

## Environment Variables

All prefixed with `VITE_` so Vite exposes them to the browser bundle. See `.env.example` for the full list. Must also be set in Vercel project settings for production.
