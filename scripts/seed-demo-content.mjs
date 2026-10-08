import { existsSync, readFileSync } from 'node:fs';
import { neon } from '@neondatabase/serverless';

loadEnv();
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is missing.');

const sql = neon(process.env.DATABASE_URL);
const now = new Date();
const futureOne = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 14).toISOString();
const futureTwo = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 35).toISOString();
const futureOneEnd = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 14 + 1000 * 60 * 90).toISOString();
const futureTwoEnd = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 35 + 1000 * 60 * 120).toISOString();
const publishedAt = now.toISOString();

await cleanupDemoRows();
await seedMedia();
await seedArticles();
await seedCaseStudies();
await seedTestimonials();
await seedEvents();
await seedShortCourses();
await seedPeople();
await seedPartners();
await seedPageSections();
await seedKnowledgeSources();
await seedSettings();
await seedLeadAndNewsletter();

const summary = await getSummary();
console.log(JSON.stringify({ ok: true, summary }, null, 2));

async function cleanupDemoRows() {
  await sql`delete from media_assets where source_url like 'demo:%'`;
  await sql`delete from articles where slug like 'demo-%'`;
  await sql`delete from case_studies where slug like 'demo-%'`;
  await sql`delete from testimonials where name like 'Demo %'`;
  await sql`delete from events where slug like 'demo-%'`;
  await sql`delete from short_courses where slug like 'demo-%'`;
  await sql`delete from people_profiles where name like 'Demo %'`;
  await sql`delete from partner_logos where slug like 'demo-%'`;
  await sql`delete from page_content_sections where section_key like 'demo_%'`;
  await sql`delete from knowledge_sources where import_key like 'demo-%'`;
  await sql`delete from site_settings where setting_key like 'demo_%'`;
  await sql`delete from lead_submissions where source = 'demo-seed'`;
  await sql`delete from newsletter_subscriptions where source = 'demo-seed'`;
}

async function seedMedia() {
  await sql`
    insert into media_assets (title, url, alt_text, source_url)
    values
      ('Demo campus workshop image', '/brand/college-of-marketing-logo.png', 'College of Marketing demo brand image', 'demo:brand-logo'),
      ('Demo assistant source image', '/brand/college-of-marketing-mark.png', 'College of Marketing demo mark', 'demo:brand-mark')
  `;
}

async function seedArticles() {
  await sql`
    insert into articles (title, slug, excerpt, content, category, author, image_url, image_alt, read_minutes, is_published, published_at, display_order)
    values
      (
        'Demo: How marketing apprenticeships turn learning into business output',
        'demo-marketing-apprenticeships-output',
        'A sample article used to test the CMS article publishing flow.',
        'This demo article proves that published CMS articles can be stored in Neon and returned through the public content API. Replace it with a real insight article when ready.',
        'Insights',
        'College of Marketing team',
        '/brand/college-of-marketing-logo.png',
        'College of Marketing demo article',
        4,
        true,
        ${publishedAt},
        1
      ),
      (
        'Demo: Building a practical marketing measurement routine',
        'demo-marketing-measurement-routine',
        'A sample thought-leadership article for testing the dashboard.',
        'This placeholder article is safe to delete from the dashboard after testing. It exists to confirm list, edit and public API behaviour.',
        'Capability',
        'College of Marketing team',
        '/brand/college-of-marketing-logo.png',
        'Demo measurement article',
        5,
        true,
        ${publishedAt},
        2
      )
  `;
}

