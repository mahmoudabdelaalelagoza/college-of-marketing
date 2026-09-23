import Button from '@/components/base/Button';
import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import HeroPattern from '@/components/feature/HeroPattern';
import PageShell from '@/components/feature/PageShell';
import { secondaryNav } from '@/lib/nav';

const fundingTypes = [
  {
    icon: 'ri-bank-card-line',
    title: 'Levy funded',
    copy: 'Employers with an apprenticeship service account can use levy funds to cover training and assessment.',
  },
  {
    icon: 'ri-hand-heart-line',
    title: 'Co-investment',
    copy: 'Some employers co-invest a proportion of the cost; support may be available depending on size and learner age.',
  },
  {
    icon: 'ri-user-star-line',
    title: 'Learner eligibility',
    copy: 'Learners typically need to be employed, working in a relevant role, and meet residency and prior attainment requirements.',
  },
  {
    icon: 'ri-bank-line',
    title: 'Salary',
    copy: 'Apprentices must be employed and paid at least the relevant minimum wage for their age and role.',
  },
];

const steps = [
  { title: 'Confirm eligibility', copy: 'Check role, experience and employment status against the apprenticeship standard.' },
  { title: 'Agree the pathway', copy: 'Choose the level that matches current responsibility and workplace opportunity.' },
  { title: 'Onboard and start', copy: 'Complete enrolment, agree a learning plan and begin structured development.' },
  { title: 'Review and progress', copy: 'Regular progress reviews with learner and employer keep development on track.' },
];

export default function Funding() {
  return (
    <PageShell navItems={secondaryNav}>
      {/* Hero */}
      <section className="container-wide pt-8 md:pt-10">
        <div className="hero-maroon-gradient warm-glow relative overflow-hidden rounded-[18px] px-6 py-14 text-background-50 md:px-14 md:py-20">
          <HeroPattern />
          <div className="relative z-10">
            <Reveal>
              <Eyebrow tone="gold">Funding</Eyebrow>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-6 max-w-3xl font-heading text-[clamp(2.4rem,4.5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-background-50">
                How apprenticeship funding may apply.
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="reading-width mt-6 text-[17px] leading-relaxed text-background-50/75">
                Both programmes are designed as apprenticeships, which means training and assessment
                may be funded through the apprenticeship system rather than paid for directly by the
                learner.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button to="/college-of-marketing#eligibility" variant="gold" arrow>
                  Check my eligibility
                </Button>
                <Button to="/employers" variant="outlineLight">
                  Book a workforce consultation
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Funding types */}
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

      {/* Steps */}
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

      {/* CTA */}
      <section className="container-wide py-20 md:py-28">
        <div className="hero-maroon-gradient warm-glow relative overflow-hidden rounded-[18px] px-6 py-14 text-background-50 md:px-14 md:py-16">
          <HeroPattern variant="compact" />
          <div className="relative z-10 flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Eyebrow tone="gold">Still unsure?</Eyebrow>
              <h2 className="mt-5 max-w-xl font-heading text-[clamp(1.8rem,3vw,2.6rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-background-50">
                We'll confirm the current position for your organisation.
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-background-50/70">
                Funding rules can change. We will confirm what applies to you and your learner
                during the consultation.
              </p>
            </div>
            <Button to="/employers" variant="gold" arrow>
              Book a consultation
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}