import type { ReactNode } from 'react';
import SiteHeader from '@/components/feature/SiteHeader';
import CollegeNav, { type CollegeNavItem } from '@/components/feature/CollegeNav';
import SiteFooter from '@/components/feature/SiteFooter';

interface CollegeShellProps {
  navItems: CollegeNavItem[];
  spyIds?: string[];
  children: ReactNode;
}

export default function CollegeShell({ navItems, spyIds, children }: CollegeShellProps) {
  return (
    <div className="min-h-screen bg-background-100">
      <SiteHeader />
      <CollegeNav items={navItems} spyIds={spyIds} />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
