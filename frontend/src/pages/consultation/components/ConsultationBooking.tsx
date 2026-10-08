import { useMemo, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from '@/components/base/Button';
import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import { submitMarketingForm } from '@/lib/form';
import { programmeCourses } from '@/pages/courses/components/data';

const generalOptions = [
  'Full programme eligibility check',
  'Marketing Executive - Level 4',
  'Marketing Manager - Level 6',
  'Paid standalone course modules',
  'Not sure yet',
];

export default function ConsultationBooking() {
  const [searchParams] = useSearchParams();
  const selectedCourse = searchParams.get('course');
  const selectedProgramme = searchParams.get('programme');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formError, setFormError] = useState('');

  const moduleOptions = useMemo(
    () => programmeCourses.flatMap((programme) =>
      programme.modules.map((module) => `${programme.programme}: ${module.title}`),
    ),
    [],
  );

  // Short-course links arrive as ?course=X on their own, while programme
  // module links send both. Pre-select whichever is present.
  const defaultInterest = selectedCourse
    ? selectedProgramme
      ? `${selectedProgramme}: ${selectedCourse}`
      : selectedCourse
    : '';

  const fieldCls = 'w-full rounded-[10px] border border-background-300 bg-background-50 px-4 py-3 text-sm text-foreground-900 placeholder:text-foreground-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-400';
  const labelCls = 'mb-2 block text-[13px] font-medium text-foreground-600';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus('submitting');
    setFormError('');

    const result = await submitMarketingForm(form, '/api/leads');
    if (result.ok) {
      setStatus('success');
      form.reset();
    } else {
      setStatus('error');
      setFormError(result.message || 'We could not send that just now. Please try again.');
    }
  };

  return (
    <section id="booking-form" className="container-wide scroll-mt-[148px] py-20 md:py-28">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal>
            <Eyebrow tone="maroon">How it works</Eyebrow>
            <h2 className="mt-6 font-heading text-[clamp(2rem,3.2vw,3rem)] font-semibold leading-[1.04] tracking-[-0.02em]">
              One conversation, a clear enrolment route.
            </h2>
            <p className="reading-width mt-5 text-[15px] leading-relaxed text-foreground-600">
              Share your role, goals and the course modules you are considering. We will confirm whether you should take the full programme or selected paid modules.
            </p>
            <div className="mt-8 space-y-4 border-t border-background-300 pt-8 text-sm">
              {[
                'Eligibility check for funded Level 4 or Level 6 programmes',
                'Recommendation for standalone paid modules if funding does not apply',
                'Next steps for enrolment, pricing route and start planning',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <i className="ri-check-line mt-0.5 text-accent-700" />
                  <span className="text-foreground-700">{item}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <Reveal delay={120}>
            {status === 'success' ? (
              <div className="rounded-[16px] border border-background-300 bg-background-50 p-8 md:p-10" role="status">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-500 text-primary-950">
                  <i className="ri-check-line text-xl" />
                </span>
                <h3 className="mt-5 font-heading text-2xl font-semibold">Consultation request received.</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-foreground-600">
                  Thank you. We will contact you to arrange the consultation and confirm the right route.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="rounded-[16px] border border-background-300 bg-background-50 p-6 md:p-8" noValidate={false}>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelCls} htmlFor="consultation-name">Full name</label>
                    <input id="consultation-name" name="name" type="text" required placeholder="Your name" className={fieldCls} />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="consultation-email">Email address</label>
                    <input id="consultation-email" name="email" type="email" required placeholder="name@company.com" className={fieldCls} />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="consultation-organisation">Organisation</label>
                    <input id="consultation-organisation" name="organisation" type="text" placeholder="Company or team" className={fieldCls} />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="consultation-interest">Course or programme</label>
                    <select id="consultation-interest" name="interest" className={fieldCls} defaultValue={defaultInterest}>
                      <option value="" disabled>Please select</option>
                      {generalOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                      {moduleOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls} htmlFor="consultation-message">What would you like to discuss?</label>
                    <textarea
                      id="consultation-message"
                      name="message"
                      rows={5}
                      maxLength={700}
                      placeholder="Tell us whether you want the full programme, one paid module, or a group of modules."
                      className={fieldCls}
                    />
                  </div>
                </div>

                <input type="hidden" name="source" value="consultation-booking" />
                <input type="text" name="website_alt" className="field-aux" tabIndex={-1} autoComplete="off" aria-hidden="true" />

                {status === 'error' && (
                  <p role="alert" className="mt-5 flex items-start gap-2 text-sm text-primary-700">
                    <i className="ri-error-warning-line mt-0.5" />
                    <span>{formError}</span>
                  </p>
                )}

                <div className="mt-7 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-foreground-500">We only use your details to arrange this consultation.</p>
                  <Button type="submit" variant="primary" arrow disabled={status === 'submitting'}>
                    {status === 'submitting' ? 'Sending...' : 'Book consultation'}
                  </Button>
                </div>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
