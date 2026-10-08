import Button from '@/components/base/Button';
import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import HeroPattern from '@/components/feature/HeroPattern';
import LeadForm from '@/components/feature/LeadForm';
import type { ProgrammeConfig } from '../types';

interface ProgrammeCTAProps {
  config: ProgrammeConfig;
}

export default function ProgrammeCTA({ config }: ProgrammeCTAProps) {
  const { cta, related } = config;

  return (
    <section id="apply" className="container-wide scroll-mt-[148px] pb-20 md:pb-28">
      <div className="hero-maroon-gradient warm-glow relative overflow-hidden rounded-[18px] px-6 py-14 text-background-50 md:px-14 md:py-20">
        <HeroPattern variant="compact" />
        <div className="relative z-10 grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow tone="gold">Next step</Eyebrow>
              <h2 className="mt-6 font-heading text-[clamp(2rem,3.4vw,3.2rem)] font-semibold leading-[1.04] tracking-[-0.02em] text-background-50">
                {cta.heading}
              </h2>
              <p className="reading-width mt-5 text-[16px] leading-relaxed text-background-50/70">
                {cta.body}
              </p>

              <div className="mt-9 space-y-4 border-t border-background-50/15 pt-8 text-sm">
                {cta.bullets.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <i className="ri-check-line mt-0.5 text-accent-400" />
                    <span className="text-background-50/80">{item}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={120}>
              <LeadForm
                formId={cta.formId}
               submitLabel={cta.submitLabel}
                tone="dark"
                successMessage={cta.successMessage}
              />
            </Reveal>
          </div>
        </div>
      </div>

      <Reveal>
        <div className="mt-10 flex flex-col items-start gap-5 rounded-[16px] border border-background-300 bg-background-100 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow text-foreground-500">{related.label}</p>
            <h3 className="mt-2 font-heading text-2xl font-semibold leading-tight text-foreground-950">
              {related.title}
            </h3>
            <p className="mt-1.5 max-w-xl text-[14px] leading-relaxed text-foreground-600">
              {related.copy}
            </p>
          </div>
          <Button to={related.to} variant="primary" arrow className="shrink-0">
            Explore {related.title}
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
