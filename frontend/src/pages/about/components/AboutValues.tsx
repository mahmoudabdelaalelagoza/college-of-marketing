import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import { values } from './data';

export default function AboutValues() {
  return (
    <section className="border-y border-background-300 bg-background-100 py-20 md:py-28">
            <div className="container-wide">
              <Reveal>
                <Eyebrow tone="maroon">What we stand for</Eyebrow>
                <h2 className="mt-6 max-w-2xl font-heading text-[clamp(2rem,3.2vw,3rem)] font-semibold leading-[1.04] tracking-[-0.02em]">
                  Values that shape every programme.
                </h2>
              </Reveal>
    
              <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                {values.map((value, index) => (
                  <Reveal key={value.title} delay={index * 70}>
                    <div>
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-100 text-secondary-800">
                        <i className={`${value.icon} text-xl`} />
                      </span>
                      <h3 className="mt-5 font-heading text-lg font-semibold leading-tight">
                        {value.title}
                      </h3>
                      <p className="mt-2 text-[14px] leading-relaxed text-foreground-600">{value.copy}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
  );
}

