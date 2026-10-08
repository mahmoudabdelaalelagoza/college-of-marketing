import { useEffect, useRef, useState } from 'react';

interface PublicContentPayload<T> {
  resource: string;
  items: T[];
  item?: T | null;
}

export function usePublicContent<T>(resource: string, fallback: T[] = []) {
  const fallbackRef = useRef(fallback);
  const [items, setItems] = useState<T[]>(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fallbackRef.current = fallback;
  }, [fallback]);

  useEffect(() => {
    let active = true;
    setLoading(true);

    fetch(`/api/public/content?resource=${encodeURIComponent(resource)}`)
      .then((response) => response.ok ? response.json() as Promise<PublicContentPayload<T>> : Promise.reject(new Error('Content unavailable')))
      .then((payload) => {
        if (!active) return;
        setItems(payload.items?.length ? payload.items : fallbackRef.current);
      })
      .catch(() => {
        if (active) setItems(fallbackRef.current);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [resource]);

  return { items, loading };
}

interface PageSectionRow {
  section_key: string;
  field_key: string;
  published_value: string | null;
}

/**
 * Published editorial copy for a page, keyed as `"section.field"`.
 *
 * This is the read side of the CMS "Pages & Sections" resource. An editor edits
 * a draft in the dashboard, publishes it, and the published value replaces the
 * React default on the public page. Layout and component structure stay in
 * code; only copy moves into the CMS, which keeps the site editable without
 * turning every page into a rendered document.
 *
 * The public endpoint only returns `published_value` for visible rows, so
 * unpublished drafts are never served and the page keeps its built-in copy
 * until an editor publishes a replacement.
 */
export function usePageCopy(pagePath: string): Record<string, string> {
  const [copy, setCopy] = useState<Record<string, string>>({});

  useEffect(() => {
    let active = true;

    fetch(`/api/public/content?resource=page-sections&page=${encodeURIComponent(pagePath)}`)
      .then((response) =>
        response.ok
          ? (response.json() as Promise<{ items?: PageSectionRow[] }>)
          : Promise.reject(new Error('Content unavailable')),
      )
      .then((payload) => {
        if (!active) return;
        const next: Record<string, string> = {};
        for (const row of payload.items || []) {
          const value = (row.published_value || '').trim();
          if (value) next[`${row.section_key}.${row.field_key}`] = value;
        }
        setCopy(next);
      })
      .catch(() => {
        // The page keeps its built-in copy when the CMS is unreachable.
        if (active) setCopy({});
      });

    return () => {
      active = false;
    };
  }, [pagePath]);

  return copy;
}

/**
 * Published CMS value for a field, or the supplied default when no published
 * value exists.
 */
export function resolveCopy(
  copy: Record<string, string>,
  section: string,
  field: string,
  fallback: string,
): string {
  return copy[`${section}.${field}`] || fallback;
}
