import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../data/api';
import { requireSupabase, supabaseError } from '@/lib/supabase';

export default function SetDashboardPassword() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getCurrentUser()
      .then(() => { if (active) setReady(true); })
      .catch((err) => { if (active) setError(err instanceof Error ? err.message : 'Invitation link is invalid or expired.'); });
    return () => { active = false; };
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const password = String(values.get('password') || '');
    const confirm = String(values.get('confirm') || '');
    if (password.length < 12) return setError('Use at least 12 characters.');
    if (password !== confirm) return setError('Passwords do not match.');
    setError('');
    setSaving(true);
    try {
      const { error: updateError } = await requireSupabase().auth.updateUser({ password });
      if (updateError) throw new Error(supabaseError(updateError, 'Could not set password.'));
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not set password.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background-100 px-5 py-12">
      <main className="w-full max-w-md">
        <Link to="/" className="mb-8 inline-block"><img src="/brand/college-of-marketing-logo.png" alt="College of Marketing" className="w-56" /></Link>
        <h1 className="font-heading text-3xl font-semibold text-foreground-950">Set your password</h1>
        <p className="mt-2 text-sm text-foreground-600">Use this password to sign in to the staff dashboard.</p>
        {error && <p role="alert" className="mt-6 rounded-md bg-primary-100 px-4 py-3 text-sm text-primary-800">{error}</p>}
        {ready ? (
          <form onSubmit={submit} className="mt-7 space-y-4">
            <label className="block text-sm font-medium text-foreground-700">New password
              <input name="password" type="password" required minLength={12} autoComplete="new-password" className="mt-2 w-full rounded-md border border-background-300 bg-background-50 px-4 py-3 focus:border-primary-500 focus:outline-none" />
            </label>
            <label className="block text-sm font-medium text-foreground-700">Confirm password
              <input name="confirm" type="password" required minLength={12} autoComplete="new-password" className="mt-2 w-full rounded-md border border-background-300 bg-background-50 px-4 py-3 focus:border-primary-500 focus:outline-none" />
            </label>
            <button type="submit" disabled={saving} className="w-full rounded-md bg-primary-800 px-5 py-3 text-sm font-semibold text-background-50 hover:bg-primary-900 disabled:opacity-60">{saving ? 'Saving...' : 'Set password'}</button>
          </form>
        ) : !error ? <p className="mt-6 text-sm text-foreground-500">Checking invitation...</p> : null}
        <Link to="/dashboard/login" className="mt-6 inline-block text-sm font-semibold text-primary-800 hover:text-primary-900">Back to sign in</Link>
      </main>
    </div>
  );
}