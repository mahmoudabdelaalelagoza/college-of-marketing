import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import { fundingTypes } from './data';

export default function FundingFundingTypes() {
  return (
    <section className="container-wide py-20 md:py-28">
            <Reveal>
              <div className="max-w-2xl">
                <Eyebrow tone="maroon">Funding options</Eyebrow>
                <h2 className="mt-6 font-heading text-[clamp(2rem,3.2vw,3rem)] font-semibold leading-[1.04] tracking-[-0.02em]">
                  The route depends on your organisation's circumstances.
                </h2>
              </div>
            </Reveal>
    
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {fundingTypes.map((type, index) => (
                <Reveal key={type.title} delay={index * 70}>
                  <div className="h-full rounded-[16px] border border-background-300 bg-background-50 p-7">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-100 text-accent-800">
                      <i className={`${type.icon} text-xl`} />
                    </span>
                    <h3 className="mt-5 font-heading text-lg font-semibold leading-tight">{type.title}</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-foreground-600">{type.copy}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
  );
}

