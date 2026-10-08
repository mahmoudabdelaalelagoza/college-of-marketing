# Kent Business College - College of Marketing

React + Vite + Tailwind website for the College of Marketing pages, with
server-side API routes ready for Neon Postgres.

## Project Structure

```text
frontend/
  index.html
  public/
    brand/                 Logo and mark assets
  src/
    components/
      base/                Button, Eyebrow, Reveal primitives
      feature/             Site shell, forms, assistant, editorial imagery
    hooks/                 useActiveSection scroll spy
    lib/                   form submission, public content, SEO
    pages/<page>/          Route pages
      components/          Page-specific section components
    router/                Route table and router entry
backend/
  api/                     Real server-side handlers
  db/schema.sql            Neon database schema
  lib/                     Shared auth, HTTP and domain helpers
api/                       Thin Vercel-compatible wrappers that call backend/api
scripts/                   Schema, seeding and content checks
```

When you want to edit a visible page section, start in:

```text
frontend/src/pages/<page>/components/<SectionName>.tsx
```

## Routes

`/` and `/college-of-marketing` share the landing page. Programme pages live at
`/college-of-marketing/marketing-executive-level-4` and
`/college-of-marketing/marketing-manager-level-6`. Information pages are
`/courses`, `/consultation`, `/events`, `/about`, `/employers`, `/funding` and
`/faq`, with `/privacy`, `/terms` and `/accessibility`. Everything else renders
the 404 page. The staff area is under `/dashboard`.

## Local Setup

```bash
npm install
npm run dev
```

On Windows PowerShell, use `npm.cmd run dev` if script execution is disabled.

## Neon Setup

1. Create a Neon Postgres database.
2. Run `backend/db/schema.sql` in the Neon SQL editor, or `npm run db:apply`.
3. Copy `.env.example` to `.env` in your deployment environment and set `DATABASE_URL`.
4. Deploy with a host that supports serverless API routes in the root `api/` folder, such as Vercel.

The browser never connects to Neon directly. Forms post to `/api/leads` and
`/api/newsletter`, and those API routes use `DATABASE_URL` server-side.

Set `DASHBOARD_SECRET` in production. It signs dashboard sessions and the
maintenance preview cookie; without it those routes refuse to run rather than
falling back to a guessable key.

## Imagery

Content imagery no longer comes from an external placeholder service. Slots
render `<EditorialImage>`, which uses a real image when one is supplied by the
CMS and otherwise falls back to on-brand inline vector artwork. To use genuine
photography, add the file under `frontend/public/` and set `image_url` in the
dashboard, or replace the `src` value in the relevant data file.

## Quality Checks

```bash
npm run check
npm run build
```

`npm run check` runs TypeScript, ESLint and the content check. The content check
fails the build on placeholder hosts and on American spellings in user-facing
copy, since the site is written in British English.
