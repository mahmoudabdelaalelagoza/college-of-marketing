import { useEffect, useRef, useState, type ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' && window.matchMedia(REDUCED_MOTION_QUERY).matches
  );
}

/**
 * Subtle editorial scroll reveal: opacity 0 -> 1, translateY(24px) -> 0.
 *
 * Respects prefers-reduced-motion: when the preference is set the element is
 * rendered in its final state immediately and carries no transition, so no
 * fade/slide - and no staggered transition delay - is ever applied.
 */
export default function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion);

  // Track the preference so toggling it at runtime takes effect immediately.
  useEffect(() => {
    const query = window.matchMedia(REDUCED_MOTION_QUERY);
    const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);

    setReducedMotion(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const el = ref.current;
    // With reduced motion there is no hidden state to reveal, so skip observing.
    if (!el || reducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const shown = visible || reducedMotion;

  return (
    <div
      ref={ref}
      className={className}
      style={
        reducedMotion
          ? { opacity: 1, transform: 'none' }
          : {
              opacity: shown ? 1 : 0,
              transform: shown ? 'none' : 'translateY(24px)',
              transition:
                'opacity 850ms cubic-bezier(.22,1,.36,1), transform 850ms cubic-bezier(.22,1,.36,1)',
              transitionDelay: `${delay}ms`,
            }
      }
    >
      {children}
    </div>
  );
}