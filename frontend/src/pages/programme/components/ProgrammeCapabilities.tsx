import { useState } from 'react';
import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import type { ProgrammeConfig } from '../types';

interface ProgrammeCapabilitiesProps {
  config: ProgrammeConfig;
}

export default function ProgrammeCapabilities({ config }: ProgrammeCapabilitiesProps) {
  const { capabilities } = config;
  const [active, setActive] = useState(0);
  const current = capabilities.items[active];

  return (
    <section id="capabilities" className="container-wide scroll-mt-[148px] py-20 md:py-28">
      <Reveal>
        <Eyebrow tone="maroon">{capabilities.eyebrow}</Eyebrow>
        <h2 className="mt-6 max-w-3xl font-heading text-[clamp(2rem,3.4vw,3.2rem)] font-semibold leading-[1.04] tracking-[-0.02em]">
          {capabilities.heading}
        </h2>
        <p className="reading-width mt-5 text-[17px] leading-relaxed text-foreground-600">
          {capabilities.intro}
        </p>
      </Reveal>

      <Reveal delay={120}>
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <div className="flex flex-col border-t border-background-300">
              {capabilities.items.map((cap, index) => {
                const isActive = index === active;
                return (
                  <button
                    key={cap.title}
                    type="button"
                    onClick={() => setActive(index)}
                    className={`group flex items-center gap-4 border-b border-background-300 py-4 text-left transition-colors ${
                      isActive ? 'text-primary-900' : 'text-foreground-600 hover:text-foreground-900'
                    }`}
                    aria-pressed={isActive}
                  >
                    <span
                      className={`font-heading text-sm ${
                        isActive ? 'text-accent-700' : 'text-foreground-400'
                      }`}
                    >
                      {cap.number}
                    </span>
                    <span className={`flex-1 text-[15px] font-medium ${isActive ? 'font-semibold' : ''}`}>
                      {cap.title}
                    </span>
                    <i
                      className={`ri-arrow-right-line transition-transform duration-300 ${
                        isActive
                          ? 'translate-x-0 text-primary-800'
                          : '-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="relative h-full overflow-hidden rounded-[16px] border border-background-300 bg-background-50 p-8 md:p-12">
              <div key={current.title} className="animate-fade-in">
                <span className="font-heading text-5xl font-semibold text-background-300">
                  {current.number}
                </span>
                <p className="eyebrow mt-6 text-foreground-500">{current.title}</p>
                <h3 className="mt-4 max-w-xl font-heading text-[clamp(1.6rem,2.6vw,2.3rem)] font-semibold leading-[1.1]">
                  {current.headline}
                </h3>
                <p className="reading-width mt-5 text-[16px] leading-relaxed text-foreground-600">
                  {current.copy}
                </p>

                <div className="mt-9 border-t border-background-200 pt-7">
                  <p className="eyebrow text-foreground-500">Sub capabilities</p>
                  <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                    {current.subs.map((sub) => (
                      <div key={sub} className="flex items-center gap-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
                        <span className="text-[15px] text-foreground-800">{sub}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
