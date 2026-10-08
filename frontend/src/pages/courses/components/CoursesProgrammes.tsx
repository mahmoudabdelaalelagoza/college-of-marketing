import Button from '@/components/base/Button';
import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import { programmes } from './data';
import EditorialImage from '@/components/feature/EditorialImage';

export default function CoursesProgrammes() {
  return (
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
                      <EditorialImage
                        src={programme.image}
                        seed={programme.seed}
                        alt={programme.tag}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      <span className="absolute left-5 top-5 rounded-full bg-background-50/90 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground-800 backdrop-blur">
                        {programme.level}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-8">
                      <p className="eyebrow text-accent-700">{programme.tag}</p>
                      <h3 className="mt-3 font-heading text-2xl font-semibold leading-tight">
                        {programme.tag} - {programme.level}
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
  );
}

