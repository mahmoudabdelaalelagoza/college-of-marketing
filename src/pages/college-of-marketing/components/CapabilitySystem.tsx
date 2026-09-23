import { useState } from 'react';
import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';

interface Capability {
  key: string;
  number: string;
  title: string;
  headline: string;
  copy: string;
  subs: string[];
  image: string;
}

const capabilities: Capability[] = [
  {
    key: 'Audience and insight',
    number: '01',
    title: 'Customer intelligence',
    headline: 'Understand the market before deciding the message.',
    copy: 'Develop research, segmentation and customer understanding practices that help marketers identify meaningful needs, priorities and opportunities.',
    subs: ['Research framing', 'Insight synthesis', 'Segmentation', 'Ethical practice'],
    image:
      'https://readdy.ai/api/search-image?query=Marketing%20professionals%20gathered%20around%20a%20table%20analysing%20customer%20insight%20research%20with%20printed%20charts%20personas%20and%20sticky%20notes%20on%20a%20warm%20wooden%20surface%2C%20editorial%20premium%20business%20photography%2C%20soft%20natural%20window%20light%2C%20muted%20maroon%20cream%20and%20gold%20tones%2C%20calm%20collaborative%20atmosphere&width=900&height=600&seq=kbc-cap-insight-01&orientation=landscape',
  },
  {
    key: 'Brand and proposition',
    number: '02',
    title: 'Brand and proposition',
    headline: 'Shape propositions people recognise, trust and choose.',
    copy: 'Build brands and offers with clarity and consistency, connecting positioning, promise and creative direction to real customer value.',
    subs: ['Positioning', 'Value proposition', 'Brand architecture', 'Creative direction'],
    image:
      'https://readdy.ai/api/search-image?query=Creative%20marketing%20team%20developing%20a%20brand%20proposition%20with%20moodboards%20colour%20swatches%20and%20typography%20samples%20spread%20across%20a%20bright%20studio%20table%2C%20editorial%20premium%20business%20photography%2C%20soft%20natural%20light%2C%20muted%20warm%20neutral%20tones%2C%20energetic%20collaborative%20atmosphere&width=900&height=600&seq=kbc-cap-brand-01&orientation=landscape',
  },
  {
    key: 'Digital growth',
    number: '03',
    title: 'Digital growth',
    headline: 'Design journeys that acquire, convert and retain.',
    copy: 'Plan content, channels and experiences that move customers through a considered journey, balancing reach, relevance and return.',
    subs: ['Channel strategy', 'Content and search', 'Paid and owned media', 'Conversion journeys'],
    image:
      'https://readdy.ai/api/search-image?query=Digital%20marketer%20reviewing%20social%20media%20analytics%20and%20campaign%20performance%20dashboards%20on%20a%20laptop%20and%20tablet%20in%20a%20modern%20office%2C%20editorial%20premium%20business%20photography%2C%20warm%20natural%20light%2C%20muted%20maroon%20and%20cream%20tones%2C%20focused%20confident%20atmosphere&width=900&height=600&seq=kbc-cap-digital-01&orientation=landscape',
  },
  {
    key: 'Data, AI and measurement',
    number: '04',
    title: 'Data, AI and measurement',
    headline: 'Measure what matters and use AI responsibly.',
    copy: 'Turn data into decisions with measurement frameworks, testing discipline and a responsible approach to AI enabled marketing practice.',
    subs: ['Measurement frameworks', 'Analytics literacy', 'Testing and optimisation', 'Responsible AI'],
    image:
      'https://readdy.ai/api/search-image?query=Marketing%20analyst%20working%20with%20data%20visualisation%20charts%20and%20an%20AI%20dashboard%20on%20a%20large%20screen%20while%20colleagues%20discuss%20results%2C%20editorial%20premium%20business%20photography%2C%20warm%20natural%20light%2C%20muted%20warm%20neutral%20tones%2C%20calm%20analytical%20atmosphere&width=900&height=600&seq=kbc-cap-data-01&orientation=landscape',
  },
  {
    key: 'Strategy and leadership',
    number: '05',
    title: 'Strategy and leadership',
    headline: 'Connect marketing decisions to commercial outcomes.',
    copy: 'Set direction, influence stakeholders and lead teams and agencies with a clear commercial rationale behind every marketing choice.',
    subs: ['Market and commercial analysis', 'Planning and budgeting', 'Stakeholder influence', 'Team and agency leadership'],
    image:
      'https://readdy.ai/api/search-image?query=Marketing%20director%20presenting%20a%20commercial%20strategy%20to%20a%20leadership%20team%20in%20a%20bright%20boardroom%20standing%20beside%20a%20screen%20with%20growth%20charts%2C%20editorial%20premium%20business%20photography%2C%20warm%20natural%20light%2C%20muted%20maroon%20and%20gold%20tones%2C%20confident%20professional%20atmosphere&width=900&height=600&seq=kbc-cap-strategy-01&orientation=landscape',
  },
];

