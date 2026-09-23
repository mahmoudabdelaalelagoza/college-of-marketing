import Button from '@/components/base/Button';
import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import { paidCourseSteps } from './data';

export default function CoursesShortCourses() {
  return (
    <section className="container-wide py-20 md:py-28">
      <Reveal>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow tone="maroon">Paid course enrolment</Eyebrow>
            <h2 className="mt-6 max-w-2xl font-heading text-[clamp(2rem,3.2vw,3rem)] font-semibold leading-[1.04] tracking-[-0.02em]">
              When the full programme is not the right route.
            </h2>
          </div>
          <p className="max-w-sm text-[15px] leading-relaxed text-foreground-600">
            Standalone modules are designed for learners or teams who need targeted capability without joining the full apprenticeship.
          </p>
        </div>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {paidCourseSteps.map((step, index) => (
          <Reveal key={step.title} delay={index * 80}>
            <article className="flex h-full flex-col rounded-[16px] border border-background-300 bg-background-50 p-7">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-100 text-secondary-800">
                <i className={`${step.icon} text-xl`} />
              </span>
              <h3 className="mt-5 font-heading text-xl font-semibold leading-tight">
                {step.title}
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-foreground-600">
                {step.copy}
              </p>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal delay={160}>
        <div className="mt-10">
          <Button to="/consultation" variant="primary" arrow>
            Book consultation
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
