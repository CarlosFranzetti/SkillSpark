# SkillSpaRK ⚡

**Teach what you know. Learn what you don't. Trade skills with your community.**

SkillSpaRK is a community-driven skill-sharing platform — like a dating app for skills. Users post what they can teach and what they want to learn, and the app automatically sparks connections when offers match needs.

---

## Stack

| Layer    | Tech                               |
|----------|------------------------------------|
| Frontend | React 18 + Vite                    |
| Auth     | Firebase Authentication (email/pw) |
| Database | Cloud Firestore (real-time)        |
| Deploy   | Vercel                             |

---

## Features

- **Auth** — sign up / sign in with email and password
- **Post a Spark** — share what you teach and what you want to learn, with an optional bio and neighborhood tag
- **Live Board** — real-time card feed powered by Firestore `onSnapshot`
- **Spark Matching** — automatic badge when someone else wants to learn exactly what you offer
- **Search & Filter** — filter by teaching, learning, or search by name / skill / neighborhood
- **Delete your own posts** — owners see a ✕ button on their cards

---

## Local Development

```bash
# 1. Clone
git clone https://github.com/CarlosFranzetti/SkillSpark.git
cd SkillSpark

# 2. Install deps
npm install

# 3. Add Firebase config
cp .env.example .env
# Fill in your Firebase project values in .env

# 4. Run dev server
npm run dev
```

### Firebase setup

1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Enable **Authentication → Email/Password**
3. Create a **Firestore** database (start in test mode or add security rules)
4. Copy your web app SDK config values into `.env`

### Firestore security rules (recommended)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

---

## Deployment (Vercel)

Set the following environment variables in your Vercel project settings (same keys as `.env.example`):

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

Build command: `npm run build`
Output directory: `dist`

---

## Contributing

Open an issue with your idea, or make a small improvement and share it. Let's build a board that helps people learn together — for real. ❤️
