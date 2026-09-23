import type { ReactNode } from 'react';

interface EyebrowProps {
  children: ReactNode;
  tone?: 'muted' | 'light' | 'gold' | 'maroon';
  className?: string;
}

const toneMap: Record<string, string> = {
  muted: 'text-foreground-500',
  light: 'text-background-50/70',
  gold: 'text-accent-500',
  maroon: 'text-primary-700',
};

export default function Eyebrow({ children, tone = 'muted', className = '' }: EyebrowProps) {
  return (
    <span className={`eyebrow flex items-center gap-3 ${toneMap[tone]} ${className}`}>
      <span
        aria-hidden="true"
        className={`inline-block h-px w-6 ${
          tone === 'light' ? 'bg-background-50/40' : tone === 'gold' ? 'bg-accent-500/70' : 'bg-current opacity-40'
        }`}
      />
      {children}
    </span>
  );
}