async function seedCaseStudies() {
  await sql`
    insert into case_studies (title, slug, sector, client_name, headline, summary, challenge, approach, outcome, metrics, image_url, image_alt, is_featured, is_published, published_at, display_order)
    values
      (
        'Demo: Retail team improves campaign prioritisation',
        'demo-retail-campaign-prioritisation',
        'Retail & e-commerce',
        'Demo Retail Group',
        'A learner introduced a clearer campaign prioritisation routine.',
        'A sample case study that appears on the public College page when published.',
        'The team had too many campaign requests and no shared prioritisation language.',
        'The learner built a simple scoring model for audience, value and effort.',
        'Managers could compare campaign requests faster and agree next steps with more confidence.',
        ${JSON.stringify([{ label: 'Review time', value: '-30%' }, { label: 'Stakeholders aligned', value: '8' }])},
        '/brand/college-of-marketing-logo.png',
        'Demo case study',
        true,
        true,
        ${publishedAt},
        1
      ),
      (
        'Demo: Employer team builds a measurement framework',
        'demo-employer-measurement-framework',
        'Professional services',
        'Demo Advisory LLP',
        'A team moved from activity reporting to outcome-led measurement.',
        'A second sample case study for validating grids, editing and public filtering.',
        'Reporting focused on channel activity rather than business impact.',
        'The programme helped the learner map campaign measures to business objectives.',
        'Leadership received a clearer monthly view of marketing performance.',
        ${JSON.stringify([{ label: 'Framework adopted', value: '1 team' }, { label: 'Dashboards simplified', value: '3' }])},
        '/brand/college-of-marketing-logo.png',
        'Demo measurement case study',
        false,
        true,
        ${publishedAt},
        2
      )
  `;
}

async function seedTestimonials() {
  await sql`
    insert into testimonials (name, programme, reviewer_type, photo_url, review_text, consent, status, is_featured, display_order, moderation_notes, reviewed_at)
    values
      ('Demo Amelia Learner', 'Marketing Executive - Level 4', 'Learner', '/brand/college-of-marketing-mark.png', 'This demo testimonial proves approved learner stories can flow from Neon into the public homepage section.', true, 'approved', true, 1, 'Demo content for CMS testing.', now()),
      ('Demo Daniel Manager', 'Marketing Manager - Level 6', 'Learner', '/brand/college-of-marketing-mark.png', 'The dashboard made it easy to approve and feature this sample testimonial before publishing it on the site.', true, 'approved', true, 2, 'Demo content for CMS testing.', now()),
      ('Demo Priya Employer', 'Employer partner', 'Employer', '/brand/college-of-marketing-mark.png', 'This sample employer quote validates public filtering for consent and approved status.', true, 'approved', false, 3, 'Demo content for CMS testing.', now())
  `;
}

async function seedEvents() {
  await sql`
    insert into events (title, slug, summary, description, image_url, image_alt, starts_at, ends_at, timezone, location, organiser, category, classifications, format, sales_status, price_label, cta_label, cta_url, source_url, source, display_order, is_active, is_featured)
    values
      (
        'Demo: College of Marketing open evening',
        'demo-college-open-evening',
        'A sample upcoming event used to confirm the public Events page reads from Neon.',
        'Join this demo session to see how Eventbrite and dashboard-managed events appear on the site.',
        '/brand/college-of-marketing-logo.png',
        'Demo event',
        ${futureOne},
        ${futureOneEnd},
        'Europe/London',
        'Online',
        'College of Marketing',
        'Information Session',
        ${JSON.stringify(['Demo', 'Information Session'])},
        'Virtual',
        'live',
        'Free',
        'Register',
        '/consultation?event=demo-college-open-evening',
        'demo:event-open-evening',
        'dashboard',
        1,
        true,
        true
      ),
      (
        'Demo: Employer funding briefing',
        'demo-employer-funding-briefing',
        'A second sample event for validating filtering, dates and public display.',
        'A practical briefing on funded marketing programmes for employers.',
        '/brand/college-of-marketing-logo.png',
        'Demo employer event',
        ${futureTwo},
        ${futureTwoEnd},
        'Europe/London',
        'Online',
        'College of Marketing',
        'Employer briefing',
        ${JSON.stringify(['Demo', 'Employers', 'Funding'])},
        'Virtual',
        'live',
        'Free',
        'Register',
        '/consultation?event=demo-employer-funding-briefing',
        'demo:event-employer-briefing',
        'dashboard',
        2,
        true,
        false
      )
  `;
}

