import Button from '@/components/base/Button';
import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import type { ProgrammeConfig } from '../types';

interface ProgrammeFundingProps {
  config: ProgrammeConfig;
}

export default function ProgrammeFunding({ config }: ProgrammeFundingProps) {
  const { funding } = config;

  return (
    <section
      id="funding"
      className="scroll-mt-[148px] border-y border-background-300 bg-background-100 py-20 md:py-28"
    >
      <div className="container-wide">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow tone="maroon">{funding.eyebrow}</Eyebrow>
              <h2 className="mt-6 font-heading text-[clamp(2rem,3.4vw,3.2rem)] font-semibold leading-[1.04] tracking-[-0.02em]">
                {funding.heading}
              </h2>
              <p className="reading-width mt-5 text-[17px] leading-relaxed text-foreground-600">
                {funding.body}
              </p>
            </Reveal>

            <div className="mt-10 flex flex-col gap-5">
              {funding.facts.map((fact, index) => (
                <Reveal key={fact.label} delay={index * 70}>
                  <div className="flex gap-6 border-b border-background-300 pb-5">
                    <span className="font-heading text-lg text-accent-700">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="font-heading text-lg font-semibold leading-tight">{fact.label}</h3>
                      <p className="mt-1.5 text-[14px] leading-relaxed text-foreground-600">
                        {fact.value}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={120}>
              <div className="rounded-[16px] border border-background-300 bg-background-50 p-8">
                <h3 className="font-heading text-2xl font-semibold leading-tight">
                  Confirm your position
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-foreground-600">
                  Funding rules can change and depend on your organisation and learner. Use the
                  eligibility checker or speak to an adviser for a clear view of what applies to you.
                </p>
                <div className="mt-7 flex flex-col gap-3">
                  <Button to="/college-of-marketing#eligibility" variant="primary" arrow>
                    Check my eligibility
                  </Button>
                  <Button href="#apply" variant="outline">
                    Speak to an adviser
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
