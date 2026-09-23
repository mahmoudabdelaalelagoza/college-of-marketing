import Button from '@/components/base/Button';
import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import { usePublicContent } from '@/lib/publicContent';
import { programmeCourses } from './data';

interface ShortCourseRow {
  slug: string;
  title: string;
  category: string | null;
  duration: string | null;
  format: string | null;
  owner: string | null;
  audience: string | null;
  summary: string | null;
  focus_list: string[] | null;
  icon: string | null;
}

export default function CoursesModules() {
  const { items: shortCourses } = usePublicContent<ShortCourseRow>('short-courses', []);

  return (
    <section id="course-modules" className="border-y border-background-300 bg-background-100 py-20 md:py-28">
      <div className="container-wide">
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow tone="maroon">Programme materials</Eyebrow>
              <h2 className="mt-6 max-w-2xl font-heading text-[clamp(2rem,3.2vw,3rem)] font-semibold leading-[1.04] tracking-[-0.02em]">
                The modules inside each programme.
              </h2>
            </div>
            <p className="max-w-md text-[15px] leading-relaxed text-foreground-600">
              Eligible learners can complete the full programme. Learners who are not eligible can enrol on one or more modules as paid standalone courses.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 space-y-16">
          {programmeCourses.map((programme, programmeIndex) => (
            <div key={programme.programme}>
              <Reveal delay={programmeIndex * 80}>
                <div className="rounded-[18px] border border-background-300 bg-background-50 p-6 md:p-8">
                  <Eyebrow tone="maroon">{programme.eyebrow}</Eyebrow>
                  <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
                    <div>
                      <h3 className="font-heading text-[clamp(1.7rem,2.5vw,2.4rem)] font-semibold leading-tight">
                        {programme.programme}
                      </h3>
                      <p className="mt-4 text-[15px] leading-relaxed text-foreground-600">
                        {programme.intro}
                      </p>
                    </div>
                    <div className="rounded-[14px] bg-background-100 p-5 text-sm leading-relaxed text-foreground-700">
                      <span className="font-semibold text-foreground-900">Recommended route:</span> full funded pathway when eligible. <span className="font-semibold text-foreground-900">Alternative route:</span> paid module enrolment after consultation.
                    </div>
                  </div>
                </div>
              </Reveal>

              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {programme.modules.map((module, index) => (
                  <Reveal key={module.title} delay={index * 50}>
                    <article className="flex h-full flex-col rounded-[16px] border border-background-300 bg-background-50 p-6">
                      <div className="flex items-start justify-between gap-4">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary-100 text-sm font-semibold text-secondary-800">
                          {module.number}
                        </span>
                        <span className="rounded-full bg-primary-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-800">
                          Paid course option
                        </span>
                      </div>
                      <h4 className="mt-5 font-heading text-xl font-semibold leading-tight">
                        {module.title}
                      </h4>
                      <p className="mt-3 text-[14px] leading-relaxed text-foreground-600">
                        {module.copy}
                      </p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {module.topics.map((topic) => (
                          <span key={topic} className="rounded-full bg-background-100 px-3 py-1 text-xs font-medium text-foreground-600">
                            {topic}
                          </span>
                        ))}
                      </div>
                      <Button to={module.enrolTo} variant="link" className="mt-auto self-start pt-6" arrow>
                        Enroll Now
                      </Button>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>

        {shortCourses.length > 0 && (
          <div className="mt-16">
            <Reveal>
              <div className="max-w-2xl">
                <Eyebrow tone="maroon">CMS short courses</Eyebrow>
                <h3 className="mt-5 font-heading text-[clamp(1.7rem,2.6vw,2.4rem)] font-semibold leading-tight">
                  Standalone courses available after consultation.
                </h3>
              </div>
            </Reveal>
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {shortCourses.map((course, index) => (
                <Reveal key={course.slug || course.title} delay={index * 60}>
                  <article className="flex h-full flex-col rounded-[16px] border border-background-300 bg-background-50 p-6">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-100 text-secondary-800">
                      <i className={`${course.icon || 'ri-stack-line'} text-xl`} />
                    </span>
                    <p className="eyebrow mt-5 text-accent-700">{course.category || course.format || 'Short course'}</p>
                    <h4 className="mt-3 font-heading text-xl font-semibold leading-tight">{course.title}</h4>
                    <p className="mt-3 text-[14px] leading-relaxed text-foreground-600">{course.summary || course.audience || 'A focused professional course from College of Marketing.'}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {(course.focus_list || []).slice(0, 4).map((topic) => (
                        <span key={topic} className="rounded-full bg-background-100 px-3 py-1 text-xs font-medium text-foreground-600">
                          {topic}
                        </span>
                      ))}
                    </div>
                    <div className="mt-5 grid grid-cols-2 gap-3 border-t border-background-200 pt-5 text-xs text-foreground-500">
                      <span>{course.duration || 'Duration TBC'}</span>
                      <span>{course.owner || 'College of Marketing'}</span>
                    </div>
                    <Button to={`/consultation?course=${encodeURIComponent(course.title)}`} variant="link" className="mt-auto self-start pt-6" arrow>
                      Enroll Now
                    </Button>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
