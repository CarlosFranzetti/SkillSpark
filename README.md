# SkillSpaRK ⚡

**Teach what you know. Learn what you don't. Trade skills with your community.**

SkillSpaRK is a community-driven skill-sharing platform — like a dating app for skills. Users post what they can teach and what they want to learn, and the app automatically sparks connections when offers match needs.

---

## Stack

| Layer    | Tech                            |
|----------|---------------------------------|
| Frontend | React 18 + Vite                 |
| Auth     | Supabase Auth (email/password)  |
| Database | Supabase Postgres (real-time)   |
| Deploy   | Vercel                          |

---

## Features

- **Auth** — sign up / sign in with email and password
- **Post a Spark** — share what you teach and what you want to learn, with an optional bio and neighborhood tag
- **Live Board** — real-time card feed powered by Supabase Realtime (Postgres changes)
- **Spark Matching** — automatic badge when someone else wants to learn exactly what you offer
- **Search & Filter** — filter by teaching, learning, or search by name / skill / neighborhood
- **Delete your own posts** — owners see a ✕ button on their cards (enforced by RLS)

---

## Local Development

```bash
# 1. Clone
git clone https://github.com/CarlosFranzetti/SkillSpark.git
cd SkillSpark

# 2. Install deps
npm install

# 3. Add Supabase config
cp .env.example .env
# Fill in your Supabase project URL and anon key in .env

# 4. Run dev server
npm run dev
```

---

## Deployment (Vercel)

Set these environment variables in your Vercel project settings:

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

Build command: `npm run build`
Output directory: `dist`

---

## Contributing

Open an issue with your idea, or make a small improvement and share it. Let's build a board that helps people learn together — for real. ❤️
