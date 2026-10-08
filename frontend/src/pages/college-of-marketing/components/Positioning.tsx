import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import EditorialImage from '@/components/feature/EditorialImage';

const capabilityLabels = [
  'Customer insight',
  'Brand and proposition',
  'Digital marketing',
  'Data and measurement',
  'AI enabled practice',
  'Commercial strategy',
];

export default function Positioning() {
  return (
    <section id="positioning" className="container-wide scroll-mt-[148px] py-20 md:py-28">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <Reveal>
            <Eyebrow tone="maroon">Marketing with purpose</Eyebrow>
            <h2 className="mt-6 font-heading text-[clamp(2.2rem,3.6vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.02em]">
              Creative thinking, commercial discipline.
            </h2>
            <p className="reading-width mt-6 text-[17px] leading-relaxed text-foreground-600">
              Build the confidence to make better marketing decisions and explain their value to the
              organisation.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-10 overflow-hidden rounded-[14px] border border-background-300">
              <EditorialImage
                alt="Marketing professionals reviewing customer insight research"
                seed="kbc-positioning-insight-01"
                className="h-[300px] w-full object-cover md:h-[360px]"
              />
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-7 lg:pl-6">
          <Reveal delay={80}>
            <Eyebrow tone="muted">A specialist marketing college</Eyebrow>
            <h3 className="mt-6 font-heading text-[clamp(1.8rem,2.8vw,2.6rem)] font-semibold leading-[1.08]">
              Marketing education designed around the work that matters.
            </h3>
            <p className="reading-width mt-6 text-[17px] leading-relaxed text-foreground-600">
              KBC connects professional marketing theory with the real responsibilities of working
              marketers, including customer insight, campaign planning, brand, digital channels,
              measurement, stakeholder influence and strategic decision making.
            </p>
          </Reveal>

          <Reveal delay={180}>
            <div className="mt-10 border-t border-background-300 pt-8">
              <p className="eyebrow text-foreground-500">Capability areas</p>
              <div className="mt-5 grid grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2">
                {capabilityLabels.map((label, index) => (
                  <div
                    key={label}
                    className="flex items-baseline gap-3 border-b border-background-200 pb-3 last:border-0"
                  >
                    <span className="font-heading text-sm text-accent-700">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[15px] font-medium text-foreground-900">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
