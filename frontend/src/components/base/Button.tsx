import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type ButtonVariant = 'primary' | 'gold' | 'outline' | 'outlineLight' | 'soft' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  arrow?: boolean;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

const base =
  'group relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full transition-all duration-300 cursor-pointer';

/* Main call-to-action variants share the premium gold laurel treatment. */
const laurelVariants: ButtonVariant[] = ['primary', 'gold'];

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'btn-laurel',
  gold: 'btn-laurel',
  outline:
    'font-medium border border-foreground-950/15 text-foreground-950 hover:border-foreground-950/35 hover:bg-foreground-950/[0.03]',
  outlineLight:
    'font-medium border border-background-50/25 text-background-50 hover:bg-background-50/10',
  soft: 'font-medium bg-primary-100 text-primary-800 hover:bg-primary-200',
  link: 'font-medium text-primary-800 hover:text-primary-900 px-0',
};

function laurelSize(size: ButtonSize): string {
  if (size === 'sm') return 'h-9 px-6 text-xs font-semibold';
  if (size === 'lg') return 'h-[54px] px-16 text-[15px] font-semibold';
  return 'h-12 px-12 text-sm font-semibold';
}

function plainSize(size: ButtonSize): string {
  if (size === 'sm') return 'h-9 px-4 text-xs font-medium';
  if (size === 'lg') return 'h-[52px] px-8 text-[15px] font-medium';
  return 'h-11 px-6 text-sm font-medium';
}

function ArrowIcon() {
  return (
    <i
      aria-hidden="true"
      className="ri-arrow-right-line text-base transition-transform duration-300 group-hover:translate-x-1"
    />
  );
}

export default function Button({
  children,
  to,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  arrow = false,
  type = 'button',
  disabled = false,
}: ButtonProps) {
  const isLaurel = laurelVariants.includes(variant);
  const sizeClass = isLaurel ? laurelSize(size) : plainSize(size);
  const disabledClass = disabled ? 'pointer-events-none opacity-60 saturate-75' : '';
  const classes = `${base} ${variantStyles[variant]} ${sizeClass} ${disabledClass} ${className}`;

  const content = (
    <span className="relative z-10 inline-flex items-center gap-2">
      {children}
      {arrow && <ArrowIcon />}
    </span>
  );

  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} onClick={onClick}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} disabled={disabled}>
      {content}
    </button>
  );
}

