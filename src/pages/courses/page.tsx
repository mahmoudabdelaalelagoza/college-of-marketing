import Button from '@/components/base/Button';
import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import HeroPattern from '@/components/feature/HeroPattern';
import PageShell from '@/components/feature/PageShell';
import { secondaryNav } from '@/lib/nav';

const programmes = [
  {
    level: 'Level 4',
    tag: 'Marketing Executive',
    copy:
      'Build the professional and digital foundations of modern marketing. For marketers who plan and deliver activity and want a stronger framework for decisions, campaigns and performance.',
    meta: [
      { label: 'Qualification', value: 'CIM Level 4 Certificate' },
      { label: 'Duration', value: 'Approx. 18 months' },
      { label: 'Best for', value: 'Marketers delivering activity' },
    ],
    to: '/college-of-marketing/marketing-executive-level-4',
    panel: 'panel-level4',
    image:
      'https://readdy.ai/api/search-image?query=Young%20marketing%20professional%20planning%20a%20digital%20campaign%20on%20a%20laptop%20with%20printed%20notes%20and%20charts%2C%20editorial%20premium%20business%20photography%2C%20soft%20natural%20window%20light%2C%20muted%20maroon%20and%20cream%20tones%2C%20calm%20confident%20atmosphere&width=900&height=650&seq=kbc-courses-l4-01&orientation=landscape',
  },
  {
    level: 'Level 6',
    tag: 'Marketing Manager',
    copy:
      'Move from campaign delivery to strategic marketing leadership. For experienced marketers responsible for direction, customer value, budgets, teams and commercial performance.',
    meta: [
      { label: 'Qualification', value: 'CIM Level 6 Diploma' },
      { label: 'Duration', value: 'Approx. 18 months' },
      { label: 'Best for', value: 'Strategic marketing leaders' },
    ],
    to: '/college-of-marketing/marketing-manager-level-6',
    panel: 'panel-level6',
    image:
      'https://readdy.ai/api/search-image?query=Senior%20marketing%20manager%20leading%20a%20strategic%20planning%20session%20in%20a%20bright%20meeting%20room%20with%20a%20large%20whiteboard%20of%20plans%2C%20editorial%20premium%20business%20photography%2C%20warm%20natural%20light%2C%20muted%20warm%20neutral%20tones&width=900&height=650&seq=kbc-courses-l6-01&orientation=landscape',
  },
];

const modules = [
  {
    icon: 'ri-user-search-line',
    title: 'Customer insight',
    copy: 'Understand audiences, markets and behaviour to ground every decision in evidence.',
  },
  {
    icon: 'ri-megaphone-line',
    title: 'Campaign planning',
    copy: 'Turn insight into integrated campaigns with clear objectives, channels and budgets.',
  },
  {
    icon: 'ri-bar-chart-box-line',
    title: 'Data & measurement',
    copy: 'Build measurement frameworks that connect activity to commercial outcomes.',
  },
  {
    icon: 'ri-robot-2-line',
    title: 'Digital & AI',
    copy: 'Use digital tools and AI responsibly as part of everyday marketing practice.',
  },
  {
    icon: 'ri-scales-3-line',
    title: 'Ethics & compliance',
    copy: 'Apply data protection and ethical standards across every marketing decision.',
  },
  {
    icon: 'ri-lightbulb-line',
    title: 'Brand & proposition',
    copy: 'Shape positioning, messaging and propositions that create real customer value.',
  },
];

const shortCourses = [
  {
    title: 'Marketing analytics essentials',
    duration: '1 day',
    copy: 'Read performance data with confidence and turn insight into clearer decisions.',
  },
  {
    title: 'AI for marketers',
    duration: 'Half day',
    copy: 'Practical, responsible ways to apply AI to content, insight and productivity.',
  },
  {
    title: 'Brand strategy foundations',
    duration: '2 days',
    copy: 'Clarify positioning, proposition and messaging for stronger brand presence.',
  },
];

