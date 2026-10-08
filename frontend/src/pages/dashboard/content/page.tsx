import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import DashboardEvents from '../events/page';
import {
  cmsResourceOptions,
  createCmsItem,
  deleteCmsItem,
  getCmsItems,
  updateCmsItem,
  type CmsItem,
} from '../data/cms-api';

const resourceFields: Record<string, string[]> = {
  articles: ['title', 'slug', 'excerpt', 'content', 'category', 'author', 'image_url', 'image_alt', 'read_minutes', 'is_published', 'published_at', 'display_order'],
  'case-studies': ['title', 'slug', 'sector', 'client_name', 'headline', 'summary', 'challenge', 'approach', 'outcome', 'metrics', 'image_url', 'image_alt', 'is_featured', 'is_published', 'published_at', 'display_order'],
  testimonials: ['name', 'programme', 'reviewer_type', 'photo_url', 'review_text', 'consent', 'status', 'is_featured', 'display_order', 'moderation_notes'],
  events: ['title', 'slug', 'summary', 'description', 'image_url', 'image_alt', 'starts_at', 'ends_at', 'timezone', 'location', 'organiser', 'category', 'classifications', 'format', 'sales_status', 'price_label', 'cta_label', 'cta_url', 'source_url', 'display_order', 'is_active', 'is_featured'],
  'short-courses': ['slug', 'title', 'category', 'duration', 'format', 'owner', 'audience', 'summary', 'focus_list', 'detail', 'icon', 'image_url', 'display_order', 'is_active'],
  people: ['name', 'initials', 'role_title', 'affiliation', 'specialties', 'biography', 'image_url', 'link_url', 'display_order', 'is_active'],
  partners: ['name', 'slug', 'kind', 'description', 'icon', 'image_url', 'link_url', 'display_order', 'is_active'],
  media: ['title', 'url', 'alt_text', 'source_url'],
  'page-sections': ['page_path', 'section_key', 'field_key', 'field_type', 'draft_value', 'published_value', 'is_visible'],
  'knowledge-sources': ['title', 'kind', 'reference_path', 'content', 'import_key', 'is_active'],
  settings: ['setting_key', 'setting_value', 'setting_type', 'is_public'],
};

const longFields = new Set(['content', 'description', 'summary', 'challenge', 'approach', 'outcome', 'review_text', 'biography', 'draft_value', 'published_value', 'setting_value', 'moderation_notes']);
const jsonFields = new Set(['metrics', 'classifications', 'focus_list', 'detail', 'specialties']);
const booleanFields = new Set(['is_published', 'is_featured', 'is_active', 'is_visible', 'is_public', 'consent']);
const numberFields = new Set(['read_minutes', 'display_order']);
const dateFields = new Set(['published_at', 'starts_at', 'ends_at']);

export default function DashboardContent() {
  const params = useParams();
  const resource = params.resource || 'articles';
  return resource === 'events' ? <DashboardEvents /> : <GenericDashboardContent resource={resource} />;
}

