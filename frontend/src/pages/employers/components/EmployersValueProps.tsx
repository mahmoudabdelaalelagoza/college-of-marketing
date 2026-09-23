import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import { valueProps } from './data';

export default function EmployersValueProps() {
  return (
    <section className="container-wide py-20 md:py-28">
            <Reveal>
              <div className="max-w-2xl">
                <Eyebrow tone="maroon">Why partner with us</Eyebrow>
                <h2 className="mt-6 font-heading text-[clamp(2rem,3.2vw,3rem)] font-semibold leading-[1.04] tracking-[-0.02em]">
                  Capability that shows up in the work, not just in a certificate.
                </h2>
              </div>
            </Reveal>
    
            <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2">
              {valueProps.map((prop, index) => (
                <Reveal key={prop.title} delay={index * 70}>
                  <div>
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-100 text-secondary-800">
                      <i className={`${prop.icon} text-xl`} />
                    </span>
                    <h3 className="mt-5 font-heading text-lg font-semibold leading-tight">{prop.title}</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-foreground-600">{prop.copy}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
  );
}

