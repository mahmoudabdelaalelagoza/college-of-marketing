import Button from '@/components/base/Button';
import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import { upcomingEvents, dateFormatter } from './data';

export default function EventsUpcomingEvents() {
  return (
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
  );
}


