import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import HeroPattern from '@/components/feature/HeroPattern';
import LeadForm from '@/components/feature/LeadForm';

export default function FinalCTA() {
  return (
    <section id="apply" className="container-wide scroll-mt-[148px] py-20 md:py-28">
      <div className="hero-maroon-gradient warm-glow relative overflow-hidden rounded-[18px] px-6 py-14 text-background-50 md:px-14 md:py-20">
        <HeroPattern variant="compact" />
        <div className="relative z-10 grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow tone="gold">Next step</Eyebrow>
              <h2 className="mt-6 font-heading text-[clamp(2rem,3.4vw,3.2rem)] font-semibold leading-[1.04] tracking-[-0.02em] text-background-50">
                Ready to build marketing capability that lasts?
              </h2>
              <p className="reading-width mt-5 text-[16px] leading-relaxed text-background-50/70">
                Tell us about yourself or your team and we will help you choose the right pathway,
                understand funding and take the next practical step.
              </p>

              <div className="mt-9 space-y-4 border-t border-background-50/15 pt-8 text-sm">
                {[
                  'A clear recommendation between Level 4 and Level 6',
                  'Guidance on apprenticeship funding and eligibility',
                  'Support for learners and employers alike',
                ].map((item) => (
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
                formId="programme-application-form"
                submitAddr="/api/leads"
                submitLabel="Submit enquiry"
                tone="dark"
                successMessage="Thank you. We have received your enquiry and will be in touch shortly."
              />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

