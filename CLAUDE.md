# CLAUDE.md

Context file for AI coding assistants (Claude, Copilot, etc.) working on this repository.

## Project

**SnippetVault** — a code snippet library with login. Users sign in with GitHub, save
code snippets, organize them with tags and a language label, and search/filter them.

Built during the Graffish Labs internship, as the capstone project of the "Prompting &
AI Tools" course.

## Tech Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** for styling
- **Prisma** + **PostgreSQL** for the database
- **NextAuth (Auth.js) v4** with the GitHub provider, database session strategy
- **Vitest** for unit tests

## Project Structure

```
src/
  app/
    page.tsx                  # dashboard: list + search/filter snippets
    layout.tsx                # root layout, includes Navbar
    snippets/new/page.tsx     # create snippet form
    snippets/[id]/page.tsx    # view/edit/delete a snippet
    api/
      auth/[...nextauth]/     # NextAuth route handler
      snippets/route.ts       # GET (list+filter), POST (create)
      snippets/[id]/route.ts  # GET, PUT, DELETE one snippet
  components/                 # UI components (client components marked "use client")
  lib/
    prisma.ts                 # Prisma client singleton
    auth.ts                   # NextAuth config (authOptions)
    tags.ts                   # parseTags() - pure function, unit tested
    filter.ts                 # filterSnippets() - pure function, unit tested
prisma/schema.prisma          # DB schema (User/Account/Session for auth + Snippet/Tag)
tests/                        # Vitest unit tests for the pure lib functions
```

## Conventions

- **Ownership checks matter**: every snippet read/update/delete must verify
  `snippet.userId === session.user.id`. Never trust a client-supplied user id.
- **Server-first**: pages that read data are React Server Components by default.
  Only mark a component `"use client"` when it needs state, effects, or event handlers
  (forms, buttons that call `fetch`).
- **API routes return JSON with proper status codes**: `401` unauthorized, `404` not
  found (including "not yours"), `400` for validation errors.
- **Business logic that can be tested without a database goes in `src/lib/` as a pure
  function** (see `tags.ts`, `filter.ts`), so it can be unit tested with Vitest without
  mocking Prisma.
- **Tailwind only** for styling — no CSS modules, no styled-components. Brand color is
  `brand` / `brand-hover` (see `tailwind.config.ts`).
- **Git workflow**: every feature on its own branch, merged via reviewed Pull Request.
  Never commit directly to `main`. `main` must always be in a working state.

## Environment Variables

See `.env.example`. Required: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`,
`GITHUB_ID`, `GITHUB_SECRET`.

## Commands

```bash
npm install       # installs deps and runs `prisma generate`
npx prisma db push    # sync the schema to your database (no migration history)
npx prisma migrate dev --name init   # or: create a tracked migration
npm run dev        # local dev server
npm run test        # run the Vitest unit tests
npm run build       # production build
```

## Known Limitations / Next Steps

- No pagination yet on the snippets list (fine for personal use, not for hundreds of
  snippets).
- No syntax highlighting in the code textarea/viewer yet.
- Tags are global (not scoped per user) — two users sharing a tag name is intentional
  (keeps tag search simple), but worth revisiting if privacy of tag names ever matters.
- Quiz-style features, sharing snippets publicly, and syntax highlighting are natural
  follow-ups but out of scope for the internship capstone.
