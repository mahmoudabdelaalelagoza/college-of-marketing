import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOverview, type OverviewPayload } from './data/api';

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

export default function DashboardOverview() {
  const [data, setData] = useState<OverviewPayload | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getOverview()
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load dashboard.'));
  }, []);

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!data) {
    return <div className="text-sm text-foreground-500">Loading overview...</div>;
  }

  const cards = [
    { label: 'Total leads', value: data.leads.total, icon: 'ri-inbox-line' },
    { label: 'Unread', value: data.leads.unread_count, icon: 'ri-mail-unread-line' },
    { label: 'New', value: data.leads.new_count, icon: 'ri-sparkling-line' },
    { label: 'Newsletter', value: data.newsletters.total, icon: 'ri-newsletter-line' },
  ];

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow text-accent-700">Overview</p>
          <h1 className="mt-3 font-heading text-4xl font-semibold leading-tight text-foreground-950">
            Dashboard overview
          </h1>
        </div>
        <Link to="/dashboard/leads" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-800 hover:text-primary-900">
          View all leads
          <i className="ri-arrow-right-line" />
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article key={card.label} className="rounded-[16px] border border-background-300 bg-background-50 p-6 shadow-soft">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-foreground-500">{card.label}</p>
                <p className="mt-3 font-num text-4xl font-bold leading-none text-foreground-950">{card.value}</p>
              </div>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary-100 text-secondary-800">
                <i className={`${card.icon} text-xl`} />
              </span>
            </div>
          </article>
        ))}
      </div>

      <section className="mt-10 rounded-[16px] border border-background-300 bg-background-50 shadow-soft">
        <div className="flex items-center justify-between border-b border-background-300 px-6 py-5">
          <div>
            <h2 className="font-heading text-2xl font-semibold">Recent leads</h2>
            <p className="mt-1 text-sm text-foreground-500">Latest public form submissions.</p>
          </div>
        </div>

        <div className="divide-y divide-background-200">
          {data.recentLeads.length === 0 ? (
            <p className="px-6 py-8 text-sm text-foreground-500">No leads yet.</p>
          ) : (
            data.recentLeads.map((lead) => (
              <Link key={lead.id} to="/dashboard/leads" className="block px-6 py-4 transition-colors hover:bg-background-100">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-medium text-foreground-950">{lead.name}</p>
                    <p className="text-sm text-foreground-500">{lead.email}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-foreground-500">
                    <span className="rounded-full bg-background-100 px-3 py-1 font-medium text-foreground-700">{lead.status}</span>
                    <span>{dateFormatter.format(new Date(lead.created_at))}</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-md border border-primary-200 bg-primary-50 p-5 text-sm text-primary-800">
      {message}
    </div>
  );
}
