import { useEffect, useState } from 'react';

/**
 * Scroll-spy for a list of section ids. Returns the id of the section
 * currently closest to the top of the viewport.
 *
 * Callers usually build the id list inline, so the array identity changes on
 * every render. The effect therefore keys off a joined string rather than the
 * array, and the scroll handler is throttled to one measurement per frame.
 */
export default function useActiveSection(ids: string[], offset = 170): string {
  const [active, setActive] = useState(ids[0] ?? '');
  const idsKey = ids.join('\u0000');

  useEffect(() => {
    const sectionIds = idsKey ? idsKey.split('\u0000') : [];
    let frame = 0;

    const measure = () => {
      frame = 0;
      let current = sectionIds[0] ?? '';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top - offset <= 0) {
          current = id;
        }
      }
      setActive((previous) => (previous === current ? previous : current));
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    };

    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [idsKey, offset]);

  return active;
}
