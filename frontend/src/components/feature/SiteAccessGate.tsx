import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { isSupabaseConfigured, requireSupabase } from '@/lib/supabase';

interface SiteAccessState {
  maintenance_enabled: boolean;
  protected_paths: string[];
  unlocked: boolean;
  title: string;
  message: string;
  updated_at: string | null;
}

const defaultState: SiteAccessState = {
  maintenance_enabled: false,
  protected_paths: [],
  unlocked: true,
  title: 'Website under construction',
  message: 'Enter the 6-digit preview code to view the work in progress.',
  updated_at: null,
};

const unlockKey = 'com_preview_access';

export default function SiteAccessGate({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [state, setState] = useState<SiteAccessState>(defaultState);
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const isDashboard = location.pathname.startsWith('/dashboard');
  const accessToken = state.updated_at || 'initial';
  const pageProtected = useMemo(
    () => isProtectedPath(location.pathname, state.protected_paths),
    [location.pathname, state.protected_paths],
  );
  const accessRequired = state.maintenance_enabled || pageProtected;

  useEffect(() => {
    if (isDashboard || !isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    const client = requireSupabase();

    void (async () => {
      try {
        const { data } = await client
          .from('public_site_access_settings')
          .select('*')
          .eq('id', 1)
          .maybeSingle();
        if (!active) return;
        const maintenance = Boolean(data?.maintenance_enabled);
        const rawProtectedPaths = (data as { protected_paths?: unknown } | null)?.protected_paths;
        const protectedPaths = Array.isArray(rawProtectedPaths)
          ? rawProtectedPaths.filter((path): path is string => typeof path === 'string')
          : [];
        const token = data?.updated_at || 'initial';
        const protectedCurrentPage = isProtectedPath(location.pathname, protectedPaths);
        const requiresAccess = maintenance || protectedCurrentPage;
        setState({
          maintenance_enabled: maintenance,
          protected_paths: protectedPaths,
          unlocked: !requiresAccess || window.localStorage.getItem(unlockKey) === token,
          title: data?.title || defaultState.title,
          message: data?.message || defaultState.message,
          updated_at: data?.updated_at || null,
        });
      } catch {
        if (active) setState(defaultState);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [isDashboard, location.pathname]);

  if (isDashboard) return <>{children}</>;

  if (loading) {
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

  if (!accessRequired || state.unlocked) return <>{children}</>;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const client = requireSupabase();
      const { data, error: pinError } = await client.rpc('verify_site_preview_pin', { pin });
      if (pinError || data !== true) throw new Error('Invalid preview code.');
      window.localStorage.setItem(unlockKey, accessToken);
      setState((current) => ({ ...current, unlocked: true }));
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

function isProtectedPath(pathname: string, protectedPaths: string[]) {
  const current = normalizePath(pathname);
  return protectedPaths.some((path) => {
    const protectedPath = normalizePath(path);
    if (!protectedPath) return false;
    if (protectedPath.endsWith('/*')) {
      const prefix = protectedPath.slice(0, -2) || '/';
      return current === prefix || current.startsWith(`${prefix}/`);
    }
    return current === protectedPath || current.startsWith(`${protectedPath}/`);
  });
}

function normalizePath(path: string) {
  const clean = (path || '').split('?')[0].split('#')[0].trim();
  if (!clean) return '';
  const withSlash = clean.startsWith('/') ? clean : `/${clean}`;
  return withSlash.length > 1 ? withSlash.replace(/\/+$/, '') : withSlash;
}
