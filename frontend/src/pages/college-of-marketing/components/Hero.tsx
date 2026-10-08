import Button from '@/components/base/Button';
import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import HeroPattern from '@/components/feature/HeroPattern';
import EditorialImage from '@/components/feature/EditorialImage';
import { externalImages } from '@/lib/externalImages';

const pathway = [
  { key: 'Level 4', value: 'Marketing Executive' },
  { key: 'Level 6', value: 'Marketing Manager' },
  { key: 'CIM', value: 'Professional and digital pathways' },
];

export default function Hero() {
  return (
    <section
      id="overview"
      className="hero-maroon-gradient warm-glow relative w-full scroll-mt-[148px] overflow-hidden text-background-50"
    >
      <HeroPattern />

      <div className="container-wide relative z-10 py-14 md:py-20">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow tone="gold">College of Marketing</Eyebrow>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="mt-6 font-heading text-[clamp(2.6rem,5vw,4.6rem)] font-semibold leading-[0.98] tracking-[-0.03em] text-background-50">
                Turn marketing activity into{' '}
                <span className="text-accent-400">commercial momentum.</span>
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="reading-width mt-7 text-[17px] leading-relaxed text-background-50/75">
                Develop confident marketing professionals who understand customers, shape stronger
                propositions, lead campaigns, use data and AI responsibly, and connect marketing
                decisions to business performance.
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button to="/college-of-marketing#programmes" variant="gold" arrow>
                  Explore marketing programmes
                </Button>
                <Button to="/college-of-marketing#employers" variant="outlineLight">
                  Book a workforce consultation
                </Button>
              </div>
            </Reveal>

            <Reveal delay={320}>
              <div className="mt-12 grid grid-cols-1 gap-6 border-t border-background-50/15 pt-8 sm:grid-cols-3">
                {pathway.map((item) => (
                  <div key={item.key}>
                    <span className="eyebrow text-accent-500">{item.key}</span>
                    <p className="mt-2 text-sm leading-snug text-background-50/80">{item.value}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-[420px]">
              <Reveal delay={160}>
                <div className="hero-float-image relative aspect-[4/5] overflow-hidden rounded-[16px] border border-background-50/12">
                  <EditorialImage
                    src={externalImages.marketingWorkshopPortrait}
                    alt="Marketing professionals collaborating in a strategy session at Kent Business College"
                    seed="kbc-hero-strategy-01"
                    className="h-full w-full object-cover"
                  />
                </div>
              </Reveal>

              <Reveal delay={340} className="absolute -left-6 top-10 hidden lg:block">
                <div className="hero-float-card-a rounded-[12px] border border-background-300 bg-background-50 p-4 text-foreground-900">
                  <div className="flex items-center gap-2">
                    <i className="ri-user-search-line text-primary-700" />
                    <span className="eyebrow text-foreground-500">Customer insight</span>
                  </div>
                  <p className="mt-2 font-heading text-lg font-semibold">Understand the market first</p>
                </div>
              </Reveal>

              <Reveal delay={460} className="absolute -right-4 bottom-16 hidden w-[190px] lg:block">
                <div className="hero-float-card-b rounded-[12px] bg-background-50 p-4 text-foreground-900 shadow-sm">
                  <div className="flex items-center gap-2">
                    <i className="ri-line-chart-line text-primary-700" />
                    <span className="eyebrow text-foreground-500">Marketing performance</span>
                  </div>
                  <p className="mt-2 text-sm leading-snug text-foreground-600">
                    Evidence-led decisions, measured against commercial outcomes.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={560} className="absolute -bottom-4 left-14 hidden lg:block">
                <div className="hero-float-badge rounded-full bg-accent-500 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-950">
                  CIM aligned route
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
