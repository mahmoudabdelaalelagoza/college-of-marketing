import Button from '@/components/base/Button';
import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import HeroPattern from '@/components/feature/HeroPattern';

export default function EmployersHero() {
  return (
    <section className="container-wide pt-8 md:pt-10">
            <div className="hero-maroon-gradient warm-glow relative overflow-hidden rounded-[18px] px-6 py-14 text-background-50 md:px-14 md:py-20">
              <HeroPattern />
              <div className="relative z-10">
                <Reveal>
                  <Eyebrow tone="gold">For employers</Eyebrow>
                </Reveal>
                <Reveal delay={80}>
                  <h1 className="mt-6 max-w-3xl font-heading text-[clamp(2.4rem,4.5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-background-50">
                    Build marketing capability that pays back in the business.
                  </h1>
                </Reveal>
                <Reveal delay={160}>
                  <p className="reading-width mt-6 text-[17px] leading-relaxed text-background-50/75">
                    Apprenticeships are designed for working marketers. Learning is applied to real
                    responsibilities, so capability develops alongside delivery rather than in isolation.
                  </p>
                </Reveal>
                <Reveal delay={240}>
                  <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Button to="/employers#consultation" variant="gold" arrow>
                      Book a workforce consultation
                    </Button>
                    <Button to="/funding" variant="outlineLight">
                      Understand funding
                    </Button>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>
  );
}

