import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import NewsletterForm from '@/components/feature/NewsletterForm';

export default function EventsNewsletter() {
  return (
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
                      We send a short update when we add open evenings, workshops and briefings - no
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
  );
}


