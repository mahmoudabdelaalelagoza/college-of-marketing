import Button from '@/components/base/Button';
import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import NewsletterForm from '@/components/feature/NewsletterForm';
import HeroPattern from '@/components/feature/HeroPattern';
import PageShell from '@/components/feature/PageShell';
import { secondaryNav } from '@/lib/nav';

const events = [
  {
    dateISO: '2026-09-24',
    type: 'Open evening',
    title: 'College of Marketing open evening',
    copy: 'An introduction to our two pathways, funding and how learning applies to real marketing work.',
    time: '6:00 pm – 7:00 pm',
    location: 'Online',
    format: 'Virtual',
  },
  {
    dateISO: '2026-10-02',
    type: 'Employer briefing',
    title: 'Funding explained for employers',
    copy: 'How apprenticeship funding works, eligibility, and what it means for your team.',
    time: '1:00 pm – 1:45 pm',
    location: 'Online',
    format: 'Virtual',
  },
  {
    dateISO: '2026-10-16',
    type: 'Workshop',
    title: 'Building a measurement framework',
    copy: 'A practical session on connecting marketing activity to commercial outcomes.',
    time: '9:30 am – 12:30 pm',
    location: 'Kent',
    format: 'In person',
  },
  {
    dateISO: '2026-11-05',
    type: 'Information session',
    title: 'CIM pathway information session',
    copy: 'Understand the professional qualification route and what it adds to your career.',
    time: '5:30 pm – 6:30 pm',
    location: 'Online',
    format: 'Virtual',
  },
];

const upcomingEvents = events.filter((event) => {
  const endOfEventDay = new Date(`${event.dateISO}T23:59:59`);
  return endOfEventDay >= new Date();
});

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
});

export default function Events() {
  return (
    <PageShell navItems={secondaryNav}>
      {/* Hero */}
      <section className="container-wide pt-8 md:pt-10">
        <div className="hero-maroon-gradient warm-glow relative overflow-hidden rounded-[18px] px-6 py-14 text-background-50 md:px-14 md:py-20">
          <HeroPattern />
          <div className="relative z-10 grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-8">
              <Reveal>
                <Eyebrow tone="gold">Events &amp; open days</Eyebrow>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="mt-6 font-heading text-[clamp(2.4rem,4.5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-background-50">
                  Meet the college, in person or online.
                </h1>
              </Reveal>
              <Reveal delay={160}>
                <p className="reading-width mt-6 text-[17px] leading-relaxed text-background-50/75">
                  Join an open evening, employer briefing or practical workshop to understand the
                  programmes, funding and what the experience feels like.
                </p>
              </Reveal>
              <Reveal delay={240}>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button to="/events#upcoming" variant="gold" arrow>
                    See upcoming events
                  </Button>
                  <Button to="/employers" variant="outlineLight">
                    Book a workforce consultation
                  </Button>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming events */}
      <section id="upcoming" className="container-wide scroll-mt-[148px] py-20 md:py-28">
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow tone="maroon">Upcoming</Eyebrow>
              <h2 className="mt-6 max-w-2xl font-heading text-[clamp(2rem,3.2vw,3rem)] font-semibold leading-[1.04] tracking-[-0.02em]">
                Events in the coming weeks.
              </h2>
            </div>
            <p className="max-w-sm text-[15px] leading-relaxed text-foreground-600">
              All events are free. Register to receive the joining details.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {upcomingEvents.length === 0 && (
            <div className="rounded-[16px] border border-background-300 bg-background-50 p-8">
              <h3 className="font-heading text-xl font-semibold leading-tight">New dates are being scheduled.</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-foreground-600">
                Join the events list and we will email you when the next open evening or briefing is announced.
              </p>
            </div>
          )}
          {upcomingEvents.map((event, index) => {
            const [day, month] = dateFormatter.format(new Date(`${event.dateISO}T12:00:00`)).split(' ');
            return (
            <Reveal key={event.title} delay={index * 70}>
              <article className="flex h-full gap-6 rounded-[16px] border border-background-300 bg-background-50 p-6 md:p-7">
                <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-[14px] border border-background-200 bg-background-100">
                  <span className="font-heading text-2xl font-semibold leading-none text-foreground-950">
                    {day}
                  </span>
                  <span className="eyebrow mt-1 text-[10px] text-foreground-500">{month}</span>
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="eyebrow text-accent-700">{event.type}</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                        event.format === 'In person'
                          ? 'bg-secondary-100 text-secondary-800'
                          : 'bg-background-100 text-foreground-600'
                      }`}
                    >
                      {event.format}
                    </span>
                  </div>
                  <h3 className="mt-3 font-heading text-xl font-semibold leading-tight">
                    {event.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-foreground-600">{event.copy}</p>
                  <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-background-200 pt-4 text-[13px] text-foreground-500">
                    <span className="flex items-center gap-1.5">
                      <i className="ri-time-line" />
                      {event.time}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <i className="ri-map-pin-line" />
                      {event.location}
                    </span>
                    <Button to="/college-of-marketing#apply" variant="link" className="ml-auto self-center">
                      Register
                    </Button>
                  </div>
                </div>
              </article>
            </Reveal>
            );
          })}
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-y border-background-300 bg-background-100 py-20 md:py-28">
        <div className="container-wide">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6">
              <Reveal>
                <Eyebrow tone="maroon">Stay updated</Eyebrow>
                <h2 className="mt-6 font-heading text-[clamp(2rem,3.2vw,3rem)] font-semibold leading-[1.04] tracking-[-0.02em]">
                  Get notified when new events are announced.
                </h2>
                <p className="reading-width mt-5 text-[15px] leading-relaxed text-foreground-600">
                  We send a short update when we add open evenings, workshops and briefings — no
                  more than a couple of emails a month.
                </p>
              </Reveal>
            </div>
            <div className="lg:col-span-6">
              <Reveal delay={120}>
                <div className="rounded-[16px] border border-background-300 bg-background-50 p-8">
                  <NewsletterForm />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
