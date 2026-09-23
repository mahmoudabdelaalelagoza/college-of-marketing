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
