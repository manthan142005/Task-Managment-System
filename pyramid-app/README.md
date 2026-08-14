# Pyramid — Task Management System

A full-stack task/project management app built with **Next.js (App Router)**,
**NestJS**, **Prisma + SQLite**, and **Tailwind CSS**, replicating the provided
Figma design ("Pyramid").

## What's implemented

- **Guest login** (creates a real user + JWT session, cookie-based)
- **Tasks** — list view (grouped by status, searchable, column visibility via
  the Fields dropdown) and **board view** (Kanban columns: To Do / Doing /
  On Hold / Completed)
- **Task detail page** — status & priority dropdowns (persisted + logged),
  members, due date, reporter, subtasks table, comments thread, activity log
- **Projects** — list + drill-in to a project's tasks with breadcrumb nav
- **Theme system** — light/dark/system + 6 color modes (Amber, Blue, Pink,
  Rose, Emerald, Black), persisted to `localStorage` **and** synced to the
  backend so it follows the user across devices/refreshes
- **Settings** — Profile (name, title, username) and Theme pages
- Clean NestJS module boundaries (auth / users / projects / tasks), DTO
  validation with `class-validator`, Prisma relations for members/labels/
  subtasks/comments/activity

## What's intentionally stubbed (documented per assignment instructions)

- **"Login with Google"** button is present but disabled — wiring real OAuth
  needs a Google Cloud project + client ID, which only you can create. The
  backend endpoint (`POST /auth/google`) already exists; see "Enabling
  Google login" below.
- **Drag-and-drop** on the Kanban board isn't wired yet — `@dnd-kit` is
  already a dependency; the board renders correctly, drag handlers are the
  next piece to add (see `components/StatusColumn.tsx`).
- **Add Task** currently uses a `prompt()` for speed — swap for a proper
  modal/form component for full design fidelity.
- Member/label pickers on the task detail page display data but don't yet
  have their own "add" UI — the API (`PATCH /tasks/:id/members`, `/labels`)
  is ready to wire up.

## Getting started

You'll need Node.js 18+ installed locally (this sandbox has no internet
access, so `npm install` must be run on your machine).

### 1. Backend

```bash
cd backend
cp .env.example .env          # edit JWT_SECRET if you like
npm install
npx prisma migrate dev --name init   # creates dev.db and applies the schema
npm run start:dev             # runs on http://localhost:4000/api
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev                   # runs on http://localhost:3000
```

Open http://localhost:3000 — you'll land on `/login`, click **Continue as
Guest**, and you're in.

## Enabling Google login (optional)

1. Create OAuth credentials at https://console.cloud.google.com/apis/credentials
2. Add Google Identity Services on the frontend login button to get an ID
   token client-side
3. POST that token (or the decoded email/name) to `/auth/google` — the
   backend already creates/looks up the user and issues a session cookie
4. For production, verify the ID token server-side with
   `google-auth-library` instead of trusting the client-sent email (the
   current stub trusts it, which is fine for a guest-login-first demo but
   should be hardened before real use)

## Architecture notes (for the interview)

- **Why Prisma + SQLite for dev:** zero external services to stand up while
  building; swap `DATABASE_URL` to a Postgres connection string and change
  the `provider` in `schema.prisma` to `postgresql` for production — no
  application code changes needed.
- **Why cookie-based JWT over localStorage tokens:** avoids exposing the
  token to XSS, and `credentials: 'include'` on every fetch keeps the
  frontend simple.
- **Why the activity log is generated server-side in `tasks.service.ts`
  rather than client-side:** the server is the source of truth for "what
  actually changed," so the log can't be spoofed or missed by a client that
  forgot to log an action.

## Deploying

- **Frontend:** Vercel (zero-config for Next.js). Set `NEXT_PUBLIC_API_URL`
  to your deployed backend's `/api` URL.
- **Backend:** Railway or Render. Set `DATABASE_URL` to a managed Postgres
  instance, `JWT_SECRET`, and `FRONTEND_URL` (for CORS) as environment
  variables.

## Part 2 — Product Understanding

Add your AbleSpace "Take Data" screen writeup/video here, or as a separate
file (`PART2.md` or a video link), per the assignment's submission
guidelines.
