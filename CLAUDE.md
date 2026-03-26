# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SkillSpaRK is a community skill-sharing platform — "a dating app for skills." Users post what they can teach and what they want to learn; the app surfaces automatic matches when offered skills align with desired skills. Built with React 18 + Vite, Supabase Auth (email/password + Google OAuth), and Supabase Postgres with real-time subscriptions.

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
├── main.jsx            # React root mount (StrictMode)
├── App.jsx             # Auth gate + top-level layout + hero header + sign-out
├── supabase.js         # Supabase client init; exports `supabase`
├── index.css           # Global resets + @keyframes animations (no component styles)
└── components/
    ├── Auth.jsx         # Sign up / sign in / Google OAuth / forgot password
    ├── Board.jsx        # Real-time board + Card sub-component + matching engine
    ├── PostForm.jsx     # New post form; inserts into Supabase `posts` table
    └── FloatingShapes.jsx  # Animated background blobs (pure presentational)
```

Root-level `App.jsx`, `Board.jsx`, `PostForm.jsx`, `Matches.jsx`, `index.css` are **legacy stubs** from an earlier prototype — the live code is in `src/`. The root-level `skillspark.jsx` is the original single-file prototype used as a visual reference.

## Supabase Configuration

**Project ref:** `htkyrwqklqxxfingccqq` (us-east-1)

### Table: `posts` (RLS enabled, realtime enabled)

```sql
id         uuid primary key default gen_random_uuid()
user_id    uuid references auth.users(id) on delete cascade  -- NOT NULL
name       text not null        -- display name (from user_metadata or email prefix)
email      text not null        -- user's email at time of posting
offer      text not null        -- skill they can teach
want       text not null        -- skill they want to learn
note       text default ''      -- optional bio / motivation
community  text default ''      -- optional neighborhood tag
created_at timestamptz default now()  -- ordered desc for feed
```

**Index:** `posts_created_at_idx` on `(created_at desc)`

### RLS Policies

| Policy | Operation | Rule |
|--------|-----------|------|
| Anyone can read posts | SELECT | `auth.uid() IS NOT NULL` (authenticated) |
| Users can insert own posts | INSERT | `auth.uid() = user_id` |
| Users can delete own posts | DELETE | `auth.uid() = user_id` |

### Auth Providers

- **Email/Password** — standard Supabase Auth with optional email confirmation
- **Google OAuth** — requires Google Cloud Console OAuth client ID/secret configured in Supabase Dashboard → Auth → Providers → Google
- **Password Reset** — uses `supabase.auth.resetPasswordForEmail()` with redirect to `window.location.origin`

## Key Patterns

### Auth State

`App.jsx` calls `supabase.auth.getSession()` on mount and subscribes via `onAuthStateChange`. The `user` state uses a three-value convention:
- `undefined` → loading (show spinner)
- `null` → logged out (show `<Auth />`)
- `object` → logged in (show main app)

### Auth Component Modes

`Auth.jsx` manages three modes via `mode` state:
- `"login"` — email/password sign in + Google button + "Forgot password?" link
- `"signup"` — email/password sign up with optional name + Google button
- `"forgot"` — email-only form that sends password reset link

### Real-Time Board

`Board.jsx` fetches posts on mount via `supabase.from("posts").select("*").order("created_at", { ascending: false })`, then subscribes to Supabase Realtime channel (`postgres_changes` on the `posts` table, all events). On any change, it refetches the full list.

### Matching Algorithm

`getMatches(posts)` in `Board.jsx` is O(n²), runs client-side on every render. It produces a `matchMap: { [postId]: string[] }` mapping each post to names of users whose `want` exactly matches that post's `offer` (case-insensitive, trimmed). Displayed as a "✨ Spark!" gradient badge on the card.

### Deterministic Styling Helpers

All hash-based (no randomness) — same input always produces same output:
- `getAvatar(name)` → emoji from 15-element `AVATARS` array
- `getCardColor(id)` → pastel `{ bg, border }` from 7-element `CARD_COLORS` array
- `getEmoji(skill)` → keyword match against `SKILL_EMOJIS` map, fallback to hash-selected emoji

### Styling Conventions

- **All component styles are inline objects** — no CSS files per component, no Tailwind, no CSS modules
- **Fonts:** Nunito (body) + Fredoka (headings) loaded via Google Fonts `@import` in `index.css`
- **Animations:** `popUp`, `blobFloat`, `wiggle`, `slideIn`, `spin` defined as `@keyframes` in `src/index.css`
- **Color palette:** pastel gradients, 7 card color pairs, pink/purple/blue accent gradient for buttons

### Owner Actions

Cards check `post.user_id === user.id` (Supabase uses `user_id` snake_case and `user.id`). Owners see a "Your Spark" badge and ✕ delete button. Deletion calls `supabase.from("posts").delete().eq("id", postId)` — also enforced server-side by RLS policy.

## Environment Variables

All prefixed with `VITE_` so Vite exposes them to the browser bundle:

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL (e.g. `https://xxx.supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key (safe for client) |

Must also be set in Vercel project settings → Environment Variables for production.

## Deployment

- **Vercel** — auto-deploys from GitHub on push to `main`
- Build command: `npm run build`
- Output directory: `dist`
- Framework preset: Vite
