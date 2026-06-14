# CBSE Class 6 NCERT Revision App

Interactive Class 6 revision app for CBSE/NCERT Science, Mathematics, and Social Science.

## Features

- Chapter-wise learning path for Science, Maths, and SST
- Revision summaries, key terms, video search links, and official NCERT references
- Practice papers with autosave/resume
- Maths-specific practical question papers
- Periodic-test paper builder for selected chapters
- School-style PDF downloads with answer sheets at the end
- Ask a Doubt / Chat Tutor with a safe server-side AI API route and local fallback
- Supabase schema for future profile, progress, practice, and chat sync

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Copy `.env.example` to `.env.local`.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

AI_TUTOR_API_URL=
AI_TUTOR_API_KEY=
AI_TUTOR_MODEL=
```

The Chat Tutor works without AI credentials by using the built-in Class 6 fallback tutor. To connect a real provider, use an OpenAI-compatible chat-completions endpoint such as `https://api.openai.com/v1/chat/completions`.

## Supabase

The database schema is in `supabase/migrations/202606140001_class6_revision_schema.sql`.

The current UI stores progress in browser localStorage, while Supabase is prepared for future authenticated sync of student profiles, attempts, and chat sessions.

## Deployment

This app is configured for Vercel with `vercel.json`.
