import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';

const sectors = [
  'Retail & e-commerce',
  'Professional services',
  'Manufacturing',
  'Technology',
  'Public sector',
  'Charity & non-profit',
];

export default function TrustStrip() {
  return (
    <section id="trust" className="scroll-mt-[148px] border-y border-background-300 bg-background-50">
      <div className="container-wide py-12 md:py-14">
        <Reveal>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-4">
              <Eyebrow tone="muted">Trusted by</Eyebrow>
              <h2 className="mt-4 font-heading text-[clamp(1.6rem,2.4vw,2rem)] font-semibold leading-tight">
                Professionals from leading organisations.
              </h2>
            </div>
            <div className="lg:col-span-8">
              <div className="flex flex-wrap gap-x-8 gap-y-4">
                {sectors.map((sector) => (
                  <span
                    key={sector}
                    className="text-sm font-medium uppercase tracking-[0.14em] text-foreground-500"
                  >
                    {sector}
                  </span>
                ))}
              </div>
              <p className="mt-6 text-xs text-foreground-500">
                Representative sectors where programme participants are employed.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
