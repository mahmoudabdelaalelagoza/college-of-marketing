import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import { modules } from './data';

export default function CoursesModules() {
  return (
    <section className="border-y border-background-300 bg-background-100 py-20 md:py-28">
            <div className="container-wide">
              <Reveal>
                <div className="max-w-2xl">
                  <Eyebrow tone="maroon">What you'll learn</Eyebrow>
                  <h2 className="mt-6 font-heading text-[clamp(2rem,3.2vw,3rem)] font-semibold leading-[1.04] tracking-[-0.02em]">
                    A complete marketing capability, applied to real work.
                  </h2>
                </div>
              </Reveal>
    
              <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {modules.map((module, index) => (
                  <Reveal key={module.title} delay={index * 60}>
                    <div className="flex gap-4">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary-100 text-secondary-800">
                        <i className={`${module.icon} text-xl`} />
                      </span>
                      <div>
                        <h3 className="font-heading text-lg font-semibold leading-tight">
                          {module.title}
                        </h3>
                        <p className="mt-2 text-[14px] leading-relaxed text-foreground-600">
                          {module.copy}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
  );
}