export default function CapabilitySystem() {
  const [active, setActive] = useState(0);
  const current = capabilities[active];

  return (
    <section id="capabilities" className="container-wide scroll-mt-[148px] py-20 md:py-28">
      <Reveal>
        <Eyebrow tone="maroon">Marketing capability system</Eyebrow>
        <h2 className="mt-6 max-w-3xl font-heading text-[clamp(2rem,3.4vw,3.2rem)] font-semibold leading-[1.04] tracking-[-0.02em]">
          Build the judgement behind stronger marketing decisions.
        </h2>
        <p className="reading-width mt-5 text-[17px] leading-relaxed text-foreground-600">
          Each capability is taught as part of a connected professional operating system, not as an
          isolated topic or software tutorial.
        </p>
      </Reveal>

      <Reveal delay={120}>
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <div className="flex flex-col border-t border-background-300">
              {capabilities.map((cap, index) => {
                const isActive = index === active;
                return (
                  <button
                    key={cap.key}
                    type="button"
                    onClick={() => setActive(index)}
                    className={`group flex items-center gap-4 border-b border-background-300 py-4 text-left transition-colors ${
                      isActive ? 'text-primary-900' : 'text-foreground-600 hover:text-foreground-900'
                    }`}
                    aria-pressed={isActive}
                  >
                    <span
                      className={`font-heading text-sm ${
                        isActive ? 'text-accent-700' : 'text-foreground-400'
                      }`}
                    >
                      {cap.number}
                    </span>
                    <span
                      className={`flex-1 text-[15px] font-medium ${isActive ? 'font-semibold' : ''}`}
                    >
                      {cap.key}
                    </span>
                    <i
                      className={`ri-arrow-right-line transition-transform duration-300 ${
                        isActive ? 'translate-x-0 text-primary-800' : '-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="relative h-full overflow-hidden rounded-[16px] border border-background-300 bg-background-50 p-8 md:p-12">
              <div key={current.key} className="animate-fade-in">
                <div className="relative mb-8 aspect-[16/7] overflow-hidden rounded-[12px] border border-background-300">
                  <img
                    src={current.image}
                    alt={current.title}
                    title={`${current.title} — College of Marketing`}
                    className="h-full w-full object-top"
                  />
                </div>
                <span className="font-heading text-5xl font-semibold text-background-300">
                  {current.number}
                </span>
                <p className="eyebrow mt-6 text-foreground-500">{current.title}</p>
                <h3 className="mt-4 max-w-xl font-heading text-[clamp(1.6rem,2.6vw,2.3rem)] font-semibold leading-[1.1]">
                  {current.headline}
                </h3>
                <p className="reading-width mt-5 text-[16px] leading-relaxed text-foreground-600">
                  {current.copy}
                </p>

                <div className="mt-9 border-t border-background-200 pt-7">
                  <p className="eyebrow text-foreground-500">Sub capabilities</p>
                  <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                    {current.subs.map((sub) => (
                      <div key={sub} className="flex items-center gap-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
                        <span className="text-[15px] text-foreground-800">{sub}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}