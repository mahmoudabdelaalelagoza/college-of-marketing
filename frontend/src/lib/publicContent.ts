import { useEffect, useRef, useState } from 'react';
import { getPageSectionCopy, getPublicItems } from './supabaseContent';

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

    getPublicItems<T>(resource)
      .then((nextItems) => {
        if (!active) return;
        setItems(nextItems.length ? nextItems : fallbackRef.current);
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

export function usePageCopy(pagePath: string): Record<string, string> {
  const [copy, setCopy] = useState<Record<string, string>>({});

  useEffect(() => {
    let active = true;

    getPageSectionCopy(pagePath)
      .then((items: PageSectionRow[]) => {
        if (!active) return;
        const next: Record<string, string> = {};
        for (const row of items) {
          const value = (row.published_value || '').trim();
          if (value) next[`${row.section_key}.${row.field_key}`] = value;
        }
        setCopy(next);
      })
      .catch(() => {
        if (active) setCopy({});
      });

    return () => {
      active = false;
    };
  }, [pagePath]);

  return copy;
}

export function resolveCopy(
  copy: Record<string, string>,
  section: string,
  field: string,
  fallback: string,
): string {
  return copy[`${section}.${field}`] || fallback;
}
