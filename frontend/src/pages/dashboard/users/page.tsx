import { useEffect, useState, type FormEvent } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { DashboardUser } from '../data/api';
import {
  createDashboardUser,
  listDashboardUsers,
  updateDashboardUser,
  type DashboardRole,
  type ManagedUser,
} from '../data/users-api';

const fieldClass = 'w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-sm text-foreground-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-400';

export default function DashboardUsers() {
  const currentUser = useOutletContext<DashboardUser>();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [createRole, setCreateRole] = useState<DashboardRole>('editor');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    listDashboardUsers()
      .then(({ users: items }) => { if (active) setUsers(items); })
      .catch((err) => { if (active) setError(message(err)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const createUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const password = String(values.get('password') || '');
    const confirmPassword = String(values.get('confirmPassword') || '');
    if (password.length < 12 || password.length > 128) return setError('Password must be 12 to 128 characters.');
    if (password !== confirmPassword) return setError('Passwords do not match.');
    if (createRole === 'admin' && !window.confirm('Give this new user full administrator access?')) return;
    setCreating(true);
    setNotice('');
    setError('');
    try {
      const { user } = await createDashboardUser({
        name: String(values.get('name') || '').trim(),
        email: String(values.get('email') || '').trim(),
        role: createRole,
        password,
      });
      setUsers((items) => [...items, user].sort((a, b) => a.name.localeCompare(b.name)));
      setNotice(`Account created for ${user.email}.`);
      form.reset();
      setCreateRole('editor');
    } catch (err) {
      setError(message(err));
    } finally {
      const passwordInput = form.elements.namedItem('password') as HTMLInputElement | null;
      const confirmInput = form.elements.namedItem('confirmPassword') as HTMLInputElement | null;
      if (passwordInput) passwordInput.value = '';
      if (confirmInput) confirmInput.value = '';
      setCreating(false);
    }
  };
  const saveUser = async (payload: { id: string; name: string; role: DashboardRole; is_active: boolean }) => {
    setNotice('');
    setError('');
    try {
      const { user } = await updateDashboardUser(payload);
      setUsers((items) => items.map((item) => item.id === user.id ? user : item));
      setNotice(`${user.name} updated.`);
    } catch (err) {
      setError(message(err));
      throw err;
    }
  };

  return (
    <div className="max-w-6xl">
      <div>
        <p className="eyebrow text-accent-700">Dashboard access</p>
        <h1 className="mt-3 font-heading text-4xl font-semibold leading-tight text-foreground-950">Users & permissions</h1>
      </div>

      {notice && <p role="status" className="mt-6 rounded-md bg-secondary-50 px-4 py-3 text-sm text-secondary-900">{notice}</p>}
      {error && <p role="alert" className="mt-6 rounded-md bg-primary-100 px-4 py-3 text-sm text-primary-800">{error}</p>}

      <section className="mt-7 border-y border-background-300 py-6">
        <h2 className="font-heading text-xl font-semibold">Create a user</h2>
        <form onSubmit={createUser} className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="text-xs font-semibold text-foreground-700">Name
            <input name="name" type="text" required minLength={2} maxLength={100} autoComplete="off" className={`mt-1.5 ${fieldClass}`} />
          </label>
          <label className="text-xs font-semibold text-foreground-700">Email
            <input name="email" type="email" required autoComplete="off" className={`mt-1.5 ${fieldClass}`} />
          </label>
          <label className="text-xs font-semibold text-foreground-700">Role
            <select value={createRole} onChange={(event) => setCreateRole(event.target.value as DashboardRole)} className={`mt-1.5 ${fieldClass}`}>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          <label className="text-xs font-semibold text-foreground-700">Password
            <input name="password" type="password" required minLength={12} maxLength={128} autoComplete="new-password" className={`mt-1.5 ${fieldClass}`} />
          </label>
          <label className="text-xs font-semibold text-foreground-700">Confirm password
            <input name="confirmPassword" type="password" required minLength={12} maxLength={128} autoComplete="new-password" className={`mt-1.5 ${fieldClass}`} />
          </label>
          <div className="flex items-end md:justify-end">
            <button type="submit" disabled={creating} className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary-800 px-5 text-sm font-semibold text-background-50 hover:bg-primary-900 disabled:opacity-60 md:w-auto">
              <i className="ri-user-add-line" aria-hidden="true" />{creating ? 'Creating...' : 'Create user'}
            </button>
          </div>
        </form>
      </section>
      <section className="mt-7">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-heading text-xl font-semibold">Staff accounts</h2>
          <span className="text-sm text-foreground-500">{users.length} users</span>
        </div>
        <div className="mt-4 overflow-x-auto border-y border-background-300">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-background-100 text-xs font-semibold text-foreground-600">
              <tr><th className="px-4 py-3">User</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-background-200">
              {loading ? <tr><td colSpan={4} className="px-4 py-8 text-foreground-500">Loading users...</td></tr> :
                users.length === 0 ? <tr><td colSpan={4} className="px-4 py-8 text-foreground-500">No staff accounts yet.</td></tr> :
                users.map((user) => <UserRow key={user.id} user={user} isSelf={user.id === currentUser.id} onSave={saveUser} />)}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function UserRow({ user, isSelf, onSave }: {
  user: ManagedUser;
  isSelf: boolean;
  onSave: (payload: { id: string; name: string; role: DashboardRole; is_active: boolean }) => Promise<void>;
}) {
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState<DashboardRole>(user.role);
  const [busy, setBusy] = useState(false);
  const changed = name.trim() !== user.name || role !== user.role;

  useEffect(() => { setName(user.name); setRole(user.role); }, [user.name, user.role]);

  const save = async (active = user.is_active) => {
    if (role === 'admin' && user.role !== 'admin' && !window.confirm(`Give ${user.email} full administrator access?`)) return;
    if (!active && user.is_active && !window.confirm(`Deactivate ${user.email}?`)) return;
    setBusy(true);
    try { await onSave({ id: user.id, name: name.trim(), role, is_active: active }); }
    catch { return; }
    finally { setBusy(false); }
  };

  return (
    <tr className="bg-background-50 align-middle">
      <td className="px-4 py-3">
        <input aria-label={`Name for ${user.email}`} value={name} onChange={(event) => setName(event.target.value)} minLength={2} maxLength={100} className="w-full max-w-[220px] border-b border-transparent bg-transparent py-1 font-medium text-foreground-900 focus:border-primary-500 focus:outline-none" />
        <span className="block text-xs text-foreground-500">{user.email}{isSelf ? ' (you)' : ''}</span>
      </td>
      <td className="px-4 py-3">
        <select aria-label={`Role for ${user.email}`} value={role} disabled={isSelf || busy} onChange={(event) => setRole(event.target.value as DashboardRole)} className="rounded-md border border-background-300 bg-background-50 px-3 py-2 text-sm disabled:opacity-60">
          <option value="admin">Admin</option><option value="editor">Editor</option>
        </select>
      </td>
      <td className="px-4 py-3">
        <span className={user.is_active ? 'font-medium text-secondary-800' : 'font-medium text-foreground-500'}>{user.is_active ? 'Active' : 'Inactive'}</span>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-2">
          <button type="button" title="Save changes" aria-label={`Save changes for ${user.email}`} disabled={!changed || busy || name.trim().length < 2} onClick={() => void save()} className="flex h-9 w-9 items-center justify-center rounded-md border border-background-300 text-primary-800 hover:bg-background-100 disabled:opacity-40">
            <i className="ri-save-line" aria-hidden="true" />
          </button>
          <button type="button" title={user.is_active ? 'Deactivate user' : 'Reactivate user'} aria-label={`${user.is_active ? 'Deactivate' : 'Reactivate'} ${user.email}`} disabled={isSelf || busy} onClick={() => void save(!user.is_active)} className="flex h-9 w-9 items-center justify-center rounded-md border border-background-300 text-primary-800 hover:bg-background-100 disabled:opacity-40">
            <i className={user.is_active ? 'ri-user-unfollow-line' : 'ri-user-follow-line'} aria-hidden="true" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function message(error: unknown) {
  return error instanceof Error ? error.message : 'Could not update dashboard users.';
}