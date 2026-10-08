import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import { usePublicContent } from '@/lib/publicContent';
import EditorialImage from '@/components/feature/EditorialImage';

interface CaseStudyCard {
  sector: string;
  title: string;
  copy: string;
  image: string | null;
  seed: string;
}

interface CaseStudyRow {
  sector: string | null;
  title: string;
  headline: string | null;
  summary: string | null;
  outcome: string | null;
  image_url: string | null;
}

/**
 * Published case studies.
 *
 * Like testimonials, this section has no built-in fallback content. Inventing
 * employer case studies would imply named clients and measurable results that
 * the college has not verified, which is misleading in a regulated sector and
 * risky under consumer protection rules.
 *
 * The section is hidden until an editor publishes real, approved case studies,
 * at which point it appears automatically.
 */
export default function CaseStudies() {
  const { items: cmsCaseStudies } = usePublicContent<CaseStudyRow>('case-studies', []);
  const caseStudies = cmsCaseStudies.map(mapCaseStudy);

  if (caseStudies.length === 0) return null;

  return (
    <section id="case-studies" className="container-wide scroll-mt-[148px] py-20 md:py-28">
      <Reveal>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow tone="maroon">Case studies</Eyebrow>
            <h2 className="mt-6 max-w-2xl font-heading text-[clamp(2rem,3.2vw,3rem)] font-semibold leading-[1.04] tracking-[-0.02em]">
              Capability applied to real marketing challenges.
            </h2>
          </div>
          <p className="max-w-sm text-[15px] leading-relaxed text-foreground-600">
            Examples drawn from participating organisations, described by sector to respect
            confidentiality.
          </p>
        </div>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
        {caseStudies.map((item, index) => (
          <Reveal key={item.title} delay={index * 90}>
            <article className="group flex h-full flex-col">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] border border-background-300 bg-background-100">
                <EditorialImage
                  src={item.image}
                  seed={item.seed}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                />
              </div>
              <p className="eyebrow mt-6 text-foreground-500">{item.sector}</p>
              <h3 className="mt-3 font-heading text-xl font-semibold leading-tight">{item.title}</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-foreground-600">{item.copy}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function mapCaseStudy(item: CaseStudyRow): CaseStudyCard {
  return {
    sector: item.sector || 'College of Marketing',
    title: item.title,
    // Only fall back to copy the editor actually wrote; never synthesise a
    // description, which could overstate what the employer achieved.
    copy: item.summary || item.headline || item.outcome || '',
    image: item.image_url || null,
    seed: item.title,
  };
}