import Reveal from '@/components/base/Reveal';
import type { ProgrammeConfig } from '../types';

interface ProgrammeKeyFactsProps {
  config: ProgrammeConfig;
}

export default function ProgrammeKeyFacts({ config }: ProgrammeKeyFactsProps) {
  return (
    <section className="container-wide pb-4">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {config.keyFacts.map((fact, index) => (
          <Reveal key={fact.label} delay={index * 70}>
            <div className="h-full rounded-[14px] border border-background-300 bg-background-50 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary-100 text-secondary-800">
                <i className={`${fact.icon} text-lg`} />
              </div>
              <p className="eyebrow mt-5 text-foreground-500">{fact.label}</p>
              <p className="mt-2 text-[14px] leading-relaxed text-foreground-700">{fact.value}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