async function seedShortCourses() {
  await sql`
    insert into short_courses (slug, title, category, duration, format, owner, audience, summary, focus_list, detail, icon, image_url, display_order, is_active)
    values
      (
        'demo-campaign-measurement-sprint',
        'Demo Campaign Measurement Sprint',
        'Measurement',
        '1 day',
        'Online workshop',
        'College of Marketing',
        'Marketing executives and managers',
        'A sample standalone paid course that appears on the Courses page when active.',
        ${JSON.stringify(['KPIs', 'Dashboard design', 'Reporting rhythm'])},
        ${JSON.stringify({ outcomes: ['Build a measurement plan', 'Choose useful indicators'], price: 'Demo only' })},
        'ri-line-chart-line',
        '/brand/college-of-marketing-logo.png',
        1,
        true
      ),
      (
        'demo-strategic-brief-writing',
        'Demo Strategic Brief Writing',
        'Planning',
        'Half day',
        'Blended',
        'College of Marketing',
        'Marketing teams preparing campaigns',
        'A sample short course for validating CMS-driven standalone course cards.',
        ${JSON.stringify(['Brief structure', 'Audience insight', 'Commercial goals'])},
        ${JSON.stringify({ outcomes: ['Write sharper briefs', 'Align stakeholders'], price: 'Demo only' })},
        'ri-file-edit-line',
        '/brand/college-of-marketing-logo.png',
        2,
        true
      )
  `;
}

async function seedPeople() {
  await sql`
    insert into people_profiles (name, initials, role_title, affiliation, specialties, biography, image_url, link_url, display_order, is_active)
    values
      ('Demo Eleanor Hart', 'EH', 'Dean, College of Marketing', 'Academic leadership', ${JSON.stringify(['Marketing strategy', 'Professional education'])}, 'Demo profile used to test the About leadership section and People CMS resource.', '/brand/college-of-marketing-logo.png', '/about', 1, true),
      ('Demo Marcus Reid', 'MR', 'Director of Employer Partnerships', 'Employer partnerships', ${JSON.stringify(['Funding', 'Workforce planning'])}, 'Demo profile used to confirm people records can be edited and published from Neon.', '/brand/college-of-marketing-logo.png', '/employers', 2, true),
      ('Demo Priya Shah', 'PS', 'Head of Learning Delivery', 'Programme delivery', ${JSON.stringify(['Coaching', 'Applied learning'])}, 'Demo profile for the public leadership cards and dashboard testing.', '/brand/college-of-marketing-logo.png', '/about', 3, true)
  `;
}

async function seedPartners() {
  await sql`
    insert into partner_logos (name, slug, kind, description, icon, image_url, link_url, display_order, is_active)
    values
      ('Demo Employer Partner', 'demo-employer-partner', 'employer', 'Sample partner record for dashboard and public API testing.', 'ri-building-4-line', '/brand/college-of-marketing-logo.png', '/employers', 1, true),
      ('Demo Professional Body', 'demo-professional-body', 'professional-body', 'Sample professional body record for partner CMS validation.', 'ri-award-line', '/brand/college-of-marketing-logo.png', '/about', 2, true)
    on conflict (slug) do update set
      name = excluded.name,
      kind = excluded.kind,
      description = excluded.description,
      icon = excluded.icon,
      image_url = excluded.image_url,
      link_url = excluded.link_url,
      display_order = excluded.display_order,
      is_active = excluded.is_active,
      updated_at = now()
  `;
}

async function seedPageSections() {
  const sections = [
    ['/', 'demo_home_hero', 'headline', 'text', 'Demo home hero from CMS', 'Demo home hero from CMS'],
    ['/college-of-marketing', 'demo_college_overview', 'headline', 'text', 'Demo College of Marketing overview', 'Demo College of Marketing overview'],
    ['/courses', 'demo_courses_intro', 'headline', 'text', 'Demo courses intro from page sections', 'Demo courses intro from page sections'],
    ['/events', 'demo_events_intro', 'headline', 'text', 'Demo events intro from page sections', 'Demo events intro from page sections'],
    ['/about', 'demo_about_intro', 'headline', 'text', 'Demo about intro from page sections', 'Demo about intro from page sections'],
    ['/employers', 'demo_employers_intro', 'headline', 'text', 'Demo employers intro from page sections', 'Demo employers intro from page sections'],
    ['/funding', 'demo_funding_intro', 'headline', 'text', 'Demo funding intro from page sections', 'Demo funding intro from page sections'],
    ['/faq', 'demo_faq_intro', 'headline', 'text', 'Demo FAQ intro from page sections', 'Demo FAQ intro from page sections'],
    ['/consultation', 'demo_consultation_intro', 'headline', 'text', 'Demo consultation intro from page sections', 'Demo consultation intro from page sections'],
  ];

  for (const [pagePath, sectionKey, fieldKey, fieldType, draftValue, publishedValue] of sections) {
    await sql`
      insert into page_content_sections (page_path, section_key, field_key, field_type, draft_value, published_value, is_visible)
      values (${pagePath}, ${sectionKey}, ${fieldKey}, ${fieldType}, ${draftValue}, ${publishedValue}, true)
      on conflict (page_path, section_key, field_key) do update set
        draft_value = excluded.draft_value,
        published_value = excluded.published_value,
        is_visible = true,
        updated_at = now()
    `;
  }
}

