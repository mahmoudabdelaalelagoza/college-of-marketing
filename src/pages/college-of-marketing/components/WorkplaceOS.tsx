import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import HeroPattern from '@/components/feature/HeroPattern';

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
    image:
      'https://readdy.ai/api/search-image?query=Marketing%20team%20filming%20a%20social%20media%20video%20with%20a%20ring%20light%20and%20smartphone%20in%20a%20bright%20creative%20studio%2C%20editorial%20premium%20business%20photography%2C%20warm%20natural%20light%2C%20muted%20warm%20tones%2C%20energetic%20creative%20atmosphere&width=700&height=480&seq=kbc-os-social-01&orientation=landscape',
  },
  {
    caption: 'Campaign launch events',
    image:
      'https://readdy.ai/api/search-image?query=Launch%20event%20for%20a%20new%20marketing%20campaign%20with%20a%20crowd%20of%20engaged%20professionals%20and%20branded%20screens%2C%20editorial%20premium%20business%20photography%2C%20warm%20ambient%20light%2C%20muted%20maroon%20and%20gold%20tones%2C%20celebratory%20lively%20atmosphere&width=700&height=480&seq=kbc-os-launch-01&orientation=landscape',
  },
  {
    caption: 'Networking & community',
    image:
      'https://readdy.ai/api/search-image?query=Diverse%20group%20of%20marketing%20students%20and%20professionals%20networking%20and%20laughing%20together%20at%20a%20college%20open%20evening%2C%20editorial%20premium%20business%20photography%2C%20warm%20natural%20light%2C%20muted%20cream%20and%20warm%20neutral%20tones%2C%20vibrant%20community%20atmosphere&width=700&height=480&seq=kbc-os-network-01&orientation=landscape',
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
              <img
                src={item.image}
                alt={item.caption}
                title={`${item.caption} — College of Marketing`}
                className="h-44 w-full object-top transition-transform duration-500 group-hover:scale-[1.02] md:h-52"
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