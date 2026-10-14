import Button from '@/components/base/Button';
import Eyebrow from '@/components/base/Eyebrow';
import HeroPattern from '@/components/feature/HeroPattern';

export default function CoursesCTA() {
  return (
    <section className="hero-maroon-gradient warm-glow relative overflow-hidden pb-20 text-background-50 md:pb-28">
      <HeroPattern variant="compact" />
      <div className="container-wide relative z-10 px-6 py-14 md:px-14 md:py-16">
        <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Eyebrow tone="gold">Not sure which fits?</Eyebrow>
            <h2 className="mt-5 max-w-xl font-heading text-[clamp(1.8rem,3vw,2.6rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-background-50">
              Confirm whether you need a full programme or selected paid modules.
            </h2>
          </div>
          <Button to="/consultation" variant="gold" arrow>
            Book consultation
          </Button>
        </div>
      </div>
    </section>
  );
}
