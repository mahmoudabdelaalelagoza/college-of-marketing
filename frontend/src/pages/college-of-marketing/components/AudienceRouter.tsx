import Reveal from '@/components/base/Reveal';

export default function AudienceRouter() {
  return (
    <section className="bg-background-50 py-20 md:py-28">
      <div className="container-wide">
        <Reveal>
          <h2 className="max-w-2xl font-heading text-[clamp(2rem,3.2vw,3rem)] font-semibold leading-[1.05] tracking-[-0.02em]">
            What are you looking to develop?
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Reveal delay={80}>
            <a
              href="#programmes"
              className="group flex h-full flex-col justify-between rounded-[14px] border border-background-300 bg-background-100 p-8 transition-all duration-300 hover:-translate-y-[3px] md:p-10"
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-800">
                  <i className="ri-user-star-line text-xl" />
                </div>
                <p className="eyebrow mt-8 text-foreground-500">For individuals</p>
                <h3 className="mt-3 font-heading text-[clamp(1.5rem,2.2vw,2rem)] font-semibold leading-tight">
                  I am a marketing professional
                </h3>
                <p className="mt-4 text-[15px] leading-relaxed text-foreground-600">
                  Build stronger marketing judgement, workplace capability and professional
                  progression.
                </p>
              </div>
              <div className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-primary-800">
                Find my programme
                <i className="ri-arrow-right-line transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </a>
          </Reveal>

          <Reveal delay={160}>
            <a
              href="#employers"
              className="group flex h-full flex-col justify-between rounded-[14px] border border-primary-900/20 bg-primary-900 p-8 text-background-50 transition-all duration-300 hover:-translate-y-[3px] md:p-10"
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background-50/10 text-accent-400">
                  <i className="ri-team-line text-xl" />
                </div>
                <p className="eyebrow mt-8 text-accent-500">For employers</p>
                <h3 className="mt-3 font-heading text-[clamp(1.5rem,2.2vw,2rem)] font-semibold leading-tight">
                  I am developing a marketing team
                </h3>
                <p className="mt-4 text-[15px] leading-relaxed text-background-50/70">
                  Build customer, digital and commercial capability across your organisation.
                </p>
              </div>
              <div className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-accent-400">
                Explore employer solutions
                <i className="ri-arrow-right-line transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

