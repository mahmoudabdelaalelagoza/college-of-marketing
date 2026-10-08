import { useEffect, useState, type FormEvent } from 'react';
import {
  addEventClassification,
  getDashboardEvents,
  saveEventbriteSettings,
  syncEventbrite,
  testEventbriteConnection,
  updateEventClassification,
  updateEventVisibility,
  type DashboardEventbriteSettings,
  type DashboardEventsPayload,
  type DashboardManagedEvent,
  type EventbriteSyncJob,
  type EventClassification,
} from '../data/events-api';

type EventsTab = 'events' | 'categories' | 'connection' | 'history';

const tabs: Array<{ id: EventsTab; label: string }> = [
  { id: 'events', label: 'Events' },
  { id: 'categories', label: 'Categories & visibility' },
  { id: 'connection', label: 'Eventbrite connection' },
  { id: 'history', label: 'Sync history' },
];

const emptySettings: DashboardEventbriteSettings = {
  organization_id: '',
  public_backend_url: '',
  sync_interval_minutes: 15,
  auto_sync_enabled: true,
  show_uncategorized: true,
  connection_status: 'unverified',
  last_test_at: null,
  last_full_sync_at: null,
  last_sync_status: null,
  has_token: false,
};

export default function DashboardEvents() {
  const [tab, setTab] = useState<EventsTab>('events');
  const [payload, setPayload] = useState<DashboardEventsPayload | null>(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const settings = payload?.settings || emptySettings;
  const publicUpcoming = payload?.stats.public_upcoming || 0;

  const load = (search = query) => {
    setLoading(true);
    setError('');
    getDashboardEvents(search)
      .then(setPayload)
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load events.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    load(query);
  };

  const runSync = async () => {
    setBusy('sync');
    setError('');
    setNotice('');
    try {
      const next = await syncEventbrite();
      setPayload(next);
      setNotice(`Sync complete: ${next.job.created_count} created, ${next.job.updated_count} updated, ${next.job.hidden_count} hidden.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sync failed.');
    } finally {
      setBusy('');
    }
  };

  const handleSaveSettings = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy('settings');
    setError('');
    setNotice('');
    try {
      const result = await saveEventbriteSettings({
        private_token: String(form.get('private_token') || ''),
        organization_id: String(form.get('organization_id') || ''),
        public_backend_url: String(form.get('public_backend_url') || ''),
        sync_interval_minutes: Number(form.get('sync_interval_minutes') || 15),
        auto_sync_enabled: form.get('auto_sync_enabled') === 'on',
        show_uncategorized: form.get('show_uncategorized') === 'on',
        remove_token: form.get('remove_token') === 'on',
      });
      setPayload((current) => current ? { ...current, settings: result.settings } : current);
      setNotice('Eventbrite settings saved.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save settings.');
    } finally {
      setBusy('');
    }
  };

  const handleTest = async () => {
    setBusy('test');
    setError('');
    setNotice('');
    try {
      const result = await testEventbriteConnection();
      setPayload((current) => current ? { ...current, settings: result.settings } : current);
      setNotice('Connection verified.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection test failed.');
    } finally {
      setBusy('');
    }
  };

  const handleAddClassification = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy('classification');
    setError('');
    try {
      const result = await addEventClassification({
        name: String(form.get('name') || ''),
        slug: String(form.get('slug') || ''),
        type: String(form.get('type') || 'local'),
      });
      setPayload((current) => current ? { ...current, classifications: [...current.classifications, result.classification] } : current);
      event.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not add classification.');
    } finally {
      setBusy('');
    }
  };

  const toggleClassification = async (item: EventClassification) => {
    const result = await updateEventClassification(item.id, { is_visible: !item.is_visible });
    setPayload((current) => current ? {
      ...current,
      classifications: current.classifications.map((classification) => classification.id === item.id ? result.classification : classification),
    } : current);
    load(query);
  };

  const toggleEvent = async (item: DashboardManagedEvent) => {
    const result = await updateEventVisibility(item.id, { is_hidden: !item.is_hidden, is_active: item.is_active });
    setPayload((current) => current ? {
      ...current,
      events: current.events.map((event) => event.id === item.id ? result.event : event),
    } : current);
  };

  return (
    <div>
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="eyebrow text-accent-700">Website content</p>
          <h1 className="mt-3 font-heading text-4xl font-semibold leading-tight text-foreground-950">Events</h1>
          <p className="mt-2 text-sm text-foreground-500">Manage events, publication rules and your Eventbrite connection.</p>
          <span className="mt-4 inline-flex rounded-full border border-secondary-300 bg-secondary-50 px-3 py-1 text-sm font-semibold text-secondary-900">
            {publicUpcoming} public upcoming
          </span>
        </div>
      </div>

      <div className="mt-8 border-t border-background-300 pt-6">
        <div className="flex flex-wrap gap-2">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`rounded-md border px-4 py-3 text-sm font-semibold transition-colors ${tab === item.id ? 'border-primary-800 bg-primary-800 text-background-50 ring-2 ring-accent-500 ring-offset-2' : 'border-background-300 bg-background-50 text-foreground-800 hover:bg-background-100'}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <StatusStrip settings={settings} workerStatus={payload?.worker.status || 'offline'} />

      <div className="mt-5 rounded-md bg-accent-50 px-4 py-3 text-sm text-accent-900">
        The background worker is offline. Manual sync works now; queued jobs can run automatically when a server worker is added.
      </div>

      {notice && <p className="mt-5 rounded-md bg-secondary-50 px-4 py-3 text-sm font-medium text-secondary-900">{notice}</p>}
      {error && <p className="mt-5 rounded-md bg-primary-100 px-4 py-3 text-sm font-medium text-primary-800">{error}</p>}

      {loading ? (
        <div className="mt-6 rounded-[16px] border border-background-300 bg-background-50 p-8 text-sm text-foreground-500">Loading events...</div>
      ) : tab === 'events' ? (
        <EventsPanel events={payload?.events || []} stats={payload?.stats} query={query} setQuery={setQuery} onSearch={handleSearch} onSync={runSync} onRefresh={() => load(query)} onToggle={toggleEvent} busy={busy} />
      ) : tab === 'categories' ? (
        <CategoriesPanel classifications={payload?.classifications || []} onAdd={handleAddClassification} onToggle={toggleClassification} busy={busy} />
      ) : tab === 'connection' ? (
        <ConnectionPanel settings={settings} onSave={handleSaveSettings} onTest={handleTest} onSync={runSync} busy={busy} />
      ) : (
        <HistoryPanel jobs={payload?.jobs || []} onRefresh={() => load(query)} />
      )}
    </div>
  );
}

function StatusStrip({ settings, workerStatus }: { settings: DashboardEventbriteSettings; workerStatus: string }) {
  return (
    <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 rounded-[12px] border border-background-300 bg-background-50 px-5 py-4 text-sm text-foreground-700 shadow-soft">
      <span>Connection: <strong className="capitalize text-foreground-950">{settings.connection_status}</strong></span>
      <span>Worker: <strong className="capitalize text-foreground-950">{workerStatus}</strong></span>
      <span>Last full sync: <strong className="text-foreground-950">{formatDateTime(settings.last_full_sync_at)}</strong></span>
    </div>
  );
}

function EventsPanel({ events, stats, query, setQuery, onSearch, onSync, onRefresh, onToggle, busy }: {
  events: DashboardManagedEvent[];
  stats?: DashboardEventsPayload['stats'];
  query: string;
  setQuery: (value: string) => void;
  onSearch: (event: FormEvent<HTMLFormElement>) => void;
  onSync: () => void;
  onRefresh: () => void;
  onToggle: (event: DashboardManagedEvent) => void;
  busy: string;
}) {
  return (
    <div className="mt-6 space-y-5">
      <form onSubmit={onSearch} className="flex flex-col gap-3 rounded-[16px] border border-background-300 bg-background-50 p-4 shadow-soft md:flex-row">
        <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 rounded-[10px] border border-background-300 px-4 py-3 text-sm" placeholder="Search events" />
        <button type="button" onClick={onSync} disabled={busy === 'sync'} className="rounded-md border border-secondary-700 px-5 py-2.5 text-sm font-semibold text-secondary-900 hover:bg-secondary-50 disabled:opacity-60">
          {busy === 'sync' ? 'Syncing...' : 'Sync Eventbrite'}
        </button>
        <button type="button" onClick={onRefresh} className="rounded-md border border-background-300 px-5 py-2.5 text-sm font-semibold hover:bg-background-100">Refresh</button>
      </form>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Metric label="Eventbrite total" value={stats?.total || 0} featured />
        <Metric label="Public upcoming" value={stats?.public_upcoming || 0} />
        <Metric label="Public past" value={stats?.public_past || 0} />
        <Metric label="Hidden / draft" value={stats?.hidden_draft || 0} />
      </div>

      <div className="space-y-3">
        {events.length === 0 ? (
          <div className="rounded-[16px] border border-background-300 bg-background-50 p-8 text-sm text-foreground-500">No Eventbrite events synced yet.</div>
        ) : events.map((event) => (
          <details key={event.id} className="rounded-[14px] border border-background-300 bg-background-50 p-5 shadow-soft">
            <summary className="cursor-pointer list-none">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-foreground-950">{event.title}</span>
                    <StatusBadge hidden={event.is_hidden} active={event.is_active} />
                    <span className="text-sm text-foreground-500">Eventbrite · {event.eventbrite_status || event.sales_status || 'synced'}</span>
                  </div>
                  <p className="mt-1 text-sm text-foreground-500">{formatDateTime(event.starts_at)} · {event.location || 'No location'} · {event.category || 'Uncategorized'}</p>
                </div>
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground-800" onClick={(click) => click.stopPropagation()}>
                  <input type="checkbox" checked={!event.is_hidden && event.is_active} onChange={() => onToggle(event)} />
                  Visible
                </label>
              </div>
            </summary>
            <div className="mt-4 border-t border-background-200 pt-4 text-sm text-foreground-600">
              <p>{event.summary || 'No summary from Eventbrite.'}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(event.classifications || []).map((name) => <span key={name} className="rounded-full bg-background-100 px-2.5 py-1 text-xs font-medium">{name}</span>)}
              </div>
              {event.cta_url && <a href={event.cta_url} target="_blank" rel="noreferrer" className="mt-4 inline-flex text-sm font-semibold text-primary-800 hover:text-primary-900">Open Eventbrite</a>}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

function CategoriesPanel({ classifications, onAdd, onToggle, busy }: { classifications: EventClassification[]; onAdd: (event: FormEvent<HTMLFormElement>) => void; onToggle: (item: EventClassification) => void; busy: string }) {
  return (
    <div className="mt-6 space-y-5">
      <div>
        <h2 className="font-heading text-2xl font-semibold">Categories & visibility</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-foreground-600">
          Hiding a category or classification hides every linked event across the public site. Sync never resets these choices.
        </p>
      </div>
      <form onSubmit={onAdd} className="grid grid-cols-1 gap-4 rounded-[16px] border border-background-300 bg-background-50 p-5 shadow-soft md:grid-cols-[1fr_1fr_1fr_1fr]">
        <label className="text-sm font-medium text-foreground-800">Name<input name="name" className="mt-2 w-full rounded-[10px] border border-background-300 px-4 py-3" /></label>
        <label className="text-sm font-medium text-foreground-800">Slug<input name="slug" className="mt-2 w-full rounded-[10px] border border-background-300 px-4 py-3" /></label>
        <label className="text-sm font-medium text-foreground-800">Type<select name="type" className="mt-2 w-full rounded-[10px] border border-background-300 px-4 py-3"><option value="local">Local topic</option><option value="programme">Programme</option><option value="eventbrite">Eventbrite</option></select></label>
        <button disabled={busy === 'classification'} className="self-end rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-foreground-950 hover:bg-accent-400 disabled:opacity-60">Add classification</button>
      </form>
      <div className="space-y-3">
        {classifications.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-[14px] border border-background-300 bg-background-50 p-5 shadow-soft">
            <div>
              <p className="font-semibold text-foreground-950">{item.name}</p>
              <p className="mt-1 text-sm text-foreground-500">{item.classification_type} · {item.slug}</p>
            </div>
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground-800">
              <input type="checkbox" checked={item.is_visible} onChange={() => onToggle(item)} />
              Visible
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConnectionPanel({ settings, onSave, onTest, onSync, busy }: { settings: DashboardEventbriteSettings; onSave: (event: FormEvent<HTMLFormElement>) => void; onTest: () => void; onSync: () => void; busy: string }) {
  return (
    <form onSubmit={onSave} className="mt-6 rounded-[16px] border border-background-300 bg-background-50 p-6 shadow-soft">
      <h2 className="font-heading text-2xl font-semibold">Eventbrite connection</h2>
      <p className="mt-2 text-sm text-foreground-600">Save your account details here, then test the connection. Eventbrite remains the source for event details and registration.</p>
      <div className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <label className="text-sm font-semibold text-foreground-800">Private API token<input name="private_token" type="password" placeholder={settings.has_token ? 'Token saved - leave blank to keep it' : 'Paste private token'} className="mt-2 w-full rounded-[10px] border border-background-300 px-4 py-3" /><span className="mt-2 block text-xs font-normal text-foreground-500">Stored encrypted. The saved token is never returned to the dashboard.</span></label>
        <label className="text-sm font-semibold text-foreground-800">Organisation ID<input name="organization_id" defaultValue={settings.organization_id || ''} className="mt-2 w-full rounded-[10px] border border-background-300 px-4 py-3" /></label>
        <label className="text-sm font-semibold text-foreground-800 lg:col-span-2">Public backend URL (HTTPS)<input name="public_backend_url" defaultValue={settings.public_backend_url || ''} placeholder="https://api.example.com" className="mt-2 w-full rounded-[10px] border border-background-300 px-4 py-3" /><span className="mt-2 block text-xs font-normal text-foreground-500">Needed for webhooks. Scheduled and manual sync can work without this URL.</span></label>
        <label className="text-sm font-semibold text-foreground-800">Sync interval (minutes)<input name="sync_interval_minutes" type="number" min="5" defaultValue={settings.sync_interval_minutes || 15} className="mt-2 w-full rounded-[10px] border border-background-300 px-4 py-3" /></label>
        <div className="space-y-4 self-end text-sm text-foreground-800">
          <label className="flex items-center gap-2"><input name="auto_sync_enabled" type="checkbox" defaultChecked={settings.auto_sync_enabled} /> Enable automatic sync and webhook processing</label>
          <label className="flex items-center gap-2"><input name="show_uncategorized" type="checkbox" defaultChecked={settings.show_uncategorized} /> Show events without a category or classification</label>
          <label className="flex items-center gap-2 text-primary-700"><input name="remove_token" type="checkbox" /> Remove saved token when saving</label>
        </div>
      </div>
      <div className="mt-7 flex flex-wrap gap-3">
        <button className="rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-foreground-950 hover:bg-accent-400 disabled:opacity-60" disabled={busy === 'settings'}>{busy === 'settings' ? 'Saving...' : 'Save settings'}</button>
        <button type="button" onClick={onTest} disabled={busy === 'test'} className="rounded-md border border-background-300 px-6 py-3 text-sm font-semibold hover:bg-background-100 disabled:opacity-60">{busy === 'test' ? 'Testing...' : 'Test saved connection'}</button>
        <button type="button" onClick={onSync} disabled={busy === 'sync'} className="rounded-md border border-background-300 px-6 py-3 text-sm font-semibold hover:bg-background-100 disabled:opacity-60">{busy === 'sync' ? 'Syncing...' : 'Sync now'}</button>
      </div>
    </form>
  );
}

function HistoryPanel({ jobs, onRefresh }: { jobs: EventbriteSyncJob[]; onRefresh: () => void }) {
  return (
    <div className="mt-6 rounded-[16px] border border-background-300 bg-background-50 p-6 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-semibold">Sync history</h2>
          <p className="mt-1 text-sm text-foreground-500">Latest 50 jobs. Temporary failures can be retried manually.</p>
        </div>
        <button type="button" onClick={onRefresh} className="text-sm font-semibold underline">Refresh</button>
      </div>
      <div className="mt-6 space-y-3">
        {jobs.length === 0 ? <p className="text-sm text-foreground-500">No sync jobs yet.</p> : jobs.map((job, index) => (
          <div key={job.id} className="rounded-[12px] border border-background-300 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-foreground-950">#{jobs.length - index} · {job.sync_type} · {job.status}</p>
                <p className="mt-1 text-sm text-foreground-600">{job.trigger_source} · Attempt {job.attempt}</p>
                <p className="mt-1 text-sm text-foreground-600">created: {job.created_count} · updated: {job.updated_count} · hidden: {job.hidden_count} · skipped: {job.skipped_count}</p>
                {job.message && <p className="mt-2 text-sm text-primary-700">{job.message}</p>}
              </div>
              <span className="text-sm text-foreground-500">{formatDateTime(job.created_at)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Metric({ label, value, featured = false }: { label: string; value: number; featured?: boolean }) {
  return (
    <div className={`rounded-[14px] border border-background-300 p-5 shadow-soft ${featured ? 'bg-primary-950 text-background-50' : 'bg-background-50 text-foreground-950'}`}>
      <p className={`eyebrow ${featured ? 'text-background-300' : 'text-foreground-500'}`}>{label}</p>
      <p className="mt-3 font-heading text-4xl font-semibold">{value}</p>
    </div>
  );
}

function StatusBadge({ hidden, active }: { hidden: boolean; active: boolean }) {
  const label = hidden || !active ? 'Hidden' : 'Visible';
  return <span className={`rounded-md px-2 py-1 text-xs font-semibold ${hidden || !active ? 'bg-primary-100 text-primary-800' : 'bg-secondary-50 text-secondary-900'}`}>{label}</span>;
}

function formatDateTime(value?: string | null) {
  if (!value) return 'Never';
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

