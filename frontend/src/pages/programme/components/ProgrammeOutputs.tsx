import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import type { ProgrammeConfig } from '../types';

interface ProgrammeOutputsProps {
  config: ProgrammeConfig;
}

export default function ProgrammeOutputs({ config }: ProgrammeOutputsProps) {
  const { outputs } = config;

  return (
    <section
      id="outputs"
      className="scroll-mt-[148px] border-y border-background-300 bg-background-100 py-20 md:py-28"
    >
      <div className="container-wide">
        <Reveal>
          <Eyebrow tone="maroon">{outputs.eyebrow}</Eyebrow>
          <h2 className="mt-6 max-w-3xl font-heading text-[clamp(2rem,3.4vw,3.2rem)] font-semibold leading-[1.04] tracking-[-0.02em]">
            {outputs.heading}
          </h2>
          <p className="reading-width mt-5 text-[17px] leading-relaxed text-foreground-600">
            {outputs.intro}
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {outputs.items.map((output, index) => (
            <Reveal key={output.title} delay={index * 60}>
              <div className="h-full rounded-[16px] border border-background-300 bg-background-50 p-7">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-100 text-primary-800">
                  <i className={`${output.icon} text-lg`} />
                </div>
                <h3 className="mt-5 font-heading text-lg font-semibold leading-snug text-foreground-950">
                  {output.title}
                </h3>
                <p className="mt-2.5 text-[14px] leading-relaxed text-foreground-600">{output.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
