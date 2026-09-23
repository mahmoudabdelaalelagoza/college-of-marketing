import Button from '@/components/base/Button';
import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import HeroPattern from '@/components/feature/HeroPattern';

export default function CoursesHero() {
  return (
    <section className="container-wide pt-8 md:pt-10">
      <div className="hero-maroon-gradient warm-glow relative overflow-hidden rounded-[18px] px-6 py-14 text-background-50 md:px-14 md:py-20">
        <HeroPattern />
        <div className="relative z-10">
          <Reveal>
            <Eyebrow tone="gold">Courses &amp; modules</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-6 max-w-3xl font-heading text-[clamp(2.4rem,4.5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-background-50">
              Programme modules you can take as a full pathway or standalone paid courses.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="reading-width mt-6 text-[17px] leading-relaxed text-background-50/75">
              If you are eligible, the full apprenticeship programme is the recommended route. If not,
              selected modules can be taken individually as paid professional courses after consultation.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button to="/courses#course-modules" variant="gold" arrow>
                Explore modules
              </Button>
              <Button to="/consultation" variant="outlineLight">
                Book consultation
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
