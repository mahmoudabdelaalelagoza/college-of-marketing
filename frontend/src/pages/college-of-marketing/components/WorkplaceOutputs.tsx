import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';

const outputs = [
  {
    title: 'Customer insight report',
    copy: 'A structured summary of customer needs, segments and opportunities to inform marketing decisions.',
  },
  {
    title: 'Campaign plan and brief',
    copy: 'A clear brief connecting objectives, audience, proposition, channels and creative direction.',
  },
  {
    title: 'Channel and content plan',
    copy: 'An owned, earned and paid plan that builds reach, relevance and conversion across the journey.',
  },
  {
    title: 'Measurement framework',
    copy: 'A practical set of measures that connect marketing activity to commercial performance.',
  },
  {
    title: 'Brand and proposition work',
    copy: 'Positioning, value proposition and messaging that gives the organisation a distinct place in the market.',
  },
  {
    title: 'Strategic marketing plan',
    copy: 'A longer term plan aligning marketing investment, capability and priorities with business aims.',
  },
];

export default function WorkplaceOutputs() {
  return (
    <section id="outputs" className="container-wide scroll-mt-[148px] py-20 md:py-28">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <Reveal>
            <Eyebrow tone="maroon">Workplace outputs</Eyebrow>
            <h2 className="mt-6 font-heading text-[clamp(2rem,3.2vw,3rem)] font-semibold leading-[1.04] tracking-[-0.02em]">
              Capability you can see in the work itself.
            </h2>
            <p className="reading-width mt-5 text-[17px] leading-relaxed text-foreground-600">
              Learning is applied directly to the workplace. Every module translates into a practical
              output that supports the learner's role and demonstrates value to the employer.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-10 overflow-hidden rounded-[14px] border border-background-300">
              <img
                src="https://readdy.ai/api/search-image?query=Marketing%20professional%20presenting%20campaign%20performance%20results%20to%20colleagues%20in%20a%20modern%20British%20office%2C%20warm%20natural%20light%2C%20editorial%20premium%20business%20photography%2C%20muted%20warm%20neutral%20tones%2C%20calm%20confident%20atmosphere&width=900&height=1080&seq=kbc-outputs-presenting-01&orientation=portrait"
                alt="Marketing professional presenting campaign performance results"
                title="Workplace marketing outputs"
                className="h-[360px] w-full object-top md:h-[440px]"
              />
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <div className="flex flex-col">
            {outputs.map((item, index) => (
              <Reveal key={item.title} delay={index * 60}>
                <div
                  className={`group flex gap-6 border-b border-background-300 py-6 ${
                    index === 0 ? 'border-t' : ''
                  }`}
                >
                  <span className="font-heading text-lg text-accent-700">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-heading text-xl font-semibold leading-tight text-foreground-950">
                      {item.title}
                    </h3>
                    <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-foreground-600">
                      {item.copy}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
