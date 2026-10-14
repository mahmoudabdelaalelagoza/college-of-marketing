import SiteFooter from '@/components/feature/SiteFooter';
import SiteHeader from '@/components/feature/SiteHeader';
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
    <div className="min-h-screen bg-background-100">
      <SiteHeader />
      <main id="main-content">
        <EventsUpcomingEvents />
        <EventsNewsletter />
      </main>
      <SiteFooter />
    </div>
  );
}
