import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import { sectors } from './data';

export default function EmployersSectors() {
  return (
    <section className="container-wide py-20 md:py-28">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                <Reveal>
                  <Eyebrow tone="maroon">Who we work with</Eyebrow>
                  <h2 className="mt-6 font-heading text-[clamp(2rem,3.2vw,3rem)] font-semibold leading-[1.04] tracking-[-0.02em]">
                    Across sectors, for every marketing team.
                  </h2>
                  <p className="reading-width mt-5 text-[15px] leading-relaxed text-foreground-600">
                    The principles of commercial marketing apply everywhere. We tailor the workplace
                    application to your context.
                  </p>
                </Reveal>
              </div>
              <div className="lg:col-span-7">
                <Reveal delay={120}>
                  <div className="flex flex-wrap gap-3">
                    {sectors.map((sector) => (
                      <span
                        key={sector}
                        className="rounded-full border border-background-300 bg-background-50 px-5 py-2.5 text-sm font-medium text-foreground-700"
                      >
                        {sector}
                      </span>
                    ))}
                  </div>
                </Reveal>
              </div>
            </div>
          </section>
  );
}

