import { useState } from 'react';
import Button from '@/components/base/Button';
import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import HeroPattern from '@/components/feature/HeroPattern';
import PageShell from '@/components/feature/PageShell';
import { secondaryNav } from '@/lib/nav';
import { faqItems } from '@/pages/college-of-marketing/faq-data';

const employerFaqs = [
  {
    question: 'How much time does my team need to commit?',
    answer:
      'Learners typically spend a few hours a week on structured learning alongside their normal role. Employers support workplace application and join periodic progress reviews, which we keep focused and predictable.',
  },
  {
    question: 'Can we enrol more than one learner?',
    answer:
      'Yes. Many employers enrol several marketers at once, sometimes across both Level 4 and Level 6, depending on team structure and development needs.',
  },
  {
    question: 'What if our sector is unusual?',
    answer:
      'The principles of commercial marketing apply across sectors. We tailor workplace application to your context, so learners produce evidence relevant to your market and customers.',
  },
];

const fundingFaqs = [
  {
    question: 'Does the learner have to pay anything?',
    answer:
      'When funded through the apprenticeship system, training and assessment are typically covered by the employer\'s levy or co-investment rather than by the learner directly.',
  },
  {
    question: 'What are the eligibility requirements?',
    answer:
      'Learners usually need to be employed, working in a relevant marketing role, and meet residency and prior attainment requirements. We confirm the exact position for your circumstances.',
  },
];

function AccordionGroup({
  title,
  items,
}: {
  title: string;
  items: { question: string; answer: string }[];
}) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div>
      <h3 className="font-heading text-xl font-semibold text-foreground-950">{title}</h3>
      <div className="mt-4 border-t border-background-300">
        {items.map((item, index) => {
          const isOpen = open === index;
          return (
            <div key={item.question} className="border-b border-background-300">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-6 py-5 text-left"
                aria-expanded={isOpen}
              >
                <span className="font-heading text-base font-semibold leading-snug text-foreground-950 md:text-lg">
                  {item.question}
                </span>
                <i
                  className={`ri-add-line shrink-0 text-lg text-primary-700 transition-transform duration-300 ${
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
                  <p className="max-w-2xl pb-5 text-[15px] leading-relaxed text-foreground-600">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function FAQ() {
  return (
    <PageShell navItems={secondaryNav}>
      {/* Hero */}
      <section className="container-wide pt-8 md:pt-10">
        <div className="hero-maroon-gradient warm-glow relative overflow-hidden rounded-[18px] px-6 py-14 text-background-50 md:px-14 md:py-20">
          <HeroPattern />
          <div className="relative z-10">
            <Reveal>
              <Eyebrow tone="gold">Frequently asked questions</Eyebrow>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-6 max-w-3xl font-heading text-[clamp(2.4rem,4.5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-background-50">
                Questions, answered clearly.
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="reading-width mt-6 text-[17px] leading-relaxed text-background-50/75">
                The answers we're most often asked, grouped by learner, employer and funding. Still
                unsure? Use the eligibility checker or speak with an adviser.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button to="/college-of-marketing#eligibility" variant="gold" arrow>
                  Check my eligibility
                </Button>
                <Button to="/employers" variant="outlineLight">
                  Book a consultation
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ groups */}
      <section className="container-wide py-20 md:py-28">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Reveal>
              <Eyebrow tone="maroon">Topics</Eyebrow>
              <h2 className="mt-6 font-heading text-[clamp(2rem,3.2vw,3rem)] font-semibold leading-[1.04] tracking-[-0.02em]">
                Browse by topic.
              </h2>
              <div className="mt-8 space-y-3">
                {['Learners', 'Employers', 'Funding'].map((topic) => (
                  <a
                    key={topic}
                    href={`#${topic.toLowerCase()}`}
                    className="flex items-center gap-3 text-sm font-medium text-foreground-700 transition-colors hover:text-primary-800"
                  >
                    <i className="ri-arrow-right-s-line text-lg text-accent-700" />
                    {topic}
                  </a>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            <div className="space-y-14">
              <Reveal>
                <div id="learners" className="scroll-mt-[148px]">
                  <AccordionGroup title="Learners" items={faqItems} />
                </div>
              </Reveal>
              <Reveal>
                <div id="employers" className="scroll-mt-[148px]">
                  <AccordionGroup title="Employers" items={employerFaqs} />
                </div>
              </Reveal>
              <Reveal>
                <div id="funding" className="scroll-mt-[148px]">
                  <AccordionGroup title="Funding" items={fundingFaqs} />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-wide pb-20 md:pb-28">
        <div className="hero-maroon-gradient warm-glow relative overflow-hidden rounded-[18px] px-6 py-14 text-background-50 md:px-14 md:py-16">
          <HeroPattern variant="compact" />
          <div className="relative z-10 flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Eyebrow tone="gold">Still have a question?</Eyebrow>
              <h2 className="mt-5 max-w-xl font-heading text-[clamp(1.8rem,3vw,2.6rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-background-50">
                We're happy to talk it through with you.
              </h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button to="/employers" variant="gold" arrow>
                Book a consultation
              </Button>
              <Button to="/courses" variant="outlineLight">
                View courses
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
