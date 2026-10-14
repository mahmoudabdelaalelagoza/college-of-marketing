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
  return <span className={`eyebrow ${toneMap[tone]} ${className}`}>{children}</span>;
}