async function seedKnowledgeSources() {
  await sql`
    insert into knowledge_sources (title, kind, reference_path, content, import_key, is_active)
    values
      ('Demo learner FAQ: Can I join if I am new to marketing?', 'FAQ', '/faq#learners', 'Yes. The Level 4 route is designed for marketers who are building confidence and need structured applied learning alongside their role.', 'demo-faq-learners-new-to-marketing', true),
      ('Demo employer FAQ: Can we enrol more than one learner?', 'FAQ', '/faq#employers', 'Yes. Employers can enrol several learners where roles and eligibility fit the programme requirements.', 'demo-faq-employers-multiple-learners', true),
      ('Demo funding FAQ: Does the learner pay?', 'FAQ', '/faq#funding', 'For eligible apprenticeships, funding is normally handled through the employer levy or co-investment rather than paid directly by the learner.', 'demo-faq-funding-learner-pay', true),
      ('Demo assistant source: Programme overview', 'Q&A', '/college-of-marketing', 'College of Marketing offers practical marketing pathways, short courses, employer support and consultation-led enrolment.', 'demo-assistant-programme-overview', true)
  `;
}

async function seedSettings() {
  await sql`
    insert into site_settings (setting_key, setting_value, setting_type, is_public)
    values
      ('demo_site_notice', 'Demo CMS content is active for testing. Delete demo records from the dashboard when ready.', 'text', true),
      ('demo_contact_label', 'Book a consultation', 'text', true)
    on conflict (setting_key) do update set
      setting_value = excluded.setting_value,
      setting_type = excluded.setting_type,
      is_public = excluded.is_public,
      updated_at = now()
  `;
}

async function seedLeadAndNewsletter() {
  await sql`
    insert into lead_submissions (name, email, organisation, interest, message, source, status, is_read, internal_notes)
    values ('Demo Lead', 'demo.lead@example.com', 'Demo Organisation', 'Marketing Executive Level 4', 'This is a seeded demo lead for dashboard testing.', 'demo-seed', 'new', false, 'Safe to delete after testing.')
  `;

  await sql`
    insert into newsletter_subscriptions (email, source)
    values ('demo.newsletter@example.com', 'demo-seed')
    on conflict (email) do nothing
  `;
}

async function getSummary() {
  const rows = await sql.query(`
    select 'articles' as resource, count(*)::int as count from articles where slug like 'demo-%'
    union all select 'case_studies', count(*)::int from case_studies where slug like 'demo-%'
    union all select 'testimonials', count(*)::int from testimonials where name like 'Demo %'
    union all select 'events', count(*)::int from events where slug like 'demo-%'
    union all select 'short_courses', count(*)::int from short_courses where slug like 'demo-%'
    union all select 'people', count(*)::int from people_profiles where name like 'Demo %'
    union all select 'partners', count(*)::int from partner_logos where slug like 'demo-%'
    union all select 'media', count(*)::int from media_assets where source_url like 'demo:%'
    union all select 'page_sections', count(*)::int from page_content_sections where section_key like 'demo_%'
    union all select 'knowledge_sources', count(*)::int from knowledge_sources where import_key like 'demo-%'
    union all select 'site_settings', count(*)::int from site_settings where setting_key like 'demo_%'
    union all select 'leads', count(*)::int from lead_submissions where source = 'demo-seed'
    union all select 'newsletter', count(*)::int from newsletter_subscriptions where source = 'demo-seed'
    order by resource asc
  `);
  return rows;
}

function loadEnv() {
  if (!existsSync('.env')) return;

  for (const line of readFileSync('.env', 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
    const [key, ...rest] = trimmed.split('=');
    if (process.env[key]) continue;
    process.env[key] = rest.join('=').trim().replace(/^"|"$/g, '');
  }
}
