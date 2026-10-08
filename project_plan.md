# Kent Business College — College of Marketing

## 1. Project Description
A premium editorial website experience for Kent Business College's College of Marketing. It presents two funded professional pathways — Marketing Executive Level 4 and Marketing Manager Level 6 — to three audiences: marketing professionals/learners, employers (marketing leaders, HR, L&D), and ready-to-apply candidates.

Positioning: executive education + premium professional publishing + commercial business thinking. It must NOT feel like a generic apprenticeship provider, university portal, LMS, SaaS dashboard, course marketplace, agency, or AI startup.

Core value: visitors understand within ~20 seconds what the College of Marketing is, which programme fits, what capability they build, what workplace outputs they create, the professional (CIM) pathway, how funding may apply, and the next action — using progressive disclosure (summary → decision info → detail).

## 2. Page Structure
- `/` — Redirects / links into the College of Marketing landing page (keep a simple entry pointing to the college page)
- `/college-of-marketing` — College of Marketing landing page
- `/college-of-marketing/marketing-executive-level-4` — Marketing Executive Level 4 programme page
- `/college-of-marketing/marketing-manager-level-6` — Marketing Manager Level 6 programme page
- `/courses` — Courses & programmes overview (Level 4, Level 6, modules, short courses)
- `/events` — Events, open days and workshops (with newsletter signup)
- `/about` — Who we are (purpose, values, leadership)
- `/employers` — Employer partnerships and workforce consultation
- `/funding` — Apprenticeship funding explained
- `/faq` — Frequently asked questions (learners, employers, funding)
- `*` — Not Found

## 3. Core Features
- [x] Global main navigation (sticky, minimal) + College of Marketing contextual navigation
- [x] Global footer, button system, eyebrow labels
- [x] College of Marketing landing page with progressive-disclosure editorial sections
- [x] Marketing capability system (interactive capability selector)
- [x] Workplace marketing operating system (4 connected stages)
- [x] Workplace outputs / evidence section
- [x] Professional recognition (CIM pathway) section
- [x] Employer value section
- [x] Funding explanation section
- [x] Interactive eligibility checker (client-side guidance result)
- [x] Programme comparison (Level 4 vs Level 6)
- [x] Testimonials, case studies, FAQ accordion
- [x] Final CTA + enquiry form (employer consultation / apply)
- [x] Level 4 programme page
- [x] Level 6 programme page
- [x] Subtle scroll-reveal motion with prefers-reduced-motion support
- [x] SEO meta + structured data (Organization, Course, FAQPage)

## 4. Data Model Design
No database required at this stage.
- All content is static/editorial.
- The eligibility checker is client-side.
- Enquiry / consultation / application submissions use the platform Form capability (no Supabase table needed).

## 5. Backend / Third-party Integration Plan
- Database: Neon Postgres, accessed server-side only via `DATABASE_URL`.
- Forms: employer workforce consultation, programme enquiry and consultation
  booking all post to the internal API routes.
- Dashboard: session-cookie staff area at `/dashboard` for leads, CMS resources,
  the assistant and the maintenance gate.
- Eventbrite: optional events sync, disabled when no token is configured.
- Assistant: optional, disabled when no `ASSISTANT_API_KEY` is configured.
- Payments: not implemented; paid standalone course pricing is confirmed during
  consultation rather than taken online.

## 6. Development Phase Plan

### Phase 1: Design system + global components + College of Marketing landing page
- Goal: Establish the premium editorial design language and deliver a complete, usable landing page.
- Deliverable: Design tokens (maroon/gold/cream editorial scales, Playfair Display (headings) + DM Sans (body/UI) + Manrope (numbers/metadata) typography), global header, college contextual nav, footer, button/eyebrow/reveal primitives, and the full `/college-of-marketing` landing page with all sections.

### Phase 2: Marketing Executive Level 4 programme page
- Goal: Full programme page for Level 4 reusing global components.
- Deliverable: `/college-of-marketing/marketing-executive-level-4` with hero, programme detail, capability, workplace outputs, pathway, funding, eligibility, FAQ, CTA/form.

### Phase 3: Marketing Manager Level 6 programme page
- Goal: Full programme page for Level 6 reusing global components, with clear progression from Level 4.
- Deliverable: `/college-of-marketing/marketing-manager-level-6` with the same depth, tailored to strategic leadership.

### Phase 4: Polish, SEO, motion and cross-linking
- Goal: Final quality pass.
- Deliverable: Structured data, meta/SEO, subtle animations, reduced-motion support, responsive verification, internal link polish.

### Phase 5: Standalone information pages
- Goal: Move the in-page sections into dedicated, navigable pages for a complete site structure.
- Deliverable: `/courses`, `/events`, `/about`, `/employers`, `/funding` and `/faq`, each reusing the global shell, navigation, button system and form capability.

### Phase 6: Site-wide design-system alignment
- Goal: Apply the Kent Business College website-wide design system (deep plum / wine / gold / champagne / cream / pearl palette, Playfair Display + DM Sans + Manrope typography, radii, plum-tinted shadows, 1260px container) consistently across every page.
- Deliverable: Global token and typography foundation updated in `index.css` + `tailwind.config.ts` (cascades to all pages), exact brand hero/panel gradients, aligned eyebrow/label styling and container width. All pages inherit the same visual language through the shared shell and semantic tokens.