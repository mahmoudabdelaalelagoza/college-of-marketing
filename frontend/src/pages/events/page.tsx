import PageShell from '@/components/feature/PageShell';
import { secondaryNav } from '@/lib/nav';
import EventsHero from './components/EventsHero';
import EventsUpcomingEvents from './components/EventsUpcomingEvents';
import EventsNewsletter from './components/EventsNewsletter';
import { useSeo } from '@/lib/seo';

export default function Events() {

  useSeo({
    title: 'Events & Open Days',
    description:
      'Upcoming marketing open evenings, employer briefings and workshops at Kent Business College. Register free and get the joining details by email.',
    path: '/events',
  });
  return (
    <PageShell navItems={secondaryNav}>
      <EventsHero />
      <EventsUpcomingEvents />
      <EventsNewsletter />
    </PageShell>
  );
}

