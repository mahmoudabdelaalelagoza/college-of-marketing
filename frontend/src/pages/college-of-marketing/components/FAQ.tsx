import { useState } from 'react';
import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import { faqItems } from '../faq-data';

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-[148px] border-y border-background-300 bg-background-100 py-20 md:py-28">
      <div className="container-wide">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Reveal>
              <Eyebrow tone="maroon">FAQ</Eyebrow>
              <h2 className="mt-6 font-heading text-[clamp(2rem,3.2vw,3rem)] font-semibold leading-[1.04] tracking-[-0.02em]">
                Questions, answered clearly.
              </h2>
              <p className="mt-5 text-[15px] leading-relaxed text-foreground-600">
                Still unsure which pathway fits? Use the eligibility checker or speak with an
                adviser.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            <div className="border-t border-background-300">
              {faqItems.map((item, index) => {
                const isOpen = open === index;
                return (
                  <Reveal key={item.question} delay={index * 40}>
                    <div className="border-b border-background-300">
                      <button
                        type="button"
                        onClick={() => setOpen(isOpen ? null : index)}
                        className="flex w-full items-center justify-between gap-6 py-6 text-left"
                        aria-expanded={isOpen}
                      >
                        <h3 className="font-heading text-lg font-semibold leading-snug text-foreground-950 md:text-xl">
                          {item.question}
                        </h3>
                        <i
                          className={`ri-add-line shrink-0 text-xl text-primary-700 transition-transform duration-300 ${
                            isOpen ? 'rotate-45' : ''
                          }`}
                        />
                      </button>
                      <div
                        className={`grid transition-all duration-500 ease-out ${
                          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p className="max-w-2xl pb-6 text-[15px] leading-relaxed text-foreground-600">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

