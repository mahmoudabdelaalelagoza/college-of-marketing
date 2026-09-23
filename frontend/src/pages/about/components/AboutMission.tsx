import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';

export default function AboutMission() {
  return (
    <section className="container-wide py-8 md:py-12">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                <Reveal>
                  <Eyebrow tone="maroon">Our purpose</Eyebrow>
                  <h2 className="mt-6 font-heading text-[clamp(2rem,3.2vw,3rem)] font-semibold leading-[1.04] tracking-[-0.02em]">
                    Marketing, understood as a commercial discipline.
                  </h2>
                </Reveal>
              </div>
              <div className="lg:col-span-7">
                <Reveal delay={100}>
                  <div className="space-y-5 text-[16px] leading-relaxed text-foreground-700">
                    <p>
                      Too much marketing education is abstract, isolated from the pressures of running a
                      business. We believe marketers become valuable when they can connect what they do -
                      the insight, the campaigns, the content - to customer value and measurable results.
                    </p>
                    <p>
                      Every programme is built around that idea. Learning is applied to live work,
                      evidence is gathered from real responsibilities, and progression is measured by
                      the capability a marketer can actually show in the business.
                    </p>
                    <p>
                      We're rooted in Kent but work with employers and learners across the United
                      Kingdom, with a professional pathway aligned to the Chartered Institute of
                      Marketing.
                    </p>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>
  );
}

