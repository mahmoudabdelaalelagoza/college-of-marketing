import Button from '@/components/base/Button';
import Eyebrow from '@/components/base/Eyebrow';
import HeroPattern from '@/components/feature/HeroPattern';

export default function AboutCTA() {
  return (
    <section className="container-wide pb-20 md:pb-28">
            <div className="hero-maroon-gradient warm-glow relative overflow-hidden rounded-[18px] px-6 py-14 text-background-50 md:px-14 md:py-16">
              <HeroPattern variant="compact" />
              <div className="relative z-10 flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <Eyebrow tone="gold">Come and meet us</Eyebrow>
                  <h2 className="mt-5 max-w-xl font-heading text-[clamp(1.8rem,3vw,2.6rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-background-50">
                    See how we build marketing capability.
                  </h2>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button to="/events" variant="gold" arrow>
                    View events
                  </Button>
                  <Button to="/employers" variant="outlineLight">
                    Work with us
                  </Button>
                </div>
              </div>
            </div>
          </section>
  );
}

