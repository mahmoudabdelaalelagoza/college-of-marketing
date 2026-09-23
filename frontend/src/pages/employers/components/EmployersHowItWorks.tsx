import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import { steps } from './data';

export default function EmployersHowItWorks() {
  return (
    <section className="border-y border-background-300 bg-background-100 py-20 md:py-28">
            <div className="container-wide">
              <Reveal>
                <div className="max-w-2xl">
                  <Eyebrow tone="maroon">How it works</Eyebrow>
                  <h2 className="mt-6 font-heading text-[clamp(2rem,3.2vw,3rem)] font-semibold leading-[1.04] tracking-[-0.02em]">
                    A focused, predictable partnership.
                  </h2>
                </div>
              </Reveal>
    
              <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                {steps.map((step, index) => (
                  <Reveal key={step.title} delay={index * 80}>
                    <div className="h-full rounded-[16px] border border-background-300 bg-background-50 p-7">
                      <span className="font-heading text-lg text-accent-700">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h3 className="mt-4 font-heading text-lg font-semibold leading-tight">{step.title}</h3>
                      <p className="mt-2 text-[14px] leading-relaxed text-foreground-600">{step.copy}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
  );
}

