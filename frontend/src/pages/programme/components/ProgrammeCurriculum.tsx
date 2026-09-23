import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import type { ProgrammeConfig } from '../types';

interface ProgrammeCurriculumProps {
  config: ProgrammeConfig;
}

export default function ProgrammeCurriculum({ config }: ProgrammeCurriculumProps) {
  const { curriculum } = config;

  return (
    <section
      id="curriculum"
      className="scroll-mt-[148px] border-y border-background-300 bg-background-100 py-20 md:py-28"
    >
      <div className="container-wide">
        <Reveal>
          <Eyebrow tone="maroon">{curriculum.eyebrow}</Eyebrow>
          <h2 className="mt-6 max-w-3xl font-heading text-[clamp(2rem,3.4vw,3.2rem)] font-semibold leading-[1.04] tracking-[-0.02em]">
            {curriculum.heading}
          </h2>
          <p className="reading-width mt-5 text-[17px] leading-relaxed text-foreground-600">
            {curriculum.intro}
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {curriculum.modules.map((module, index) => (
            <Reveal key={module.number} delay={index * 60}>
              <article className="flex h-full flex-col rounded-[16px] border border-background-300 bg-background-50 p-7">
                <div className="flex items-center justify-between">
                  <span className="font-heading text-3xl text-primary-300">{module.number}</span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-primary-800">
                    <i className="ri-book-2-line text-base" />
                  </span>
                </div>
                <h3 className="mt-5 font-heading text-lg font-semibold leading-snug text-foreground-950">
                  {module.title}
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-foreground-600">{module.copy}</p>
                <div className="mt-6 flex flex-wrap gap-2 border-t border-background-200 pt-5">
                  {module.topics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-full bg-background-100 px-3 py-1 text-xs text-foreground-600"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
