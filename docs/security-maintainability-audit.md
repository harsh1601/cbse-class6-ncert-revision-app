# Security and Maintainability Audit

Date: 2026-06-14

Scope: Clean deployed repository at `/tmp/cbse-class6-ncert-revision-app`.

No application code changes were made as part of this audit.

## Executive Summary

Overall risk: **Medium**.

The application is in reasonable shape for an MVP. It does not expose real API keys in frontend code, avoids raw HTML injection patterns, and TypeScript checks pass. The main risks are around production hardening: public AI API abuse protection, dependency reproducibility, security headers, and future Supabase user-data policies.

## Positive Findings

- API credentials are read only from server-side environment variables in `app/api/chat-tutor/route.ts`.
- No committed real `.env` files were found in the clean deployed repo.
- No `dangerouslySetInnerHTML`, `eval`, or `new Function` usage was found.
- Chat, profile, question, and answer text are rendered through React, which escapes text by default.
- The deployed repo does not include local database files, Python cache files, or generated workspace artifacts.
- `tsc --noEmit` passes.

## Findings and Recommendations

### P1: Chat Tutor API Has No Rate Limiting or Abuse Protection

File: `app/api/chat-tutor/route.ts`

The public `POST /api/chat-tutor` endpoint accepts requests from anyone and can call a paid AI provider when configured. It caps individual message length and message count, but it does not include rate limiting, provider timeout handling, per-session quotas, or request-size protection.

Risk:

- A bot or accidental loop could generate high AI-provider costs.
- Slow provider responses could tie up serverless execution.
- Public abuse could degrade availability for students.

Recommended changes:

- Add per-IP or per-session rate limiting.
- Add request timeouts with `AbortController`.
- Enforce a maximum request body size.
- Consider daily quotas for unauthenticated usage.
- Return a child-friendly retry message when limits are reached.

Suggested tools:

- Upstash Redis, Vercel KV-style storage, or another low-latency store for counters.

### P1: Missing Lockfile and Non-Reproducible Installs

Files:

- `package.json`
- `vercel.json`

The repository does not include a lockfile. `vercel.json` currently uses `npm install`, which can install different dependency versions over time because `package.json` uses semver ranges.

Risk:

- Builds may change without source-code changes.
- Dependency audits cannot run reliably without a lockfile.
- Security patches and regressions are harder to track.

Recommended changes:

- Generate and commit `package-lock.json`.
- Change Vercel install command from `npm install` to `npm ci`.
- Run dependency audits in CI.
- Update Next/PostCSS to patched compatible versions.

Audit note:

A temporary audit-only lockfile was generated outside the repo. It reported two moderate findings tied to Next/PostCSS:

- `postcss`: GHSA-qx2v-qp2m-jg93, XSS via unescaped `</style>` in CSS stringify output.
- `next`: affected transitively through bundled PostCSS.

### P2: Security Headers Are Not Configured

File: `next.config.ts`

The Next config only enables React strict mode. The app does not explicitly set common security headers.

Risk:

- Browser protections are weaker than they need to be.
- Clickjacking, MIME sniffing, permissive referrer behavior, and broad browser permissions are not explicitly constrained.

Recommended changes:

Add baseline security headers through `next.config.ts`, including:

