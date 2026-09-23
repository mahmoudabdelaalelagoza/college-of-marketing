import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import LeadForm from '@/components/feature/LeadForm';

export default function EmployersConsultation() {
  return (
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
  );
}

