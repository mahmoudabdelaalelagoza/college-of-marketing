import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import type { ProgrammeConfig } from '../types';

interface ProgrammePathwayProps {
  config: ProgrammeConfig;
}

export default function ProgrammePathway({ config }: ProgrammePathwayProps) {
  const { pathway } = config;

  return (
    <section id="pathway" className="container-wide scroll-mt-[148px] py-20 md:py-28">
      <Reveal>
        <Eyebrow tone="maroon">{pathway.eyebrow}</Eyebrow>
        <h2 className="mt-6 max-w-3xl font-heading text-[clamp(2rem,3.4vw,3.2rem)] font-semibold leading-[1.04] tracking-[-0.02em]">
          {pathway.heading}
        </h2>
        <p className="reading-width mt-5 text-[17px] leading-relaxed text-foreground-600">
          {pathway.intro}
        </p>
      </Reveal>

      <div className="relative mt-14">
        <div className="absolute left-[22px] top-2 bottom-2 hidden w-px bg-background-300 sm:block" />
        <div className="flex flex-col gap-8">
          {pathway.steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 80}>
              <div className="relative flex gap-6 sm:gap-8">
                <div className="relative z-10 hidden shrink-0 sm:block">
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-full border font-heading text-base ${
                      step.current
                        ? 'border-accent-500 bg-accent-500 text-primary-950'
                        : 'border-background-300 bg-background-50 text-foreground-500'
                    }`}
                  >
                    {index + 1}
                  </span>
                </div>
                <div
                  className={`flex-1 rounded-[16px] border p-7 ${
                    step.current
                      ? 'border-primary-300 bg-primary-50'
                      : 'border-background-300 bg-background-50'
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="eyebrow text-foreground-500">{step.stage}</span>
                    {step.current && (
                      <span className="rounded-full bg-accent-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary-950">
                        You are here
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 font-heading text-xl font-semibold leading-tight text-foreground-950">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-foreground-600">{step.copy}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}