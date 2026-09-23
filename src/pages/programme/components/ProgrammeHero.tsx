import Button from '@/components/base/Button';
import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import HeroPattern from '@/components/feature/HeroPattern';
import type { ProgrammeConfig } from '../types';

interface ProgrammeHeroProps {
  config: ProgrammeConfig;
}

export default function ProgrammeHero({ config }: ProgrammeHeroProps) {
  const { hero, panelClass, level } = config;

  return (
    <section className="container-wide pb-16 pt-8 md:pb-24 md:pt-10">
      <div
        className={`${panelClass} warm-glow relative overflow-hidden rounded-[18px] px-6 py-14 text-background-50 md:px-14 md:py-20`}
      >
        <HeroPattern />
        <div className="relative z-10 grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow tone="gold">{hero.eyebrow}</Eyebrow>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="mt-6 font-heading text-[clamp(2.5rem,4.8vw,4.3rem)] font-semibold leading-[0.98] tracking-[-0.03em] text-background-50">
                {hero.title}{' '}
                <span className="text-accent-300">{hero.highlight}</span>
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="reading-width mt-7 text-[17px] leading-relaxed text-background-50/75">
                {hero.copy}
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button href="#apply" variant="gold" arrow>
                  Apply for {level}
                </Button>
                <Button href="#curriculum" variant="outlineLight">
                  Explore the curriculum
                </Button>
              </div>
            </Reveal>

            <Reveal delay={320}>
              <div className="mt-12 grid grid-cols-1 gap-6 border-t border-background-50/15 pt-8 sm:grid-cols-3">
                {hero.facts.map((fact) => (
                  <div key={fact.label}>
                    <span className="eyebrow text-accent-500">{fact.label}</span>
                    <p className="mt-2 text-sm leading-snug text-background-50/80">{fact.value}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={200}>
              <div className="relative mx-auto max-w-[420px]">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[16px] border border-background-50/12">
                  <img
                    src={hero.image}
                    alt={hero.imageAlt}
                    title={`${config.shortTitle} — ${level}`}
                    className="h-full w-full object-top"
                  />
                </div>
                <div className="absolute -bottom-4 left-14 hidden rounded-full bg-accent-500 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-950 lg:block">
                  {level} · {config.shortTitle}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}