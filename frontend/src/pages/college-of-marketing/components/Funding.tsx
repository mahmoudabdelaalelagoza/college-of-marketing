import Button from '@/components/base/Button';
import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import EditorialImage from '@/components/feature/EditorialImage';

const facts = [
  { label: 'Levy funded', value: 'Employers with an apprenticeship service account can use levy funds to cover training and assessment.' },
  { label: 'Co-investment', value: 'Some employers co-invest a proportion of the cost; support may be available depending on size and learner age.' },
  { label: 'Eligibility', value: 'Learners typically need to be employed, working in a relevant role, and meet residency and prior attainment requirements.' },
  { label: 'Salary', value: 'Apprentices must be employed and paid at least the relevant minimum wage for their age and role.' },
];

const steps = [
  { title: 'Confirm eligibility', copy: 'Check role, experience and employment status against the apprenticeship standard.' },
  { title: 'Agree the pathway', copy: 'Choose the level that matches current responsibility and workplace opportunity.' },
  { title: 'Onboard and start', copy: 'Complete enrolment, agree a learning plan and begin structured development.' },
  { title: 'Review and progress', copy: 'Regular progress reviews with learner and employer keep development on track.' },
];

export default function Funding() {
  return (
    <section id="funding" className="scroll-mt-[148px] bg-background-100 py-20 md:py-28">
      <div className="container-wide">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow tone="maroon">Funding</Eyebrow>
              <h2 className="mt-6 font-heading text-[clamp(2rem,3.4vw,3.2rem)] font-semibold leading-[1.04] tracking-[-0.02em]">
                How apprenticeship funding may apply.
              </h2>
              <p className="reading-width mt-5 text-[17px] leading-relaxed text-foreground-600">
                Both programmes are designed as apprenticeships, which means training and assessment
                may be funded through the apprenticeship system rather than paid for directly by the
                learner. The route depends on your organisation's circumstances.
              </p>
            </Reveal>

            <div className="mt-10 flex flex-col border-t border-background-300">
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

          <div className="lg:col-span-5">
            <Reveal delay={120}>
              <div className="mb-6 overflow-hidden rounded-[14px] border border-background-300">
                <EditorialImage
                  alt="Reviewing apprenticeship funding guidance"
                  seed="kbc-funding-01"
                  className="h-[240px] w-full object-cover md:h-[280px]"
                />
              </div>
              <div className="rounded-[16px] border border-background-300 bg-background-50 p-8">
                <h3 className="font-heading text-2xl font-semibold leading-tight">At a glance</h3>
                <div className="mt-6 flex flex-col gap-5">
                  {facts.map((fact) => (
                    <div key={fact.label} className="border-b border-background-200 pb-5 last:border-0 last:pb-0">
                      <p className="eyebrow text-foreground-500">{fact.label}</p>
                      <p className="mt-2 text-[14px] leading-relaxed text-foreground-700">
                        {fact.value}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-7">
                  <Button to="/college-of-marketing#eligibility" variant="primary" arrow>
                    Check my eligibility
                  </Button>
                </div>
                <p className="mt-5 text-xs leading-relaxed text-foreground-500">
                  Funding rules can change. We will confirm the current position for your organisation
                  and learner during the consultation.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
