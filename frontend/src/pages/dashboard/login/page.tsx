import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/base/Button';
import { login } from '../api';

export default function DashboardLogin() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const identifier = String(form.get('identifier') || '');
    const password = String(form.get('password') || '');

    setStatus('submitting');
    setError('');

    try {
      await login(identifier, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Could not sign in.');
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 bg-background-100 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="hidden bg-primary-950 p-10 text-background-50 lg:flex lg:flex-col lg:justify-between">
        <img src="/brand/college-of-marketing-logo.png" alt="College of Marketing" className="w-[260px] rounded-md bg-background-50 px-4 py-3" />
        <div className="max-w-xl">
          <p className="eyebrow text-accent-400">Secure dashboard</p>
          <h1 className="mt-6 font-heading text-[clamp(2.4rem,4.2vw,4.6rem)] font-semibold leading-none text-background-50">
            Staff tools for enquiries and marketing operations.
          </h1>
          <p className="mt-6 text-[16px] leading-relaxed text-background-50/70">
            Manage leads, follow-ups and the first operational layer of the College of Marketing dashboard.
          </p>
        </div>
        <p className="text-xs text-background-50/45">Protected staff access only.</p>
      </section>

      <section className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <img src="/brand/college-of-marketing-logo.png" alt="College of Marketing" className="w-[220px]" />
          </div>
          <div className="rounded-[18px] border border-background-300 bg-background-50 p-7 shadow-soft md:p-9">
            <p className="eyebrow text-accent-700">Dashboard login</p>
            <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight text-foreground-950">
              Sign in to continue.
            </h2>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="identifier" className="mb-2 block text-sm font-medium text-foreground-700">
                  Email
                </label>
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  autoComplete="username"
                  required
                  className="w-full rounded-[10px] border border-background-300 bg-background-50 px-4 py-3 text-sm text-foreground-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-400"
                />
              </div>
              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-foreground-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-[10px] border border-background-300 bg-background-50 px-4 py-3 text-sm text-foreground-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-400"
                />
              </div>

              {status === 'error' && (
                <p role="alert" className="rounded-md bg-primary-100 px-4 py-3 text-sm text-primary-800">
                  {error}
                </p>
              )}

              <Button type="submit" variant="primary" className="w-full" arrow disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
