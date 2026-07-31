# SAFE BEACON Dashboard — Setup Guide

This is the real-time web dashboard. It connects directly to the same
Firestore database your backend (`safe-beacon-backend`) writes to — no
changes needed on the backend side.

## Step 1: Register a Web App in Firebase

Your backend used a **service account** (admin access). The dashboard
needs a different, public-safe credential called a **web config**:

1. Firebase Console → gear icon → **Project Settings**
2. Scroll to **"Your apps"**
3. Click the **`</>`** (Web) icon to register a new web app
4. Give it a nickname, e.g. "safe-beacon-dashboard" (no need to check
   "Firebase Hosting" unless you want it)
5. Firebase will show a code block with `apiKey`, `authDomain`,
   `projectId`, etc. — keep this tab open, you'll need these values next

## Step 2: Configure environment variables

```
cp .env.example .env
```

Open `.env` and paste in the matching values from Step 1. These values
are safe to expose in frontend code — they identify your project, they
don't grant access by themselves (Firestore Security Rules control that).

## Step 3: Install dependencies

```
npm install
```

## Step 4: Run it locally

```
npm run dev
```

This starts a local dev server (usually `http://localhost:5173`). Open
that URL in your browser.

## Step 5: See it update in real time

With the dashboard open in your browser, go to your **backend** folder
in a terminal and run:

```
node mockGpsSender.js
```

Within a second or two, a new alert card should appear in the dashboard's
left-hand feed automatically — no page refresh. Click it to see the map
marker and detail panel update.

Try `node mockGpsSender.js --interval` for a continuous stream if you
want to demo the "live" feel to your supervisor or panel.

## Step 6: Deploy to Vercel (for your final demo link)

1. Push this folder to a GitHub repo
2. Go to https://vercel.com → "Add New Project" → import the repo
3. In the Vercel project settings, add the same environment variables
   from your `.env` file (Settings → Environment Variables)
4. Deploy — Vercel will give you a public URL you can share with your
   panel, no installation required on their end

## What this proves for your defense

- A real-time web dashboard that updates without polling or refresh
- Clean separation between backend (admin, server-side) and frontend
  (public, client-side) Firebase credentials — a legitimate architecture
  decision you can explain if asked
- A working map visualization of alert coordinates
- The same document shape used end-to-end: mock data now, real Arduino
  data later, no changes required on this side
