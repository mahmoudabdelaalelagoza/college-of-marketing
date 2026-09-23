import Button from '@/components/base/Button';
import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import LeadForm from '@/components/feature/LeadForm';
import HeroPattern from '@/components/feature/HeroPattern';
import PageShell from '@/components/feature/PageShell';
import { secondaryNav } from '@/lib/nav';

const valueProps = [
  {
    icon: 'ri-focus-3-line',
    title: 'Capability that shows in the work',
    copy: 'Employees apply learning to live briefs, campaigns and decisions — producing outputs the business can use immediately.',
  },
  {
    icon: 'ri-line-chart-line',
    title: 'Commercial contribution',
    copy: 'Marketers learn to connect activity to customer value, revenue and measurable business outcomes.',
  },
  {
    icon: 'ri-shield-check-line',
    title: 'Responsible practice',
    copy: 'Data, ethics and AI are taught as part of everyday decision making, not as an afterthought.',
  },
  {
    icon: 'ri-user-voice-line',
    title: 'Minimal employer overhead',
    copy: 'Structured reviews and clear expectations keep employer involvement focused and predictable.',
  },
];

const steps = [
  {
    title: 'Tell us your priorities',
    copy: 'Share the capability you want to build and the challenges your team is facing.',
  },
  {
    title: 'We recommend a pathway',
    copy: 'We suggest the right level and approach for your people and organisation.',
  },
  {
    title: 'Confirm funding',
    copy: 'We clarify how apprenticeship funding may apply and what it means for you.',
  },
  {
    title: 'Learners start and progress',
    copy: 'Development runs alongside delivery, with structured reviews throughout.',
  },
];

const sectors = [
  'Retail & e-commerce',
  'Professional services',
  'Manufacturing',
  'Technology',
  'Financial services',
  'Not-for-profit',
];

export default function Employers() {
  return (
    <PageShell navItems={secondaryNav}>
      {/* Hero */}
      <section className="container-wide pt-8 md:pt-10">
        <div className="hero-maroon-gradient warm-glow relative overflow-hidden rounded-[18px] px-6 py-14 text-background-50 md:px-14 md:py-20">
          <HeroPattern />
          <div className="relative z-10">
            <Reveal>
              <Eyebrow tone="gold">For employers</Eyebrow>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-6 max-w-3xl font-heading text-[clamp(2.4rem,4.5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-background-50">
                Build marketing capability that pays back in the business.
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="reading-width mt-6 text-[17px] leading-relaxed text-background-50/75">
                Apprenticeships are designed for working marketers. Learning is applied to real
                responsibilities, so capability develops alongside delivery rather than in isolation.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button to="/employers#consultation" variant="gold" arrow>
                  Book a workforce consultation
                </Button>
                <Button to="/funding" variant="outlineLight">
                  Understand funding
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Value props */}
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

      {/* How it works */}
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

      {/* Sectors */}
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

      {/* Consultation */}
      <section id="consultation" className="container-wide scroll-mt-[148px] pb-20 md:pb-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow tone="maroon">Workforce consultation</Eyebrow>
              <h2 className="mt-6 font-heading text-[clamp(2rem,3.2vw,3rem)] font-semibold leading-[1.04] tracking-[-0.02em]">
                Talk to us about your team.
              </h2>
              <p className="reading-width mt-5 text-[15px] leading-relaxed text-foreground-600">
                Tell us about your team, the capability you want to build and any development
                priorities. We will suggest the most suitable pathway.
              </p>
              <div className="mt-8 space-y-4 border-t border-background-300 pt-8 text-sm">
                {[
                  'A clear recommendation between Level 4 and Level 6',
                  'Guidance on apprenticeship funding and eligibility',
                  'Support for learners and employers alike',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <i className="ri-check-line mt-0.5 text-accent-700" />
                    <span className="text-foreground-700">{item}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <Reveal delay={120}>
              <div className="rounded-[16px] border border-background-300 bg-background-100 p-8 md:p-10">
                <LeadForm
                  formId="employer-consultation-form"
                  submitAddr="/api/leads"
                  submitLabel="Book a consultation"
                  successMessage="Thank you. Our employer team will contact you to arrange your workforce consultation."
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
