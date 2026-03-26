# ⚡ SkillSpaRK

### 🎯 *Teach what you know. Learn what you don't. Trade skills with your community.*

SkillSpaRK is a community-driven skill-sharing platform — think **dating app, but for skills** 💡
Post what you can teach 🎓 and what you want to learn 🌱, and the app automatically **sparks connections** when your offer matches someone else's need. No money. Just skills. Just community. Just vibes. ✨

---

## 🧬 Stack

| 🔧 Layer | 🛠️ Tech |
|----------|---------|
| ⚛️ Frontend | React 18 + Vite |
| 🔐 Auth | Supabase Auth (email/password + Google OAuth) |
| 🗄️ Database | Supabase Postgres (real-time subscriptions) |
| 🚀 Deploy | Vercel |

---

## 🌟 Features

| Feature | Description |
|---------|-------------|
| 🔐 **Auth** | Sign up / sign in with email & password, or **connect with Google** |
| 📧 **Forgot Password** | One-click password reset via email |
| ⚡ **Post a Spark** | Share what you teach + want to learn, with optional bio & neighborhood |
| 🌍 **Live Board** | Real-time card feed — powered by Supabase Realtime (Postgres changes) |
| ✨ **Spark Matching** | Auto-badge when someone wants to learn exactly what you offer |
| 🔍 **Search & Filter** | Filter by teaching 🎓, learning 🌱, or search by name / skill / hood |
| 🗑️ **Delete Your Posts** | Owners see a ✕ button — enforced server-side by RLS |
| 🎨 **Colorful UI** | Pastel cards, animated blobs, emoji avatars, Nunito + Fredoka fonts |

---

## 🚀 Quick Start

```bash
# 1️⃣  Clone it
git clone https://github.com/CarlosFranzetti/SkillSpark.git
cd SkillSpark

# 2️⃣  Install deps
npm install

# 3️⃣  Add your Supabase config
cp .env.example .env
# 👆 Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

# 4️⃣  Fire it up
npm run dev
```

🎉 Open **http://localhost:5173** and start sparking!

---

## 🔐 Supabase Setup

### 📋 Database
The app needs a `posts` table in Supabase with RLS enabled. The migration creates:
- `id` (uuid), `user_id` (references auth.users), `name`, `email`, `offer`, `want`, `note`, `community`, `created_at`
- **RLS policies**: authenticated read all, insert own, delete own

### 🔑 Google OAuth (optional)
To enable "Continue with Google":
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → Create OAuth 2.0 Client ID
2. Set authorized redirect URI to: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
3. In Supabase Dashboard → **Auth → Providers → Google** → paste Client ID + Secret → Enable

### 📧 Email Confirmation
For easier dev/testing, go to Supabase Dashboard → **Auth → Providers → Email** → toggle off "Confirm email"

---

## 🌐 Deploy to Vercel

Set these environment variables in **Vercel → Project Settings → Environment Variables**:

```
VITE_SUPABASE_URL=https://your-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

| Setting | Value |
|---------|-------|
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Framework | Vite |

---

## 🏗️ Architecture

```
src/
├── main.jsx              # 🏠 React root
├── App.jsx               # 🚪 Auth gate + hero header + layout
├── supabase.js           # 🔌 Supabase client init
├── index.css             # 🎬 Global animations (popUp, blobFloat, wiggle, slideIn)
└── components/
    ├── Auth.jsx           # 🔐 Login / Signup / Google / Forgot Password
    ├── Board.jsx          # 📋 Real-time board + Card + matching engine
    ├── PostForm.jsx       # ✏️ New post form → Supabase insert
    └── FloatingShapes.jsx # 🫧 Animated background decorations
```

---

## 💜 Contributing

Got an idea that makes skill swaps easier, safer, or more fun? 🤗

- 🐛 Open an issue with your suggestion
- 🔧 Or make a small improvement and share it

Let's build a board that helps people **learn together** — for real. ❤️

---

<p align="center">
  Made with 💜 by <a href="https://github.com/CarlosFranzetti">Carlos Franzetti</a>
  <br/>
  <em>SkillSpaRK: Community knowledge, one spark at a time. ⚡</em>
</p>
