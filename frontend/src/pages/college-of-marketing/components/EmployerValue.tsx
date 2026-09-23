import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import LeadForm from '@/components/feature/LeadForm';

const valueProps = [
  {
    icon: 'ri-focus-3-line',
    title: 'Capability that shows in the work',
    copy: 'Employees apply learning to live briefs, campaigns and decisions - producing outputs the business can use immediately.',
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

export default function EmployerValue() {
  return (
    <section id="employers" className="container-wide scroll-mt-[148px] py-20 md:py-28">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-6">
          <Reveal>
            <Eyebrow tone="maroon">Employer value</Eyebrow>
            <h2 className="mt-6 font-heading text-[clamp(2rem,3.2vw,3rem)] font-semibold leading-[1.04] tracking-[-0.02em]">
              Build marketing capability that pays back in the business.
            </h2>
            <p className="reading-width mt-5 text-[17px] leading-relaxed text-foreground-600">
              Apprenticeships are designed for working marketers. Learning is applied to real
              responsibilities, so capability develops alongside delivery rather than in isolation.
            </p>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2">
            {valueProps.map((prop, index) => (
              <Reveal key={prop.title} delay={index * 70}>
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary-100 text-secondary-800">
                    <i className={`${prop.icon} text-lg`} />
                  </div>
                  <h3 className="mt-5 font-heading text-lg font-semibold leading-tight">
                    {prop.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-foreground-600">{prop.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="lg:col-span-6">
          <Reveal delay={120}>
            <div className="mb-6 overflow-hidden rounded-[16px] border border-background-300">
              <img
                src="https://readdy.ai/api/search-image?query=HR%20and%20marketing%20leaders%20discussing%20workforce%20development%20around%20a%20conference%20table%20with%20a%20laptop%20and%20printed%20plans%2C%20editorial%20premium%20business%20photography%2C%20warm%20natural%20light%2C%20muted%20maroon%20and%20cream%20tones%2C%20collaborative%20professional%20atmosphere&width=900&height=560&seq=kbc-employer-01&orientation=landscape"
                alt="Employers discussing workforce marketing capability"
                title="Workforce marketing capability - College of Marketing"
                className="h-[240px] w-full object-top md:h-[280px]"
              />
            </div>
            <div className="rounded-[16px] border border-background-300 bg-background-100 p-8 md:p-10">
              <h3 className="font-heading text-2xl font-semibold leading-tight">
                Book a workforce consultation
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-foreground-600">
                Tell us about your team, the capability you want to build and any development
                priorities. We will suggest the most suitable pathway.
              </p>
              <div className="mt-8">
                <LeadForm
                  formId="employer-consultation-form"
                  submitAddr="/api/leads"
                  submitLabel="Book a consultation"
                  successMessage="Thank you. Our employer team will contact you to arrange your workforce consultation."
                />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

