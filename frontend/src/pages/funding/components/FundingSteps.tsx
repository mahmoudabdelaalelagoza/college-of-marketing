import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import { steps } from './data';

export default function FundingSteps() {
  return (
    <section className="border-y border-background-300 bg-background-100 py-20 md:py-28">
            <div className="container-wide">
              <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-12">
                <div className="lg:col-span-5">
                  <Reveal>
                    <Eyebrow tone="maroon">The journey</Eyebrow>
                    <h2 className="mt-6 font-heading text-[clamp(2rem,3.2vw,3rem)] font-semibold leading-[1.04] tracking-[-0.02em]">
                      From eligibility to progression.
                    </h2>
                    <p className="reading-width mt-5 text-[15px] leading-relaxed text-foreground-600">
                      We guide you through each step, so you understand what's needed before you commit.
                    </p>
                  </Reveal>
                </div>
                <div className="lg:col-span-7">
                  <div className="flex flex-col border-t border-background-300">
                    {steps.map((step, index) => (
                      <Reveal key={step.title} delay={index * 70}>
                        <div className="flex gap-6 border-b border-background-300 py-5">
                          <span className="font-heading text-lg text-accent-700">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <div>
                            <h3 className="font-heading text-lg font-semibold leading-tight">{step.title}</h3>
                            <p className="mt-1.5 text-[14px] leading-relaxed text-foreground-600">
                              {step.copy}
                            </p>
                          </div>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
  );
}