- `Content-Security-Policy`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy`
- `Permissions-Policy`
- `X-Frame-Options` or CSP `frame-ancestors`

Implementation note:

Start with a conservative CSP compatible with Next.js and Vercel, then tighten it after verifying the app and external links.

### P2: Chat API Trusts Client-Supplied Context

File: `app/api/chat-tutor/route.ts`

The API sanitizes chat messages but accepts `body.context` from the client and forwards that context into the AI prompt. A direct API caller can forge context fields.

Risk:

- Prompt context can be manipulated.
- Future context expansion could accidentally allow prompt injection or excessive token usage.

Recommended changes:

- Send only `chapterId` from the frontend.
- Derive `subjectTitle`, `chapterTitle`, and `chapterNumber` on the server from trusted local content.
- If free-form context is kept, cap each field length and strip unexpected fields.

### P2: Child-Facing AI Safety Is Too Lightweight for Production

Files:

- `features/chat/mockTutor.ts`
- `features/chat/tutorPrompt.ts`
- `app/api/chat-tutor/route.ts`

The current safety layer uses a short keyword list and a tutor prompt. This is acceptable for the built-in mock tutor, but it is not strong enough for a production AI tutor used by children.

Risk:

- Unsafe or inappropriate content may not be blocked.
- Prompt injection may bypass intended tutoring behavior.
- Advanced or non-study questions may receive inconsistent responses.

Recommended changes:

- Add provider-side moderation or a server-side moderation step.
- Expand age-appropriate refusal handling.
- Add tests for unsafe prompts, unrelated prompts, and prompt-injection attempts.
- Keep the system prompt server-side only.

### P2: Supabase Schema Is Not Ready for Authenticated Student Data

File: `supabase/migrations/202606140001_class6_revision_schema.sql`

RLS is enabled for student-owned tables, and public read policies exist only for `subjects` and `chapters`. This prevents broad public reads/writes today, but the student-owned tables do not yet include a `user_id` tied to `auth.users`, nor do they define user-scoped CRUD policies.

Risk:

- Future sync work may fail because authenticated users cannot access their own records.
- Developers may be tempted to add broad policies later to make sync work quickly.

Recommended changes:

- Add `user_id uuid references auth.users(id)` to student-owned tables.
- Add strict policies using `auth.uid() = user_id`.
- Keep public read access only for non-sensitive reference data.
- Add migration tests or SQL policy checks before enabling frontend sync.

### P3: Student Progress Is Stored in LocalStorage

File: `lib/progress.ts`

The app stores student profile, practice drafts, progress, attempts, and game scores in browser `localStorage`.

Risk:

- Data is not encrypted.
- Any script running on the same origin can read the data.
- Data persists until cleared manually.

Current context:

This is acceptable for a local-only MVP if users understand that data stays in the browser.

Recommended changes:

- Add clear privacy text in the UI.
- Add data versioning and optional expiry for drafts.
- Keep sensitive data out of localStorage.
- Move authenticated sync to Supabase after user-scoped RLS is complete.

### P3: Maintainability Hotspots

Files:

- `features/biology/content.ts`
- `features/practice/PracticeClient.tsx`
- `features/practice/pdf.ts`

Several files combine multiple responsibilities:

- `features/biology/content.ts` contains subject data, chapter data, question generation, and helper functions.
- `features/practice/PracticeClient.tsx` handles UI, grading, autosave, draft restore, validation, and result state.
- `features/practice/pdf.ts` implements a custom PDF writer and question-paper formatting in one module.

Risk:

- Future changes will be harder to test safely.
- Bugs in grading or paper generation may be introduced during UI changes.
- Subject expansion will make the content module increasingly difficult to maintain.

Recommended changes:

- Split subject content into subject-specific files.
- Move grading and written-answer validation into pure utility modules.
- Move practice UI panels into smaller components.
- Add unit tests for grading, paper generation, PDF generation, and periodic-test selection.

### P3: Lint Script Only Runs TypeScript

File: `package.json`

The `lint` script currently runs `tsc --noEmit`, so it does not enforce React, accessibility, security, or style rules.

Risk:

- Maintainability and accessibility regressions may go unnoticed.
- Unsafe patterns are harder to catch automatically.

Recommended changes:

- Configure ESLint for Next.js and React.
- Add accessibility linting where practical.
- Add CI checks for:
  - `npm ci`
  - `npm run typecheck`
  - `npm run lint`
  - `npm run build`

## Verification Performed

- Static search for dangerous patterns:
  - No `dangerouslySetInnerHTML`
  - No `eval`
  - No `new Function`
  - No committed real `.env` files in the clean repo
  - No frontend API-key exposure found
- TypeScript verification:
  - `tsc --noEmit` passed.
- Dependency audit:
  - A direct audit in the repo was blocked because there is no lockfile.
  - A temporary audit-only lockfile was generated outside the repo.
  - Result: 2 moderate vulnerabilities tied to Next/PostCSS.
- Workspace hygiene:
  - Clean deployed repo is small and does not contain local database/cache artifacts.
  - Original local workspace contains unrelated Python/database/generated files; avoid using that folder as the deployment source.

## Recommended Remediation Order

1. Add lockfile, switch Vercel to `npm ci`, update vulnerable dependencies.
2. Add rate limiting and timeout handling to the Chat Tutor API.
3. Add baseline security headers.
4. Make Chat Tutor context server-derived.
5. Strengthen child-safety moderation for real AI usage.
6. Prepare Supabase authenticated ownership policies before enabling sync.
7. Split large modules and add targeted tests.
8. Configure proper linting and CI checks.

## Current Public Deployment

Production URL:

https://cbse-class6-ncert-revision-app.vercel.app
