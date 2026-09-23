import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import type { ProgrammeConfig } from '../types';

interface ProgrammeOverviewProps {
  config: ProgrammeConfig;
}

export default function ProgrammeOverview({ config }: ProgrammeOverviewProps) {
  const { overview } = config;

  return (
    <section id="overview" className="container-wide scroll-mt-[148px] py-20 md:py-28">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <Reveal>
            <Eyebrow tone="maroon">{overview.eyebrow}</Eyebrow>
            <h2 className="mt-6 font-heading text-[clamp(2rem,3.2vw,3rem)] font-semibold leading-[1.04] tracking-[-0.02em]">
              {overview.heading}
            </h2>
            <p className="reading-width mt-5 text-[17px] leading-relaxed text-foreground-600">
              {overview.body}
            </p>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <Reveal delay={120}>
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              {overview.bullets.map((bullet, index) => (
                <div key={bullet} className="flex items-start gap-4 rounded-[12px] border border-background-300 bg-background-100 p-5">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-500 font-heading text-sm font-semibold text-primary-950">
                    {index + 1}
                  </span>
                  <p className="text-[14px] leading-relaxed text-foreground-700">{bullet}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}