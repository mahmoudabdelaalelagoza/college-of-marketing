# Kent Business College - College of Marketing

React + Vite + Tailwind website for the College of Marketing pages.

## Local Setup

```bash
npm install
npm run dev
```

## Neon Setup

1. Create a Neon Postgres database.
2. Run `db/schema.sql` in the Neon SQL editor.
3. Copy `.env.example` to `.env` in your deployment environment and set `DATABASE_URL`.
4. Deploy with a host that supports serverless API routes in the `api/` folder, such as Vercel.

The browser never connects to Neon directly. Forms post to `/api/leads` and `/api/newsletter`, and those API routes use `DATABASE_URL` server-side.

## Quality Checks

```bash
npm run check
```
