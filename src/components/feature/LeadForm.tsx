import { useState, type FormEvent } from 'react';
import Button from '@/components/base/Button';
import { submitMarketingForm } from '@/lib/form';

interface LeadFormProps {
  formId: string;
  submitAddr?: string;
  submitLabel: string;
  tone?: 'light' | 'dark';
  showOrganisation?: boolean;
  successMessage?: string;
}

const interestOptions = [
  'Marketing Executive — Level 4',
  'Marketing Manager — Level 6',
  'Employer / workforce development',
  'Not sure yet',
];

export default function LeadForm({
  formId,
  submitAddr,
  submitLabel,
  tone = 'light',
  showOrganisation = true,
  successMessage = 'Thank you. A member of the College of Marketing team will be in touch shortly.',
}: LeadFormProps) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formError, setFormError] = useState('');
  const dark = tone === 'dark';

  const labelCls = `mb-2 block text-[13px] font-medium ${dark ? 'text-background-50/70' : 'text-foreground-600'}`;
  const fieldCls = dark
    ? 'w-full rounded-[10px] border border-background-50/20 bg-background-50/5 px-4 py-3 text-sm text-background-50 placeholder:text-background-50/40 transition-colors focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500'
    : 'w-full rounded-[10px] border border-background-300 bg-background-50 px-4 py-3 text-sm text-foreground-900 placeholder:text-foreground-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-400';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus('submitting');
    setFormError('');

    const result = await submitMarketingForm(form, submitAddr ?? '/api/leads');
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
        className={`flex flex-col items-start gap-3 rounded-[14px] border p-8 ${
          dark ? 'border-background-50/15 bg-background-50/5' : 'border-background-300 bg-background-50'
        }`}
        role="status"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-500 text-primary-950">
          <i className="ri-check-line text-xl" />
        </span>
        <p className={`text-[15px] leading-relaxed ${dark ? 'text-background-50/80' : 'text-foreground-700'}`}>
          {successMessage}
        </p>
      </div>
    );
  }

  return (
    <form
      id={formId}
      onSubmit={handleSubmit}
      className={`rounded-[14px] border p-6 md:p-8 ${
        dark ? 'border-background-50/15 bg-background-50/5' : 'border-background-300 bg-background-50'
      }`}
      noValidate={false}
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor={`${formId}-name`}>
            Full name
          </label>
          <input
            id={`${formId}-name`}
            name="name"
            type="text"
            required
            placeholder="Your name"
            className={fieldCls}
          />
        </div>
        <div>
          <label className={labelCls} htmlFor={`${formId}-email`}>
            Email address
          </label>
          <input
            id={`${formId}-email`}
            name="email"
            type="email"
            required
            placeholder="name@company.com"
            className={fieldCls}
          />
        </div>

        {showOrganisation && (
          <div>
            <label className={labelCls} htmlFor={`${formId}-organisation`}>
              Organisation
            </label>
            <input
              id={`${formId}-organisation`}
              name="organisation"
              type="text"
              placeholder="Company or team"
              className={fieldCls}
            />
          </div>
        )}

        <div className={showOrganisation ? '' : 'sm:col-span-2'}>
          <label className={labelCls} htmlFor={`${formId}-interest`}>
            Programme of interest
          </label>
          <select id={`${formId}-interest`} name="interest" className={fieldCls} defaultValue="">
            <option value="" disabled>
              Please select
            </option>
            {interestOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className={labelCls} htmlFor={`${formId}-message`}>
            What would you like to discuss?
          </label>
          <textarea
            id={`${formId}-message`}
            name="message"
            rows={4}
            maxLength={500}
            placeholder="Tell us briefly about your role, team or goals (max 500 characters)."
            className={fieldCls}
          />
        </div>
      </div>

      {/* Secondary anti-spam field, kept out of the visual flow */}
      <input
        type="text"
        name="website_alt"
        className="field-aux"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      {status === 'error' && (
        <p
          role="alert"
          className={`mt-5 flex items-start gap-2 text-sm ${
            dark ? 'text-accent-300' : 'text-primary-700'
          }`}
        >
          <i className="ri-error-warning-line mt-0.5" />
          <span>{formError}</span>
        </p>
      )}

      <div className="mt-7 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className={`text-xs ${dark ? 'text-background-50/50' : 'text-foreground-500'}`}>
          We only use your details to respond to this enquiry.
        </p>
        <Button type="submit" variant={dark ? 'gold' : 'primary'} arrow disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Sending…' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
