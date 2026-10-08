import { Children, type ReactNode } from 'react';
import SiteHeader from '@/components/feature/SiteHeader';
import SiteFooter from '@/components/feature/SiteFooter';
import CollegeNav, { type CollegeNavItem } from '@/components/feature/CollegeNav';

interface PageShellProps {
  navItems: CollegeNavItem[];
  /** Section ids to highlight in the contextual nav as the reader scrolls. */
  spyIds?: string[];
  children: ReactNode;
}

/**
 * Standard page frame shared by every public route: global header, contextual
 * college navigation, page content and global footer.
 *
 * The first child is treated as the page hero, which sits above the contextual
 * navigation so the nav stays directly beneath it while scrolling.
 */
export default function PageShell({ navItems, spyIds, children }: PageShellProps) {
  const sections = Children.toArray(children);
  const [hero, ...rest] = sections;
  const hasHero = rest.length > 0;

  return (
    <div className="min-h-screen bg-background-100">
      <SiteHeader />
      <main id="main-content">
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
