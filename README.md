# SnippetVault

A code snippet library with login. Save, tag, and search your code snippets from one
place.

## About the Project

SnippetVault lets you sign in with GitHub and keep a personal, searchable library of
code snippets. Every snippet has a title, a language, optional tags, and the code
itself. Built as the capstone project for the Graffish Labs internship.

## Features

- Sign in with GitHub (Auth.js / NextAuth)
- Create, view, edit, and delete snippets (full CRUD)
- Tag snippets and filter by tag, language, or free-text search
- Each user only ever sees and manages their own snippets
- Responsive UI (Tailwind CSS)
- Unit-tested core logic (Vitest)

## Tech Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Prisma · PostgreSQL ·
NextAuth (Auth.js) · Vitest

## Getting Started

### Prerequisites

- Node.js 18+
- A PostgreSQL database (e.g. free tier on [Neon](https://neon.tech) or
  [Supabase](https://supabase.com))
- A GitHub OAuth App (create one at
  [github.com/settings/developers](https://github.com/settings/developers) —
  homepage URL `http://localhost:3000`, callback URL
  `http://localhost:3000/api/auth/callback/github`)

### Installation

```bash
git clone https://github.com/nikidumea/smartstudybudy.git
cd snippet-vault
npm install
cp .env.example .env
# fill in .env: DATABASE_URL, NEXTAUTH_SECRET, GITHUB_ID, GITHUB_SECRET
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Usage

1. Sign in with GitHub.
2. Click **+ New snippet**, fill in a title, language, tags, and the code.
3. Use the search bar to find snippets by text, language, or tag.
4. Click a snippet to edit or delete it.

## Testing

```bash
npm run test
```

Runs the Vitest suite for the pure helper functions (`parseTags`, `filterSnippets`).

## Project Structure

See `CLAUDE.md` for the full structure and conventions used in this codebase.

## Deployment

Deployed on [Vercel](https://vercel.com). Set the same environment variables from
`.env.example` in the Vercel project settings (with your production database URL and
`NEXTAUTH_URL` set to your deployed domain).

## License

Educational project — built during the Graffish Labs internship.
