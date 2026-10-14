import Button from '@/components/base/Button';
import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import HeroPattern from '@/components/feature/HeroPattern';
import SiteFooter from '@/components/feature/SiteFooter';
import SiteHeader from '@/components/feature/SiteHeader';
import EligibilityChecker from '@/pages/college-of-marketing/components/EligibilityChecker';
import { useSeo } from '@/lib/seo';

const checks = [
  {
    title: 'Role fit',
    copy: 'Whether your current work is closer to campaign delivery, management or strategic leadership.',
    icon: 'ri-user-settings-line',
  },
  {
    title: 'Experience level',
    copy: 'How your marketing experience points toward Level 4, Level 6 or a guided conversation.',
    icon: 'ri-bar-chart-box-line',
  },
  {
    title: 'Next step',
    copy: 'A practical route into a programme page or a consultation if funding and fit need confirmation.',
    icon: 'ri-route-line',
  },
];

export default function Eligibility() {
  useSeo({
    title: 'Eligibility Checker',
    description:
      'Use the College of Marketing eligibility checker to explore whether Level 4, Level 6 or a consultation is the right next step.',
    path: '/eligibility-checker',
  });

  return (
    <div className="min-h-screen bg-background-100">
      <SiteHeader />
      <main id="main-content">
        <section className="hero-maroon-gradient warm-glow relative overflow-hidden pt-8 text-background-50 md:pt-10">
          <HeroPattern />
          <div className="container-wide relative z-10 px-6 py-14 md:px-14 md:py-20">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <Reveal>
                  <Eyebrow tone="gold">Eligibility checker</Eyebrow>
                </Reveal>
                <Reveal delay={80}>
                  <h1 className="mt-6 max-w-4xl font-heading text-[clamp(2.4rem,4.8vw,4.4rem)] font-semibold leading-[1.01] tracking-[-0.03em] text-background-50">
                    Find the marketing pathway that best fits your role.
                  </h1>
                </Reveal>
                <Reveal delay={160}>
                  <p className="reading-width mt-6 text-[17px] leading-relaxed text-background-50/75">
                    Answer three quick questions to get an indicative recommendation for Level 4,
                    Level 6, or a consultation where funding and role fit need a closer look.
                  </p>
                </Reveal>
                <Reveal delay={240}>
                  <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Button href="#checker" variant="gold" arrow>
                      Start the checker
                    </Button>
                    <Button to="/consultation" variant="outlineLight">
                      Book consultation
                    </Button>
                  </div>
                </Reveal>
              </div>

              <Reveal delay={200} className="lg:col-span-5">
                <div className="rounded-[18px] border border-background-50/12 bg-background-50/8 p-6 backdrop-blur-sm md:p-7">
                  <p className="eyebrow text-accent-400">Before you apply</p>
                  <div className="mt-6 space-y-5">
                    {checks.map((item) => (
                      <div key={item.title} className="flex gap-4">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-background-50/10 text-accent-400">
                          <i className={`${item.icon} text-lg`} />
                        </span>
                        <div>
                          <h2 className="font-body text-sm font-semibold text-background-50">{item.title}</h2>
                          <p className="mt-1 text-sm leading-relaxed text-background-50/68">{item.copy}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <div id="checker" className="scroll-mt-[148px]">
          <EligibilityChecker />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}