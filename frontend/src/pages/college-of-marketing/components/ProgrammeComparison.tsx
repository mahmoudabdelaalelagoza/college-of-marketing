import Button from '@/components/base/Button';
import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import EditorialImage from '@/components/feature/EditorialImage';

interface PanelData {
  level: string;
  title: string;
  heading: string;
  copy: string;
  focus: string[];
  pathway: string;
  cim: string;
  to: string;
  panelClass: string;
  image: string | null;
  seed: string;
}

const panels: PanelData[] = [
  {
    level: 'Level 4',
    title: 'Marketing Executive',
    heading: 'Build the professional and digital foundations of modern marketing.',
    copy: 'For professionals who plan and deliver marketing activity, work with customers and stakeholders, use digital channels and need a stronger framework for decision making and performance.',
    focus: [
      'Customer insight',
      'Campaign planning',
      'Content and channels',
      'Data',
      'Marketing technology',
      'Professional practice',
    ],
    pathway: 'Marketing Executive Level 4 apprenticeship',
    cim: 'CIM Level 4 Certificate pathway',
    to: '/college-of-marketing/marketing-executive-level-4',
    panelClass: 'panel-level4',
    image: null,
    seed: 'kbc-panel-l4-01',
  },
  {
    level: 'Level 6',
    title: 'Marketing Manager',
    heading: 'Move from campaign delivery to strategic marketing leadership.',
    copy: "For experienced marketers responsible for strategy, budgets, teams, agencies, brand, customer value and marketing's commercial contribution.",
    focus: [
      'Strategy',
      'Commercial intelligence',
      'Leadership',
      'Customer and brand',
      'Budgets',
      'Performance',
      'Responsible AI',
    ],
    pathway: 'Marketing Manager Level 6 apprenticeship',
    cim: 'CIM Level 6 Diploma pathway',
    to: '/college-of-marketing/marketing-manager-level-6',
    panelClass: 'panel-level6',
    image: null,
    seed: 'kbc-panel-l6-01',
  },
];

export default function ProgrammeComparison() {
  return (
    <section
      id="programmes"
      className="scroll-mt-[148px] border-y border-background-300 bg-background-100 py-20 md:py-28"
    >
      <div className="container-wide">
        <Reveal>
          <Eyebrow tone="maroon">Funded professional pathways</Eyebrow>
          <h2 className="mt-6 max-w-3xl font-heading text-[clamp(2rem,3.4vw,3.2rem)] font-semibold leading-[1.04] tracking-[-0.02em]">
            Two programmes. One connected marketing career journey.
          </h2>
          <p className="reading-width mt-5 text-[17px] leading-relaxed text-foreground-600">
            Choose the route that reflects the learner's current responsibility, experience and
            workplace opportunity.
          </p>
        </Reveal>

        <div className="relative mt-14">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {panels.map((panel, index) => (
              <Reveal key={panel.level} delay={index * 120}>
                <article
                  className={`${panel.panelClass} flex h-full flex-col rounded-[16px] p-8 text-background-50 md:p-10`}
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-accent-500 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-950">
                      {panel.level}
                    </span>
                    <span className="font-heading text-3xl text-background-50/35">
                      {index === 0 ? '04' : '06'}
                    </span>
                  </div>

                  <h3 className="mt-8 font-heading text-[clamp(1.8rem,2.6vw,2.4rem)] font-semibold leading-tight text-background-50">
                    {panel.title}
                  </h3>
                  <p className="mt-4 font-heading text-lg leading-snug text-accent-300/90">
                    {panel.heading}
                  </p>
                  <p className="mt-5 text-[15px] leading-relaxed text-background-50/70">
                    {panel.copy}
                  </p>

                  <div className="mt-8">
                    <p className="eyebrow text-background-50/45">Focus areas</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {panel.focus.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-background-50/15 px-3 py-1.5 text-xs text-background-50/80"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 space-y-3 border-t border-background-50/12 pt-6 text-sm">
                    <div className="flex items-start gap-3">
                      <i className="ri-award-line mt-0.5 text-accent-400" />
                      <span className="text-background-50/75">{panel.pathway}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <i className="ri-verified-badge-line mt-0.5 text-accent-400" />
                      <span className="text-background-50/75">{panel.cim}</span>
                    </div>
                  </div>

                  <div className="mt-6 overflow-hidden rounded-[12px] border border-background-50/15">
                    <EditorialImage
                      src={panel.image}
                      seed={panel.seed}
                      alt={panel.title}
                      className="h-40 w-full object-cover"
                    />
                  </div>

                  <div className="mt-8 pt-2">
                    <Button to={panel.to} variant="outlineLight" arrow>
                      Explore {panel.level}
                    </Button>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <div className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:flex">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-background-300 bg-background-50 shadow-sm">
              <i className="ri-arrow-right-line text-xl text-primary-800" />
            </div>
          </div>
        </div>

        <Reveal>
          <p className="mt-8 flex flex-wrap items-center gap-3 text-sm text-foreground-600">
            <span className="eyebrow text-foreground-500">Progression route</span>
            <span className="inline-flex items-center gap-2">
              Marketing Executive Level 4
              <i className="ri-arrow-right-line text-primary-700" />
              Marketing Manager Level 6
            </span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
