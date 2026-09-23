import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import { usePublicContent } from '@/lib/publicContent';

interface CaseStudyCard {
  sector: string;
  title: string;
  copy: string;
  image: string;
}

interface CaseStudyRow {
  sector: string | null;
  title: string;
  headline: string | null;
  summary: string | null;
  outcome: string | null;
  image_url: string | null;
}

const fallbackCaseStudies: CaseStudyCard[] = [
  {
    sector: 'Retail & e-commerce',
    title: 'Rebuilding a customer insight routine',
    copy: 'A Level 4 learner introduced a repeatable insight process, changing how the team framed campaigns and prioritised audiences.',
    image:
      'https://readdy.ai/api/search-image?query=Marketing%20team%20reviewing%20retail%20customer%20insight%20data%20on%20a%20warm%20wooden%20desk%2C%20printed%20charts%20and%20notes%2C%20editorial%20premium%20business%20photography%2C%20soft%20natural%20light%2C%20muted%20warm%20neutral%20tones&width=900&height=650&seq=kbc-case-retail-01&orientation=landscape',
  },
  {
    sector: 'Professional services',
    title: 'From campaign delivery to strategic planning',
    copy: 'A Level 6 manager used the programme to build a commercial marketing plan, aligning budget and measures to firm-wide growth targets.',
    image:
      'https://readdy.ai/api/search-image?query=Marketing%20manager%20presenting%20a%20strategic%20plan%20to%20senior%20colleagues%20in%20a%20bright%20meeting%20room%2C%20editorial%20premium%20business%20photography%2C%20soft%20natural%20light%2C%20muted%20warm%20neutral%20tones&width=900&height=650&seq=kbc-case-services-01&orientation=landscape',
  },
  {
    sector: 'Manufacturing',
    title: 'Building a measurement framework',
    copy: 'A marketing team adopted a shared measurement framework, giving the business clearer visibility of channel performance and return.',
    image:
      'https://readdy.ai/api/search-image?query=Marketing%20analyst%20reviewing%20channel%20performance%20charts%20on%20a%20screen%20with%20colleagues%2C%20editorial%20premium%20business%20photography%2C%20warm%20natural%20light%2C%20muted%20warm%20neutral%20tones&width=900&height=650&seq=kbc-case-manufacturing-01&orientation=landscape',
  },
];

export default function CaseStudies() {
  const { items: cmsCaseStudies } = usePublicContent<CaseStudyRow>('case-studies', []);
  const caseStudies = cmsCaseStudies.length > 0 ? cmsCaseStudies.map(mapCaseStudy) : fallbackCaseStudies;

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
                <img
                  src={item.image}
                  alt={item.title}
                  title={`${item.sector} - ${item.title}`}
                  className="h-full w-full object-top transition-transform duration-500 group-hover:scale-[1.025]"
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
    copy: item.summary || item.headline || item.outcome || 'Read how marketing capability was applied in the workplace.',
    image: item.image_url || '/brand/college-of-marketing-logo.png',
  };
}