function GenericDashboardContent({ resource }: { resource: string }) {
  const [items, setItems] = useState<CmsItem[]>([]);
  const [selected, setSelected] = useState<CmsItem | null>(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fields = useMemo(() => resourceFields[resource] || resourceFields.articles, [resource]);
  const resourceLabel = cmsResourceOptions.find((item) => item.id === resource)?.label || resource;

  const loadItems = useCallback(() => {
    setLoading(true);
    setError('');
    getCmsItems(resource, query)
      .then((itemPayload) => {
        setItems(itemPayload.items);
        setSelected((current) => current && itemPayload.items.find((item) => item.id === current.id) ? current : itemPayload.items[0] || null);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load CMS resource.'))
      .finally(() => setLoading(false));
  }, [query, resource]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const createBlank = () => {
    const blank: CmsItem = {};
    fields.forEach((field) => {
      if (booleanFields.has(field)) blank[field] = field === 'is_active' || field === 'is_visible';
      else if (numberFields.has(field)) blank[field] = 0;
      else if (jsonFields.has(field)) blank[field] = field === 'detail' ? '{}' : '[]';
      else blank[field] = '';
    });
    setSelected(blank);
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loadItems();
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selected) return;

    const form = new FormData(event.currentTarget);
    const payload: CmsItem = {};
    fields.forEach((field) => {
      if (booleanFields.has(field)) payload[field] = form.get(field) === 'on';
      else payload[field] = String(form.get(field) || '');
    });

    setSaving(true);
    setError('');
    try {
      const result = selected.id
        ? await updateCmsItem(resource, String(selected.id), payload)
        : await createCmsItem(resource, payload);
      setSelected(result.item);
      await getCmsItems(resource, query).then((payloadItems) => setItems(payloadItems.items));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save item.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selected?.id) return;
    const confirmed = window.confirm('Delete this item? This cannot be undone.');
    if (!confirmed) return;

    await deleteCmsItem(resource, String(selected.id));
    setSelected(null);
    loadItems();
  };

  const handlePublishPageSection = async () => {
    if (!selected?.id || resource !== 'page-sections') return;
    const result = await updateCmsItem(resource, String(selected.id), {}, 'publish');
    setSelected(result.item);
    loadItems();
  };

  return (
    <div>
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="eyebrow text-accent-700">CMS</p>
          <h1 className="mt-3 font-heading text-4xl font-semibold leading-tight text-foreground-950">{resourceLabel}</h1>
          <p className="mt-2 text-sm text-foreground-500">Create and manage dashboard-controlled website content.</p>
        </div>
        <button type="button" onClick={createBlank} className="rounded-full bg-primary-800 px-5 py-2.5 text-sm font-semibold text-background-50 hover:bg-primary-900">
          New item
        </button>
      </div>

      <form onSubmit={handleSearch} className="mt-6 flex flex-col gap-3 rounded-[16px] border border-background-300 bg-background-50 p-4 shadow-soft md:flex-row">
        <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 rounded-[10px] border border-background-300 px-4 py-3 text-sm" placeholder={`Search ${resourceLabel}`} />
        <button type="submit" className="rounded-full border border-background-300 px-5 py-2.5 text-sm font-semibold hover:bg-background-100">Search</button>
      </form>

      {error && <p className="mt-5 rounded-md bg-primary-100 px-4 py-3 text-sm text-primary-800">{error}</p>}

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="overflow-hidden rounded-[16px] border border-background-300 bg-background-50 shadow-soft">
          <div className="border-b border-background-300 px-5 py-4"><h2 className="font-heading text-2xl font-semibold">Items</h2></div>
          <div className="max-h-[720px] divide-y divide-background-200 overflow-y-auto">
            {loading ? <p className="px-5 py-8 text-sm text-foreground-500">Loading...</p> : items.length === 0 ? <p className="px-5 py-8 text-sm text-foreground-500">No items yet.</p> : items.map((item) => (
              <button key={String(item.id)} type="button" onClick={() => setSelected(item)} className={`block w-full px-5 py-4 text-left hover:bg-background-100 ${selected?.id === item.id ? 'bg-background-100' : ''}`}>
                <p className="font-medium text-foreground-950">{String(item.title || item.name || item.setting_key || item.section_key || item.email || item.id)}</p>
                <p className="mt-1 line-clamp-1 text-sm text-foreground-500">{String(item.slug || item.category || item.kind || item.source_url || item.created_at || '')}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-[16px] border border-background-300 bg-background-50 p-6 shadow-soft">
          {selected ? (
            <form onSubmit={handleSave}>
              <div className="flex items-start justify-between gap-4 border-b border-background-300 pb-5">
                <div>
                  <h2 className="font-heading text-2xl font-semibold">{selected.id ? 'Edit item' : 'New item'}</h2>
                  <p className="mt-1 text-sm text-foreground-500">{resourceLabel}</p>
                </div>
                {selected.id && <button type="button" onClick={handleDelete} className="text-sm font-semibold text-primary-800 hover:text-primary-900">Delete</button>}
              </div>

              <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                {fields.map((field) => (
                  <FieldInput key={field} field={field} value={selected[field]} />
                ))}
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <button type="submit" disabled={saving} className="rounded-full bg-primary-800 px-6 py-3 text-sm font-semibold text-background-50 hover:bg-primary-900 disabled:opacity-60">
                  {saving ? 'Saving...' : 'Save'}
                </button>
                {resource === 'page-sections' && selected.id && (
                  <button type="button" onClick={handlePublishPageSection} className="rounded-full border border-background-300 px-6 py-3 text-sm font-semibold text-foreground-800 hover:bg-background-100">
                    Publish draft
                  </button>
                )}
              </div>
            </form>
          ) : (
            <p className="text-sm text-foreground-500">Select an item or create a new one.</p>
          )}
        </section>
      </div>
    </div>
  );
}

function FieldInput({ field, value }: { field: string; value: unknown }) {
  const label = field.replaceAll('_', ' ');
  const className = 'w-full rounded-[10px] border border-background-300 bg-background-50 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-400';

  if (booleanFields.has(field)) {
    return (
      <label className="flex items-center gap-3 rounded-[10px] border border-background-300 px-4 py-3 text-sm font-medium text-foreground-700">
        <input name={field} type="checkbox" defaultChecked={Boolean(value)} />
        {label}
      </label>
    );
  }

  if (longFields.has(field) || jsonFields.has(field)) {
    const renderedValue = jsonFields.has(field) && typeof value !== 'string' ? JSON.stringify(value ?? (field === 'detail' ? {} : []), null, 2) : String(value ?? '');
    return (
      <div className="md:col-span-2">
        <label className="mb-2 block text-sm font-medium capitalize text-foreground-700">{label}</label>
        <textarea name={field} defaultValue={renderedValue} rows={jsonFields.has(field) ? 6 : 4} className={className} />
      </div>
    );
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-medium capitalize text-foreground-700">{label}</label>
      <input name={field} type={dateFields.has(field) ? 'datetime-local' : numberFields.has(field) ? 'number' : 'text'} defaultValue={formatValue(field, value)} className={className} />
    </div>
  );
}

function formatValue(field: string, value: unknown) {
  if (value === null || value === undefined) return '';
  if (dateFields.has(field) && typeof value === 'string') return value.slice(0, 16);
  return String(value);
}





