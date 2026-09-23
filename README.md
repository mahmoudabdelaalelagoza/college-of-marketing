# Kent Business College - College of Marketing

React + Vite + Tailwind website for the College of Marketing pages, with server-side API routes ready for Neon Postgres.

## Project Structure

```text
frontend/
  index.html
  public/
  src/
    components/        Shared UI components
    pages/             Route pages
      <page>/components/  Page-specific section components
backend/
  api/                 Real server-side handlers
  db/schema.sql        Neon database schema
api/                   Thin Vercel-compatible wrappers that call backend/api
```

When you want to edit a visible page section, start in:

```text
frontend/src/pages/<page>/components/<SectionName>.tsx
```

## Local Setup

```bash
npm install
npm run dev
```

## Neon Setup

1. Create a Neon Postgres database.
2. Run `backend/db/schema.sql` in the Neon SQL editor.
3. Copy `.env.example` to `.env` in your deployment environment and set `DATABASE_URL`.
4. Deploy with a host that supports serverless API routes in the root `api/` folder, such as Vercel.

The browser never connects to Neon directly. Forms post to `/api/leads` and `/api/newsletter`, and those API routes use `DATABASE_URL` server-side.

## Quality Checks

```bash
npm run check
npm run build
```
