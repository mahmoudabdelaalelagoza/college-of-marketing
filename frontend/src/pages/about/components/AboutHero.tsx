import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import HeroPattern from '@/components/feature/HeroPattern';

export default function AboutHero() {
  return (
    <section className="container-wide pt-8 md:pt-10">
            <div className="hero-maroon-gradient warm-glow relative overflow-hidden rounded-[18px] px-6 py-14 text-background-50 md:px-14 md:py-20">
              <HeroPattern />
              <div className="relative z-10 grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
                <div className="lg:col-span-7">
                  <Reveal>
                    <Eyebrow tone="gold">Who we are</Eyebrow>
                  </Reveal>
                  <Reveal delay={80}>
                    <h1 className="mt-6 font-heading text-[clamp(2.4rem,4.5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-background-50">
                      A specialist college for modern marketing.
                    </h1>
                  </Reveal>
                  <Reveal delay={160}>
                    <p className="reading-width mt-6 text-[17px] leading-relaxed text-background-50/75">
                      Kent Business College's College of Marketing connects professional theory with the
                      real responsibilities of working marketers - building confident, commercially
                      minded professionals.
                    </p>
                  </Reveal>
                </div>
                <div className="lg:col-span-5">
                  <Reveal delay={200}>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[16px] border border-background-50/12">
                      <img
                        src="https://readdy.ai/api/search-image?query=Modern%20college%20building%20entrance%20with%20warm%20stone%20and%20glass%2C%20students%20and%20professionals%20walking%20in%2C%20editorial%20premium%20business%20photography%2C%20soft%20natural%20light%2C%20muted%20warm%20neutral%20tones&width=900&height=680&seq=kbc-about-campus-01&orientation=landscape"
                        alt="Kent Business College campus"
                        title="Kent Business College - College of Marketing"
                        className="h-full w-full object-top"
                      />
                    </div>
                  </Reveal>
                </div>
              </div>
            </div>
          </section>
  );
}

