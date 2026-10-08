import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Restores sensible scrolling on navigation.
 *
 * Two problems this solves:
 *  1. Without it, moving between pages keeps the previous scroll position, so a
 *     visitor who scrolls to the footer and then opens another page lands in the
 *     middle of it.
 *  2. Cross-page anchor links (`/college-of-marketing#eligibility` and similar)
 *     are used throughout the navigation and calls to action. React Router does
 *     not scroll to the target element itself, so those links silently did
 *     nothing beyond changing the URL.
 */
export default function ScrollManager() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    // The timeout lets the destination route paint before we measure it,
    // otherwise the target element may not exist yet.
    const frame = window.setTimeout(() => {
      if (hash) {
        const target = document.getElementById(decodeURIComponent(hash.slice(1)));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }, 0);

    return () => window.clearTimeout(frame);
  }, [pathname, hash, key]);

  return null;
}
