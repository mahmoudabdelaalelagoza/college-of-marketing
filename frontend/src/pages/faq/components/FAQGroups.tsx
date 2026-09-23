import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import { usePublicContent } from '@/lib/publicContent';
import { faqItems } from '@/pages/college-of-marketing/faq-data';
import AccordionGroup from './AccordionGroup';
import { employerFaqs, fundingFaqs } from './data';

interface KnowledgeSourceRow {
  title: string;
  kind: string;
  reference_path: string | null;
  content: string | null;
}

interface FaqItem {
  question: string;
  answer: string;
}

export default function FAQGroups() {
  const { items: sources } = usePublicContent<KnowledgeSourceRow>('knowledge-sources', []);
  const dynamicFaqs = splitKnowledgeFaqs(sources);
  const learners = dynamicFaqs.learners.length > 0 ? dynamicFaqs.learners : faqItems;
  const employers = dynamicFaqs.employers.length > 0 ? dynamicFaqs.employers : employerFaqs;
  const funding = dynamicFaqs.funding.length > 0 ? dynamicFaqs.funding : fundingFaqs;

  return (
    <section className="container-wide py-20 md:py-28">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <Reveal>
            <Eyebrow tone="maroon">Topics</Eyebrow>
            <h2 className="mt-6 font-heading text-[clamp(2rem,3.2vw,3rem)] font-semibold leading-[1.04] tracking-[-0.02em]">
              Browse by topic.
            </h2>
            <div className="mt-8 space-y-3">
              {['Learners', 'Employers', 'Funding'].map((topic) => (
                <a
                  key={topic}
                  href={`#${topic.toLowerCase()}`}
                  className="flex items-center gap-3 text-sm font-medium text-foreground-700 transition-colors hover:text-primary-800"
                >
                  <i className="ri-arrow-right-s-line text-lg text-accent-700" />
                  {topic}
                </a>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-8">
          <div className="space-y-14">
            <Reveal>
              <div id="learners" className="scroll-mt-[148px]">
                <AccordionGroup title="Learners" items={learners} />
              </div>
            </Reveal>
            <Reveal>
              <div id="employers" className="scroll-mt-[148px]">
                <AccordionGroup title="Employers" items={employers} />
              </div>
            </Reveal>
            <Reveal>
              <div id="funding" className="scroll-mt-[148px]">
                <AccordionGroup title="Funding" items={funding} />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function splitKnowledgeFaqs(sources: KnowledgeSourceRow[]) {
  const result: Record<'learners' | 'employers' | 'funding', FaqItem[]> = {
    learners: [],
    employers: [],
    funding: [],
  };

  sources
    .filter((source) => ['faq', 'q&a', 'question & answer'].includes(source.kind.toLowerCase()))
    .forEach((source) => {
      const item = { question: source.title, answer: source.content || '' };
      const path = `${source.reference_path || ''} ${source.title}`.toLowerCase();
      if (path.includes('funding')) result.funding.push(item);
      else if (path.includes('employer')) result.employers.push(item);
      else result.learners.push(item);
    });

  return result;
}
