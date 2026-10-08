# Kent Business College - College of Marketing

React + Vite + Tailwind website for the College of Marketing pages. The live
Hostinger build is static and talks directly to Supabase for forms, public CMS
content, dashboard auth and dashboard CRUD.

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
    lib/                   Supabase client, form submission, public content, SEO
    pages/<page>/          Route pages
      components/          Page-specific section components
    router/                Route table and router entry
backend/                   Legacy server handlers kept for reference
api/                       Legacy Vercel-compatible wrappers
scripts/                   Schema, seeding and content checks
supabase/schema.sql        Supabase tables, RPC functions and RLS policies
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

## Supabase Setup

1. Create a Supabase project.
2. Open the Supabase SQL editor and run `supabase/schema.sql`.
3. In Supabase Auth, create the dashboard user.
4. Add that Auth user to `dashboard_profiles` with the same user UUID:

```sql
insert into dashboard_profiles (id, email, name, role)
values ('AUTH_USER_UUID', 'admin@example.com', 'Admin', 'admin');
```

5. Set frontend environment variables before building:

```env
VITE_SUPABASE_URL="https://YOUR_PROJECT.supabase.co"
VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
```

The public site can insert leads/newsletter rows and read only published CMS
content. Dashboard access is restricted by Supabase Auth plus the
`dashboard_profiles` table and RLS policies.

## Hostinger FTP Deploy

GitHub Actions builds the static site and uploads `dist/` to Hostinger over FTP
on every push to `main`.

Required GitHub repository secrets:

```text
FTP_SERVER
FTP_USERNAME
FTP_PASSWORD
FTP_SERVER_DIR
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

Build settings if you upload source to Hostinger directly:

```text
Framework: Vite / React
Install command: npm ci
Build command: npm run build
Output directory: dist
Node version: 20
```

## Current Static-Hosting Limits

Eventbrite private-token sync and real AI responses require a server-side worker
or Supabase Edge Function. The static Hostinger build keeps Eventbrite settings
editable and supports manual event management in the CMS, but it does not expose
private API tokens to the browser.

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
