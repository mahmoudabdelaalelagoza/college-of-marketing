import { useEffect, useState, type FormEvent } from 'react';
import {
  createAssistantSource,
  deleteAssistantSource,
  getAssistantDashboard,
  saveAssistantSettings,
  updateAssistantSource,
  type AssistantDashboardPayload,
  type AssistantSource,
} from '../data/assistant-api';

const emptySource: Partial<AssistantSource> = {
  title: '',
  kind: 'Q&A',
  reference_path: '',
  content: '',
  is_active: true,
};

export default function DashboardAssistant() {
  const [payload, setPayload] = useState<AssistantDashboardPayload | null>(null);
  const [selected, setSelected] = useState<Partial<AssistantSource>>(emptySource);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const settings = payload?.settings;

  const load = () => {
    setLoading(true);
    setError('');
    getAssistantDashboard()
      .then((data) => {
        setPayload(data);
        setSelected(data.sources[0] || emptySource);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load assistant.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleSaveSettings = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSaving('settings');
    setNotice('');
    setError('');
    try {
      const result = await saveAssistantSettings({
        api_endpoint: String(form.get('api_endpoint') || ''),
        api_key: String(form.get('api_key') || ''),
        model: String(form.get('model') || ''),
        daily_request_limit: Number(form.get('daily_request_limit') || 500),
        assistant_name: String(form.get('assistant_name') || ''),
        welcome_message: String(form.get('welcome_message') || ''),
        fallback_message: String(form.get('fallback_message') || ''),
        is_enabled: form.get('is_enabled') === 'on',
        remove_api_key: form.get('remove_api_key') === 'on',
      });
      setPayload((current) => current ? { ...current, settings: result.settings } : current);
      setNotice('Assistant settings saved.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save settings.');
    } finally {
      setSaving('');
    }
  };

  const handleSaveSource = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const source = {
      title: String(form.get('title') || ''),
      kind: String(form.get('kind') || 'Q&A'),
      reference_path: String(form.get('reference_path') || ''),
      content: String(form.get('content') || ''),
      is_active: form.get('is_active') === 'on',
    };

    setSaving('source');
    setNotice('');
    setError('');
    try {
      const result = selected.id
        ? await updateAssistantSource(String(selected.id), source)
        : await createAssistantSource(source);
      setPayload((current) => {
        if (!current) return current;
        const exists = current.sources.some((item) => item.id === result.source.id);
        return {
          ...current,
          sources: exists
            ? current.sources.map((item) => item.id === result.source.id ? result.source : item)
            : [result.source, ...current.sources],
          stats: {
            ...current.stats,
            active_sources: exists
              ? current.sources.map((item) => item.id === result.source.id ? result.source : item).filter((item) => item.is_active).length
              : [result.source, ...current.sources].filter((item) => item.is_active).length,
          },
        };
      });
      setSelected(result.source);
      setNotice('Knowledge source saved.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save source.');
    } finally {
      setSaving('');
    }
  };

  const handleDeleteSource = async () => {
    if (!selected.id) return;
    if (!window.confirm('Delete this source?')) return;
    await deleteAssistantSource(String(selected.id));
    setSelected(emptySource);
    load();
  };

  const handleFileDraft = async (file: File | null) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('File is larger than 5 MB.');
      return;
    }
    const text = await file.text().catch(() => '');
    if (!text) {
      setError('This file type cannot be extracted in the browser yet. Use TXT or Markdown, or paste the answer manually.');
      return;
    }
    setSelected({ ...emptySource, title: file.name.replace(/\.[^.]+$/, ''), kind: 'Document', content: text.slice(0, 20000), is_active: false });
  };

  if (loading) {
    return <div className="max-w-6xl rounded-[16px] border border-background-300 bg-background-50 p-8 text-sm text-foreground-500">Loading assistant...</div>;
  }

  return (
    <div className="max-w-6xl">
      <div>
        <p className="eyebrow text-accent-700">Website content</p>
        <h1 className="mt-3 font-heading text-4xl font-semibold leading-tight text-foreground-950">Smart assistant</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-foreground-600">
          Manage the agent API, website sources, questions and documents used to answer visitors in English.
        </p>
      </div>

      {notice && <p className="mt-5 rounded-md bg-secondary-50 px-4 py-3 text-sm font-medium text-secondary-900">{notice}</p>}
      {error && <p className="mt-5 rounded-md bg-primary-100 px-4 py-3 text-sm font-medium text-primary-800">{error}</p>}

      <section className="mt-7 rounded-[16px] border border-background-300 bg-background-50 p-6 shadow-soft">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <Stat label="Connection" value={settings?.is_enabled ? settings.has_api_key || settings.api_endpoint ? 'Enabled' : 'Missing API' : 'Disabled'} />
          <Stat label="Active sources" value={String(payload?.stats.active_sources || 0)} />
          <Stat label="Model / daily request limit" value={`${settings?.model || 'gpt-4.1-mini'} / ${settings?.daily_request_limit || 500}`} />
        </div>
        <form onSubmit={handleSaveSettings} className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <label className="text-sm font-semibold text-foreground-800 lg:col-span-2">Agent API endpoint<input name="api_endpoint" defaultValue={settings?.api_endpoint || ''} placeholder="https://api.openai.com/v1/responses" className="mt-2 w-full rounded-[10px] border border-background-300 px-4 py-3" /></label>
          <label className="text-sm font-semibold text-foreground-800">API key<input name="api_key" type="password" placeholder={settings?.has_api_key ? 'Key saved - leave blank to keep it' : 'Paste API key'} className="mt-2 w-full rounded-[10px] border border-background-300 px-4 py-3" /><span className="mt-2 block text-xs font-normal text-foreground-500">Stored encrypted. The key is never returned to the dashboard or public site.</span></label>
          <label className="text-sm font-semibold text-foreground-800">Model<input name="model" defaultValue={settings?.model || 'gpt-4.1-mini'} className="mt-2 w-full rounded-[10px] border border-background-300 px-4 py-3" /></label>
          <label className="text-sm font-semibold text-foreground-800">Assistant name<input name="assistant_name" defaultValue={settings?.assistant_name || 'College assistant'} className="mt-2 w-full rounded-[10px] border border-background-300 px-4 py-3" /></label>
          <label className="text-sm font-semibold text-foreground-800">Daily request limit<input name="daily_request_limit" type="number" min="1" defaultValue={settings?.daily_request_limit || 500} className="mt-2 w-full rounded-[10px] border border-background-300 px-4 py-3" /></label>
          <label className="text-sm font-semibold text-foreground-800 lg:col-span-2">Welcome message<textarea name="welcome_message" defaultValue={settings?.welcome_message || ''} rows={3} className="mt-2 w-full rounded-[10px] border border-background-300 px-4 py-3" /></label>
          <label className="text-sm font-semibold text-foreground-800 lg:col-span-2">Fallback message<textarea name="fallback_message" defaultValue={settings?.fallback_message || ''} rows={3} className="mt-2 w-full rounded-[10px] border border-background-300 px-4 py-3" /></label>
          <div className="flex flex-wrap items-center gap-5 lg:col-span-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground-800"><input name="is_enabled" type="checkbox" defaultChecked={settings?.is_enabled} /> Enable public assistant</label>
            <label className="flex items-center gap-2 text-sm font-semibold text-primary-700"><input name="remove_api_key" type="checkbox" /> Remove saved key when saving</label>
            <button disabled={saving === 'settings'} className="ml-auto rounded-full bg-primary-800 px-6 py-3 text-sm font-semibold text-background-50 hover:bg-primary-900 disabled:opacity-60">{saving === 'settings' ? 'Saving...' : 'Save settings'}</button>
          </div>
        </form>
      </section>

      <div className="mt-7 grid grid-cols-1 gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <section className="rounded-[16px] border border-background-300 bg-background-50 p-6 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-heading text-2xl font-semibold">Knowledge sources</h2>
            <button type="button" onClick={() => setSelected(emptySource)} className="text-sm font-semibold underline">Add Q&A</button>
          </div>
          <label className="mt-5 block text-sm text-foreground-700">Upload a document<input type="file" accept=".txt,.md,.markdown" onChange={(event) => handleFileDraft(event.target.files?.[0] || null)} className="mt-2 block w-full rounded-[10px] border border-dashed border-secondary-300 p-4 text-sm" /></label>
          <p className="mt-2 text-xs text-foreground-500">TXT and Markdown up to 5 MB. PDF/DOCX can be pasted manually for now.</p>
          <div className="mt-6 max-h-[520px] space-y-3 overflow-y-auto pr-1">
            {payload?.sources.length === 0 ? <p className="text-sm text-foreground-500">No sources yet. Add a Q&A to activate the assistant.</p> : payload?.sources.map((source) => (
              <button key={source.id} type="button" onClick={() => setSelected(source)} className={`block w-full rounded-[12px] border px-4 py-3 text-left transition-colors ${selected.id === source.id ? 'border-primary-800 bg-primary-50' : 'border-background-300 hover:bg-background-100'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground-950">{source.title}</p>
                    <p className="mt-1 text-xs text-foreground-500">{source.kind} {source.reference_path ? `- ${source.reference_path}` : ''}</p>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${source.is_active ? 'bg-secondary-50 text-secondary-900' : 'bg-background-200 text-foreground-600'}`}>{source.is_active ? 'Active' : 'Draft'}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-[16px] border border-background-300 bg-background-50 p-6 shadow-soft">
          <div className="flex items-start justify-between gap-4">
            <h2 className="font-heading text-2xl font-semibold">{selected.id ? 'Edit source' : 'New question & answer'}</h2>
            {selected.id && <button type="button" onClick={handleDeleteSource} className="text-sm font-semibold text-primary-800 hover:text-primary-900">Delete</button>}
          </div>
          <form key={selected.id || 'new'} onSubmit={handleSaveSource} className="mt-6 grid grid-cols-1 gap-5">
            <label className="text-sm font-semibold text-foreground-800">Title / question<input name="title" defaultValue={selected.title || ''} className="mt-2 w-full rounded-[10px] border border-background-300 px-4 py-3" /></label>
            <label className="text-sm font-semibold text-foreground-800">Source type<select name="kind" defaultValue={selected.kind || 'Q&A'} className="mt-2 w-full rounded-[10px] border border-background-300 px-4 py-3"><option>Q&A</option><option>Document</option><option>Website snapshot</option><option>Policy</option></select></label>
            <label className="text-sm font-semibold text-foreground-800">Public page path (optional)<input name="reference_path" defaultValue={selected.reference_path || ''} placeholder="/programmes" className="mt-2 w-full rounded-[10px] border border-background-300 px-4 py-3" /></label>
            <label className="text-sm font-semibold text-foreground-800">Approved information / answer<textarea name="content" defaultValue={selected.content || ''} rows={13} className="mt-2 w-full rounded-[10px] border border-background-300 px-4 py-3" /></label>
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground-800"><input name="is_active" type="checkbox" defaultChecked={selected.is_active ?? true} /> Active for public answers</label>
              <button disabled={saving === 'source'} className="ml-auto rounded-full bg-primary-800 px-6 py-3 text-sm font-semibold text-background-50 hover:bg-primary-900 disabled:opacity-60">{saving === 'source' ? 'Saving...' : 'Save source'}</button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-foreground-500">{label}</p>
      <p className="mt-1 text-base font-semibold text-foreground-950">{value}</p>
    </div>
  );
}
