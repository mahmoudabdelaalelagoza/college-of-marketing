import { Link, useLocation } from 'react-router-dom';
import useActiveSection from '@/hooks/useActiveSection';

export interface CollegeNavItem {
  id: string;
  label: string;
  href: string;
}

interface CollegeNavProps {
  items: CollegeNavItem[];
  spyIds?: string[];
}

export default function CollegeNav({ items, spyIds }: CollegeNavProps) {
  const { pathname } = useLocation();
  const spyList = spyIds ?? items.filter((i) => i.href.startsWith('#')).map((i) => i.id);
  const activeId = useActiveSection(spyList);

  const isActive = (item: CollegeNavItem) => {
    if (item.href.startsWith('#')) {
      return activeId === item.id;
    }
    return pathname === item.href;
  };

  return (
    <div className="sticky top-[88px] z-40 border-b border-background-300 bg-background-50/95 shadow-sm backdrop-blur-md sm:top-[96px] md:top-[104px] lg:top-[112px]">
      <div className="container-wide">
        <nav
          className="flex items-center gap-1 overflow-x-auto py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="College of Marketing"
        >
          {items.map((item) =>
            item.href.startsWith('#') ? (
              <a
                key={item.id}
                href={item.href}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
                  isActive(item)
                    ? 'bg-primary-800 text-background-50'
                    : 'text-foreground-700 hover:bg-background-100'
                }`}
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.id}
                to={item.href}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
                  isActive(item)
                    ? 'bg-primary-800 text-background-50'
                    : 'text-foreground-700 hover:bg-background-100'
                }`}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>
      </div>
    </div>
  );
}
