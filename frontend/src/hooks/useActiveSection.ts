import { useEffect, useState } from 'react';

/**
 * Scroll-spy for a list of section ids. Returns the id of the section
 * currently closest to the top of the viewport.
 */
export default function useActiveSection(ids: string[], offset = 170): string {
  const [active, setActive] = useState(ids[0] ?? '');

  useEffect(() => {
    const handler = () => {
      let current = ids[0] ?? '';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top - offset <= 0) {
          current = id;
        }
      }
      setActive(current);
    };

    handler();
    window.addEventListener('scroll', handler, { passive: true });
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('scroll', handler);
      window.removeEventListener('resize', handler);
    };
  }, [ids, offset]);

  return active;
}
