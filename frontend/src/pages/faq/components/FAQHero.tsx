import Button from '@/components/base/Button';
import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import HeroPattern from '@/components/feature/HeroPattern';

export default function FAQHero() {
  return (
    <section className="hero-maroon-gradient warm-glow relative overflow-hidden pt-8 text-background-50 md:pt-10">
      <HeroPattern />
      <div className="container-wide relative z-10 px-6 py-14 md:px-14 md:py-20">
        <Reveal>
          <Eyebrow tone="gold">Frequently asked questions</Eyebrow>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="mt-6 max-w-3xl font-heading text-[clamp(2.4rem,4.5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-background-50">
            Questions, answered clearly.
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="reading-width mt-6 text-[17px] leading-relaxed text-background-50/75">
            The answers we're most often asked, grouped by learner, employer and funding. Still
            unsure? Use the eligibility checker or speak with an adviser.
          </p>
        </Reveal>
        <Reveal delay={240}>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button to="/eligibility-checker" variant="gold" arrow>
              Check my eligibility
            </Button>
            <Button to="/consultation" variant="outlineLight">
              Book a consultation
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
