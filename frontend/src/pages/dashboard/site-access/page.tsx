import { useEffect, useState, type FormEvent } from 'react';
import { getSiteAccessSettings, saveSiteAccessSettings, type SiteAccessSettings } from '../site-access-api';

const defaultSettings: SiteAccessSettings = {
  maintenance_enabled: false,
  has_preview_pin: false,
  title: 'Website under construction',
  message: 'We are preparing the College of Marketing website. Enter the 6-digit preview code to view the work in progress.',
  updated_at: null,
};

export default function DashboardSiteAccess() {
  const [settings, setSettings] = useState<SiteAccessSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getSiteAccessSettings()
      .then((payload) => {
        if (active) setSettings(payload.settings);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load site access settings.'))
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const pin = String(form.get('preview_pin') || '').trim();

    setSaving(true);
    setNotice('');
    setError('');

    try {
      const payload = await saveSiteAccessSettings({
        maintenance_enabled: form.get('maintenance_enabled') === 'on',
        preview_pin: pin,
        clear_preview_pin: form.get('clear_preview_pin') === 'on',
        title: String(form.get('title') || ''),
        message: String(form.get('message') || ''),
      });
      setSettings(payload.settings);
      setNotice('Site access settings saved.');
      const pinInput = event.currentTarget.elements.namedItem('preview_pin') as HTMLInputElement | null;
      if (pinInput) pinInput.value = '';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="max-w-5xl rounded-[16px] border border-background-300 bg-background-50 p-8 text-sm text-foreground-500">Loading site access...</div>;
  }

  return (
    <div className="max-w-5xl">
      <div>
        <p className="eyebrow text-accent-700">Website access</p>
        <h1 className="mt-3 font-heading text-4xl font-semibold leading-tight text-foreground-950">Maintenance mode</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-foreground-600">
          Put the public website under construction and let reviewers unlock it with a 6-digit preview code. Dashboard pages stay available for staff.
        </p>
      </div>

      {notice && <p className="mt-5 rounded-md bg-secondary-50 px-4 py-3 text-sm font-medium text-secondary-900">{notice}</p>}
      {error && <p className="mt-5 rounded-md bg-primary-100 px-4 py-3 text-sm font-medium text-primary-800">{error}</p>}

      <section className="mt-7 rounded-[16px] border border-background-300 bg-background-50 p-6 shadow-soft">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <Status label="Public site" value={settings.maintenance_enabled ? 'Under construction' : 'Open'} active={!settings.maintenance_enabled} />
          <Status label="Preview PIN" value={settings.has_preview_pin ? 'Set' : 'Not set'} active={settings.has_preview_pin} />
          <Status label="Last update" value={settings.updated_at ? new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(settings.updated_at)) : 'Never'} active />
        </div>

        <form onSubmit={handleSave} className="mt-8 grid grid-cols-1 gap-5">
          <label className="flex items-center gap-3 rounded-[12px] border border-background-300 bg-background-100 px-4 py-3 text-sm font-semibold text-foreground-800">
            <input name="maintenance_enabled" type="checkbox" defaultChecked={settings.maintenance_enabled} />
            Enable maintenance mode for public website
          </label>

          <label className="text-sm font-semibold text-foreground-800">
            Preview PIN, exactly 6 digits
            <input
              name="preview_pin"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              placeholder={settings.has_preview_pin ? 'PIN saved - leave blank to keep it' : 'Example: 123456'}
              className="mt-2 w-full rounded-[10px] border border-background-300 px-4 py-3 tracking-[0.2em]"
            />
            <span className="mt-2 block text-xs font-normal text-foreground-500">The PIN is stored as a secure hash. It is not shown again after saving.</span>
          </label>

          <label className="text-sm font-semibold text-foreground-800">
            Under construction title
            <input name="title" defaultValue={settings.title} className="mt-2 w-full rounded-[10px] border border-background-300 px-4 py-3" />
          </label>

          <label className="text-sm font-semibold text-foreground-800">
            Under construction message
            <textarea name="message" defaultValue={settings.message} rows={5} className="mt-2 w-full rounded-[10px] border border-background-300 px-4 py-3" />
          </label>

          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-primary-700">
              <input name="clear_preview_pin" type="checkbox" />
              Remove saved PIN when saving
            </label>
            <button disabled={saving} className="ml-auto rounded-full bg-primary-800 px-6 py-3 text-sm font-semibold text-background-50 hover:bg-primary-900 disabled:opacity-60">
              {saving ? 'Saving...' : 'Save access settings'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function Status({ label, value, active }: { label: string; value: string; active: boolean }) {
  return (
    <div className="rounded-[12px] border border-background-300 bg-background-100 p-4">
      <p className="text-sm text-foreground-500">{label}</p>
      <p className={`mt-1 text-base font-semibold ${active ? 'text-secondary-900' : 'text-primary-800'}`}>{value}</p>
    </div>
  );
}

