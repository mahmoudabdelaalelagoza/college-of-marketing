import Button from '@/components/base/Button';
import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import HeroPattern from '@/components/feature/HeroPattern';

export default function ConsultationHero() {
  return (
    <section className="hero-maroon-gradient warm-glow relative overflow-hidden pt-8 text-background-50 md:pt-10">
      <HeroPattern />
      <div className="container-wide relative z-10 px-6 py-14 md:px-14 md:py-20">
        <div className="max-w-3xl">
          <Reveal>
            <Eyebrow tone="gold">Consultation booking</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-6 font-heading text-[clamp(2.4rem,4.5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-background-50">
              Book a consultation before you enrol.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 text-[17px] leading-relaxed text-background-50/75">
              We will check whether the full funded programme is the right route. If not, we will help you choose the paid module or group of modules that matches your goals.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button to="/consultation#booking-form" variant="gold" arrow>
                Start booking
              </Button>
              <Button to="/courses#course-modules" variant="outlineLight">
                View course modules
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
