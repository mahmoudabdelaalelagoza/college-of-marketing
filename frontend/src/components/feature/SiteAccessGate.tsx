import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

interface SiteAccessState {
  maintenance_enabled: boolean;
  unlocked: boolean;
  title: string;
  message: string;
}

const defaultState: SiteAccessState = {
  maintenance_enabled: false,
  unlocked: true,
  title: 'Website under construction',
  message: 'Enter the 6-digit preview code to view the work in progress.',
};

export default function SiteAccessGate({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [state, setState] = useState<SiteAccessState>(defaultState);
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const isDashboard = location.pathname.startsWith('/dashboard');

  useEffect(() => {
    if (isDashboard) {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    fetch('/api/public/site-access', { credentials: 'include' })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('Site access unavailable')))
      .then((payload: SiteAccessState) => {
        if (active) setState(payload);
      })
      .catch(() => {
        if (active) setState(defaultState);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isDashboard]);

  if (isDashboard) return <>{children}</>;

  if (loading) {
    // A blank white screen on every page load looks broken. Show the brand
    // mark and announce the wait for assistive technology instead.
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background-100"
        role="status"
        aria-live="polite"
      >
        <img
          src="/brand/college-of-marketing-mark.png"
          alt=""
          className="h-16 w-16 animate-pulse object-contain"
        />
        <p className="text-sm text-foreground-600">Loading...</p>
      </div>
    );
  }

  if (!state.maintenance_enabled || state.unlocked) return <>{children}</>;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/public/site-access', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Invalid preview code.');
      setState(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid preview code.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background-100 px-5 py-10 text-foreground-900">
      <section className="w-full max-w-xl rounded-[18px] border border-background-300 bg-background-50 p-7 text-left shadow-2xl md:p-9">
        <img src="/brand/college-of-marketing-logo.png" alt="College of Marketing" className="h-auto w-64 max-w-full object-contain" />
        <p className="eyebrow mt-8 text-accent-700">Preview access</p>
        <h1 className="mt-3 font-heading text-[clamp(2rem,5vw,3.4rem)] font-semibold leading-tight text-foreground-950">
          {state.title || 'Website under construction'}
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-foreground-600">
          {state.message || 'Enter the 6-digit preview code to view the work in progress.'}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block text-sm font-semibold text-foreground-800">
            Preview code
            <input
              value={pin}
              onChange={(event) => setPin(event.target.value.replace(/\D/g, '').slice(0, 6))}
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              className="mt-2 w-full rounded-[12px] border border-background-300 bg-background-50 px-5 py-4 text-center text-2xl font-semibold tracking-[0.35em] outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
              placeholder="000000"
              autoFocus
            />
          </label>
          {error && <p className="rounded-md bg-primary-100 px-4 py-3 text-sm font-medium text-primary-800">{error}</p>}
          <button disabled={pin.length !== 6 || submitting} className="w-full rounded-full bg-primary-800 px-6 py-3 text-sm font-semibold text-background-50 hover:bg-primary-900 disabled:opacity-60">
            {submitting ? 'Checking...' : 'Enter site'}
          </button>
        </form>
      </section>
    </main>
  );
}