export default function Courses() {
  return (
    <PageShell navItems={secondaryNav}>
      {/* Hero */}
      <section className="container-wide pt-8 md:pt-10">
        <div className="hero-maroon-gradient warm-glow relative overflow-hidden rounded-[18px] px-6 py-14 text-background-50 md:px-14 md:py-20">
          <HeroPattern />
          <div className="relative z-10">
            <Reveal>
              <Eyebrow tone="gold">Courses &amp; programmes</Eyebrow>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-6 max-w-3xl font-heading text-[clamp(2.4rem,4.5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-background-50">
                Professional marketing programmes, built for the working marketer.
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="reading-width mt-6 text-[17px] leading-relaxed text-background-50/75">
                Two funded apprenticeship pathways — plus focused short courses — designed to turn
                marketing activity into measurable commercial momentum.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button to="/courses#programmes" variant="gold" arrow>
                  Explore programmes
                </Button>
                <Button to="/college-of-marketing#eligibility" variant="outlineLight">
                  Check my eligibility
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Programmes */}
      <section id="programmes" className="container-wide scroll-mt-[148px] py-20 md:py-28">
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow tone="maroon">Apprenticeship programmes</Eyebrow>
              <h2 className="mt-6 max-w-2xl font-heading text-[clamp(2rem,3.2vw,3rem)] font-semibold leading-[1.04] tracking-[-0.02em]">
                Two pathways, one clear progression.
              </h2>
            </div>
            <p className="max-w-sm text-[15px] leading-relaxed text-foreground-600">
              Both are designed as apprenticeships and aligned to the Chartered Institute of
              Marketing.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {programmes.map((programme, index) => (
            <Reveal key={programme.level} delay={index * 100}>
              <article className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-background-300 bg-background-50">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={programme.image}
                    alt={programme.tag}
                    title={`${programme.level} — ${programme.tag}`}
                    className="h-full w-full object-top transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <span className="absolute left-5 top-5 rounded-full bg-background-50/90 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground-800 backdrop-blur">
                    {programme.level}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-8">
                  <p className="eyebrow text-accent-700">{programme.tag}</p>
                  <h3 className="mt-3 font-heading text-2xl font-semibold leading-tight">
                    {programme.tag} — {programme.level}
                  </h3>
                  <p className="mt-4 text-[15px] leading-relaxed text-foreground-600">
                    {programme.copy}
                  </p>

                  <dl className="mt-7 grid grid-cols-1 gap-4 border-t border-background-200 pt-6 sm:grid-cols-3">
                    {programme.meta.map((item) => (
                      <div key={item.label}>
                        <dt className="eyebrow text-foreground-500">{item.label}</dt>
                        <dd className="mt-1.5 text-sm font-medium text-foreground-800">
                          {item.value}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-8">
                    <Button to={programme.to} variant="primary" arrow>
                      View programme
                    </Button>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Modules */}
      <section className="border-y border-background-300 bg-background-100 py-20 md:py-28">
        <div className="container-wide">
          <Reveal>
            <div className="max-w-2xl">
              <Eyebrow tone="maroon">What you'll learn</Eyebrow>
              <h2 className="mt-6 font-heading text-[clamp(2rem,3.2vw,3rem)] font-semibold leading-[1.04] tracking-[-0.02em]">
                A complete marketing capability, applied to real work.
              </h2>
            </div>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((module, index) => (
              <Reveal key={module.title} delay={index * 60}>
                <div className="flex gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary-100 text-secondary-800">
                    <i className={`${module.icon} text-xl`} />
                  </span>
                  <div>
                    <h3 className="font-heading text-lg font-semibold leading-tight">
                      {module.title}
                    </h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-foreground-600">
                      {module.copy}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Short courses */}
      <section className="container-wide py-20 md:py-28">
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow tone="maroon">Short courses</Eyebrow>
              <h2 className="mt-6 max-w-2xl font-heading text-[clamp(2rem,3.2vw,3rem)] font-semibold leading-[1.04] tracking-[-0.02em]">
                Focused workshops for busy teams.
              </h2>
            </div>
            <p className="max-w-sm text-[15px] leading-relaxed text-foreground-600">
              Practical, half-day to two-day sessions to sharpen a specific capability.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {shortCourses.map((course, index) => (
            <Reveal key={course.title} delay={index * 80}>
              <article className="flex h-full flex-col rounded-[16px] border border-background-300 bg-background-50 p-7">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-primary-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-800">
                    {course.duration}
                  </span>
                  <i className="ri-arrow-right-up-line text-lg text-foreground-400" />
                </div>
                <h3 className="mt-5 font-heading text-xl font-semibold leading-tight">
                  {course.title}
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-foreground-600">
                  {course.copy}
                </p>
                <Button to="/employers" variant="link" className="mt-auto self-start pt-5">
                  Enquire
                </Button>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-wide pb-20 md:pb-28">
        <div className="hero-maroon-gradient warm-glow relative overflow-hidden rounded-[18px] px-6 py-14 text-background-50 md:px-14 md:py-16">
          <HeroPattern variant="compact" />
          <div className="relative z-10 flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Eyebrow tone="gold">Not sure which fits?</Eyebrow>
              <h2 className="mt-5 max-w-xl font-heading text-[clamp(1.8rem,3vw,2.6rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-background-50">
                Find your pathway in under a minute.
              </h2>
            </div>
            <Button to="/college-of-marketing#eligibility" variant="gold" arrow>
              Check my eligibility
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}