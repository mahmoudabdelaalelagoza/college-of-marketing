import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import HeroPattern from '@/components/feature/HeroPattern';
import EditorialImage from '@/components/feature/EditorialImage';
import { externalImages } from '@/lib/externalImages';

const stages = [
  {
    number: '01',
    title: 'Define the business question',
    copy: 'Clarify the decision, customer, outcome and constraints.',
  },
  {
    number: '02',
    title: 'Gather and interpret evidence',
    copy: 'Combine customer, market, channel and commercial information.',
  },
  {
    number: '03',
    title: 'Design the response',
    copy: 'Shape proposition, journey, campaign, content and measures.',
  },
  {
    number: '04',
    title: 'Measure, learn and improve',
    copy: 'Use evidence to explain impact and improve the next decision.',
  },
];

const socialMoments = [
  {
    caption: 'Creating social content',
    image: externalImages.onlineMarketingMeeting,
    seed: 'kbc-os-social-01',
  },
  {
    caption: 'Campaign launch events',
    image: externalImages.teamPresentationWide,
    seed: 'kbc-os-launch-01',
  },
  {
    caption: 'Networking & community',
    image: externalImages.collaborationWorkspace,
    seed: 'kbc-os-network-01',
  },
];

export default function WorkplaceOS() {
  return (
    <section
      id="workplace-os"
      className="relative scroll-mt-[148px] overflow-hidden bg-primary-950 py-20 text-background-50 md:py-28"
    >
      <HeroPattern variant="compact" />
      <div className="container-wide relative z-10">
        <Reveal>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow tone="gold">Workplace marketing operating system</Eyebrow>
              <h2 className="mt-6 font-heading text-[clamp(2rem,3.4vw,3.2rem)] font-semibold leading-[1.04] tracking-[-0.02em] text-background-50">
                From a business question to an evidence led decision.
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-[17px] leading-relaxed text-background-50/70">
                The learning journey helps marketers develop a repeatable professional process rather
                than rely on isolated tactics.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="relative mt-16">
          <div className="absolute left-0 right-0 top-[26px] hidden h-px bg-background-50/12 lg:block" />
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-4 lg:gap-8">
            {stages.map((stage, index) => (
              <Reveal key={stage.number} delay={index * 90}>
                <div className="relative">
                  <div className="flex h-[52px] items-center">
                    <span className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-accent-500/40 bg-primary-950 font-heading text-lg text-accent-400">
                      {stage.number}
                    </span>
                  </div>
                  <h3 className="mt-6 font-heading text-xl font-semibold leading-tight text-background-50">
                    {stage.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-background-50/65">{stage.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {socialMoments.map((item) => (
            <div
              key={item.caption}
              className="group relative overflow-hidden rounded-[12px] border border-background-50/15"
            >
              <EditorialImage
                src={item.image}
                seed={item.seed}
                alt={item.caption}
                className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-[1.02] md:h-52"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary-950/80 to-transparent px-4 pb-3 pt-8">
                <span className="text-xs font-semibold text-background-50">{item.caption}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
