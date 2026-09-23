import PageShell from '@/components/feature/PageShell';
import { secondaryNav } from '@/lib/nav';
import EventsHero from './components/EventsHero';
import EventsUpcomingEvents from './components/EventsUpcomingEvents';
import EventsNewsletter from './components/EventsNewsletter';

export default function Events() {
  return (
    <PageShell navItems={secondaryNav}>
      <EventsHero />
      <EventsUpcomingEvents />
      <EventsNewsletter />
    </PageShell>
  );
}

