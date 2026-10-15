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
    pages/<page>/          Route pages and page-specific sections
    router/                Route table and router entry
scripts/
  content-check.mjs        Content quality guard used by npm run check
supabase/
  schema.sql               Tables, RPC functions and RLS policies
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

Create `.env` from `.env.example` and set:

```env
VITE_SUPABASE_URL="https://YOUR_PROJECT.supabase.co"
VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
```

## Supabase Setup

1. Create a Supabase project.
2. Open the Supabase SQL editor and run `supabase/schema.sql`.
3. In Supabase Auth, create the dashboard user.
4. Add that Auth user to `dashboard_profiles` with the same user UUID:

```sql
insert into dashboard_profiles (id, email, name, role)
values ('AUTH_USER_UUID', 'admin@example.com', 'Admin', 'admin');
```

The public site can insert leads/newsletter rows and read only published CMS
content. Dashboard access is restricted by Supabase Auth plus the
`dashboard_profiles` table and RLS policies.

### Dashboard users

For an existing project, run `supabase/migrations/20261015_dashboard_user_roles.sql`
in Supabase SQL Editor. Do not rerun the whole schema on an existing project.
The initial admin still needs a matching Auth user and `dashboard_profiles` row
as shown above. After that, admins can create staff accounts with an email,
role and password at `/dashboard/users`. No invitation email is sent. Share the
initial password securely and ask the user to change it after signing in. If an
email is already present in Auth without a profile, verify that Auth user and
add its UUID to `dashboard_profiles` manually rather than creating a duplicate.

| Role | Access |
| --- | --- |
| Admin | Users, settings, maintenance, assistant, Eventbrite, leads and content |
| Editor | Leads and content, except Eventbrite events and site settings |

After applying the migration, deploy both functions and publish the frontend before
creating staff accounts:

```bash
supabase functions deploy dashboard-users
supabase functions deploy eventbrite-sync
```

In Supabase Auth URL Configuration, allow
`https://marketing.kentbusinesscollege.com/dashboard/set-password` as a redirect
URL. Add `http://localhost:3000/dashboard/set-password` for local password reset
testing. Email/SMTP delivery is only needed for optional password reset links,
not for creating accounts. The service-role key stays in Supabase Edge Functions,
never in the frontend.

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

Eventbrite private-token sync runs in the `eventbrite-sync` Supabase Edge
Function, so its token is never exposed to the browser. The public assistant
currently uses a static fallback; real AI responses still need a server-side
function.

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
