import { Children, type ReactNode } from 'react';
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
            <CollegeNav items={navItems} />
            {rest}
          </>
        ) : (
          <>
            <CollegeNav items={navItems} />
            {children}
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
