import { useState, type FormEvent } from 'react';
import Button from '@/components/base/Button';
import { submitMarketingForm } from '@/lib/form';

/**
 * Compact email capture for event updates. Reuses the platform form
 * submission helper with an anti-spam honeypot field.
 */
export default function NewsletterForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formError, setFormError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus('submitting');
    setFormError('');

    const result = await submitMarketingForm(form, 'newsletter');
    if (result.ok) {
      setStatus('success');
      form.reset();
    } else {
      setStatus('error');
      setFormError(result.message || 'We could not send that just now. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div
        className="flex items-start gap-3 rounded-[14px] border border-accent-300 bg-accent-50 p-5"
        role="status"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-500 text-primary-950">
          <i className="ri-check-line text-lg" />
        </span>
        <div>
          <p className="font-heading text-lg font-semibold">You're on the list</p>
          <p className="mt-1 text-sm text-foreground-600">
            We'll email you when new events are announced.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form id="events-newsletter-form" onSubmit={handleSubmit} noValidate={false}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="newsletter-email">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder="name@company.com"
          className="w-full rounded-full border border-background-300 bg-background-50 px-5 py-3 text-sm text-foreground-900 placeholder:text-foreground-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-400"
        />
        <input
          type="text"
          name="phone_alt"
          className="field-aux"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
        <Button type="submit" variant="gold" className="shrink-0" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Subscribing...' : 'Notify me'}
        </Button>
      </div>
      {status === 'error' && (
        <p role="alert" className="mt-3 flex items-start gap-2 text-sm text-primary-700">
          <i className="ri-error-warning-line mt-0.5" />
          <span>{formError}</span>
        </p>
      )}
    </form>
  );
}
