import Button from '@/components/base/Button';
import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import { shortCourses } from './data';

export default function CoursesShortCourses() {
  return (
    <section className="container-wide py-20 md:py-28">
            <Reveal>
              <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <Eyebrow tone="maroon">Short courses</Eyebrow>
                  <h2 className="mt-6 max-w-2xl font-heading text-[clamp(2rem,3.2vw,3rem)] font-semibold leading-[1.04] tracking-[-0.02em]">
                    Focused workshops for busy teams.
                  </h2>
                </div>
                <p className="max-w-sm text-[15px] leading-relaxed text-foreground-600">
                  Practical, half-day to two-day sessions to sharpen a specific capability.
                </p>
              </div>
            </Reveal>
    
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              {shortCourses.map((course, index) => (
                <Reveal key={course.title} delay={index * 80}>
                  <article className="flex h-full flex-col rounded-[16px] border border-background-300 bg-background-50 p-7">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-primary-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-800">
                        {course.duration}
                      </span>
                      <i className="ri-arrow-right-up-line text-lg text-foreground-400" />
                    </div>
                    <h3 className="mt-5 font-heading text-xl font-semibold leading-tight">
                      {course.title}
                    </h3>
                    <p className="mt-3 text-[14px] leading-relaxed text-foreground-600">
                      {course.copy}
                    </p>
                    <Button to="/employers" variant="link" className="mt-auto self-start pt-5">
                      Enquire
                    </Button>
                  </article>
                </Reveal>
              ))}
            </div>
          </section>
  );
}

