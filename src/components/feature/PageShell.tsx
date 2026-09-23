import type { ReactNode } from 'react';
import SiteHeader from '@/components/feature/SiteHeader';
import SiteFooter from '@/components/feature/SiteFooter';
import CollegeNav, { type CollegeNavItem } from '@/components/feature/CollegeNav';

interface PageShellProps {
  navItems: CollegeNavItem[];
  children: ReactNode;
}

/**
 * Standard page frame for standalone information pages: global header,
 * contextual college navigation, page content and global footer.
 */
export default function PageShell({ navItems, children }: PageShellProps) {
  return (
    <div className="min-h-screen bg-background-100">
      <SiteHeader />
      <CollegeNav items={navItems} />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}