import { Children, type ReactNode } from 'react';
import SiteHeader from '@/components/feature/SiteHeader';
import CollegeNav, { type CollegeNavItem } from '@/components/feature/CollegeNav';
import SiteFooter from '@/components/feature/SiteFooter';

interface CollegeShellProps {
  navItems: CollegeNavItem[];
  spyIds?: string[];
  children: ReactNode;
}

export default function CollegeShell({ navItems, spyIds, children }: CollegeShellProps) {
  const sections = Children.toArray(children);
  const [hero, ...rest] = sections;
  const hasHero = rest.length > 0;

  return (
    <div className="min-h-screen bg-background-100">
      <SiteHeader />
      <main>
        {hasHero ? (
          <>
            {hero}
            <CollegeNav items={navItems} spyIds={spyIds} />
            {rest}
          </>
        ) : (
          <>
            <CollegeNav items={navItems} spyIds={spyIds} />
            {children}
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
