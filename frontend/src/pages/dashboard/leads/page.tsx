import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { getLeads, updateLead, type DashboardLead, type LeadStats } from '../data/api';

const statuses = ['new', 'contacted', 'qualified', 'closed'] as const;

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export default function DashboardLeads() {
  const [leads, setLeads] = useState<DashboardLead[]>([]);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [selected, setSelected] = useState<DashboardLead | null>(null);
  const [status, setStatus] = useState('');
  const [query, setQuery] = useState('');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadLeads = useCallback(() => {
    setLoading(true);
    setError('');
    getLeads({ status, q: query, unread: unreadOnly })
      .then((payload) => {
        setLeads(payload.leads);
        setStats(payload.stats);
        setSelected((current) => {
          if (!current) return payload.leads[0] ?? null;
          return payload.leads.find((lead) => lead.id === current.id) ?? payload.leads[0] ?? null;
        });
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load leads.'))
      .finally(() => setLoading(false));
  }, [query, status, unreadOnly]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const visibleSummary = useMemo(() => {
    if (!stats) return 'Loading leads...';
    return `${stats.total} total, ${stats.unread_count} unread, ${stats.due_followups} due follow-ups`;
  }, [stats]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loadLeads();
  };

  const handleUpdate = async (payload: Partial<DashboardLead> & { id: string }) => {
    const result = await updateLead(payload);
    setLeads((items) => items.map((item) => (item.id === result.lead.id ? result.lead : item)));
    setSelected(result.lead);
    await getLeads({ status, q: query, unread: unreadOnly }).then((next) => setStats(next.stats));
  };

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow text-accent-700">Lead management</p>
          <h1 className="mt-3 font-heading text-4xl font-semibold leading-tight text-foreground-950">
            Enquiry inbox
          </h1>
          <p className="mt-2 text-sm text-foreground-500">{visibleSummary}</p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="mt-8 grid grid-cols-1 gap-3 rounded-[16px] border border-background-300 bg-background-50 p-4 shadow-soft lg:grid-cols-[1fr_180px_auto_auto]">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search name, email, organisation or message"
          className="rounded-[10px] border border-background-300 bg-background-50 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-400"
        />
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="rounded-[10px] border border-background-300 bg-background-50 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-400"
        >
          <option value="">All statuses</option>
          {statuses.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
        <label className="flex items-center gap-2 rounded-[10px] border border-background-300 px-4 py-3 text-sm text-foreground-700">
          <input type="checkbox" checked={unreadOnly} onChange={(event) => setUnreadOnly(event.target.checked)} />
          Unread only
        </label>
        <button type="submit" className="rounded-full bg-primary-800 px-6 py-3 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-900">
          Search
        </button>
      </form>

      {error && <p className="mt-5 rounded-md bg-primary-100 px-4 py-3 text-sm text-primary-800">{error}</p>}

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="overflow-hidden rounded-[16px] border border-background-300 bg-background-50 shadow-soft">
          <div className="border-b border-background-300 px-5 py-4">
            <h2 className="font-heading text-2xl font-semibold">Leads</h2>
          </div>
          <div className="max-h-[680px] divide-y divide-background-200 overflow-y-auto">
            {loading ? (
              <p className="px-5 py-8 text-sm text-foreground-500">Loading leads...</p>
            ) : leads.length === 0 ? (
              <p className="px-5 py-8 text-sm text-foreground-500">No leads match this filter.</p>
            ) : (
              leads.map((lead) => (
                <button
                  key={lead.id}
                  type="button"
                  onClick={() => setSelected(lead)}
                  className={`block w-full px-5 py-4 text-left transition-colors ${selected?.id === lead.id ? 'bg-background-100' : 'hover:bg-background-100'}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        {!lead.is_read && <span className="h-2.5 w-2.5 rounded-full bg-accent-600" aria-label="Unread" />}
                        <p className="font-medium text-foreground-950">{lead.name}</p>
                      </div>
                      <p className="mt-1 text-sm text-foreground-500">{lead.email}</p>
                      {lead.interest && <p className="mt-2 line-clamp-1 text-sm text-foreground-700">{lead.interest}</p>}
                    </div>
                    <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-800">
                      {lead.status}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </section>

        <LeadDetail lead={selected} onUpdate={handleUpdate} />
      </div>
    </div>
  );
}

function LeadDetail({ lead, onUpdate }: { lead: DashboardLead | null; onUpdate: (payload: Partial<DashboardLead> & { id: string }) => Promise<void> }) {
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setNotes(lead?.internal_notes || '');
  }, [lead]);

  if (!lead) {
    return (
      <section className="rounded-[16px] border border-background-300 bg-background-50 p-8 text-sm text-foreground-500 shadow-soft">
        Select a lead to view details.
      </section>
    );
  }

  const save = async (payload: Partial<DashboardLead> & { id: string }) => {
    setSaving(true);
    await onUpdate(payload).finally(() => setSaving(false));
  };

  return (
    <section className="rounded-[16px] border border-background-300 bg-background-50 shadow-soft">
      <div className="border-b border-background-300 px-6 py-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="font-heading text-2xl font-semibold">{lead.name}</h2>
            <p className="mt-1 text-sm text-foreground-500">Submitted {dateFormatter.format(new Date(lead.created_at))}</p>
          </div>
          <button
            type="button"
            onClick={() => save({ id: lead.id, is_read: !lead.is_read })}
            className="inline-flex items-center justify-center rounded-full border border-background-300 px-4 py-2 text-sm font-semibold text-foreground-700 hover:bg-background-100"
          >
            {lead.is_read ? 'Mark unread' : 'Mark read'}
          </button>
        </div>
      </div>

      <div className="space-y-7 p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Email" value={lead.email} />
          <Field label="Organisation" value={lead.organisation || '-'} />
          <Field label="Interest" value={lead.interest || '-'} />
          <Field label="Source" value={lead.source} />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground-500">Message</p>
          <p className="mt-2 rounded-[12px] bg-background-100 p-4 text-sm leading-relaxed text-foreground-700">
            {lead.message || 'No message provided.'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground-700">Status</label>
            <select
              value={lead.status}
              onChange={(event) => save({ id: lead.id, status: event.target.value as DashboardLead['status'] })}
              className="w-full rounded-[10px] border border-background-300 bg-background-50 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-400"
            >
              {statuses.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground-700">Follow-up date</label>
            <input
              type="datetime-local"
              defaultValue={lead.follow_up_at ? lead.follow_up_at.slice(0, 16) : ''}
              onBlur={(event) => save({ id: lead.id, follow_up_at: event.target.value })}
              className="w-full rounded-[10px] border border-background-300 bg-background-50 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-400"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-foreground-700">Internal notes</label>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={5}
            className="w-full rounded-[10px] border border-background-300 bg-background-50 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-400"
            placeholder="Add follow-up notes for staff only."
          />
          <button
            type="button"
            onClick={() => save({ id: lead.id, internal_notes: notes })}
            className="mt-3 rounded-full bg-primary-800 px-5 py-2.5 text-sm font-semibold text-background-50 hover:bg-primary-900 disabled:opacity-60"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save notes'}
          </button>
        </div>
      </div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[12px] bg-background-100 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground-500">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-foreground-900">{value}</p>
    </div>
  );
}
