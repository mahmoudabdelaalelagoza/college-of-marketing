import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/base/Button';

interface NavGroup {
  label: string;
  items: { label: string; to: string; note?: string }[];
}

const groups: NavGroup[] = [
  {
    label: 'Colleges',
    items: [
      { label: 'College of Marketing', to: '/college-of-marketing', note: 'Funded professional pathways' },
      { label: 'Marketing Executive - Level 4', to: '/college-of-marketing/marketing-executive-level-4' },
      { label: 'Marketing Manager - Level 6', to: '/college-of-marketing/marketing-manager-level-6' },
    ],
  },
];

const simpleLinks = [
  { label: 'Courses', to: '/courses' },
  { label: 'Events', to: '/events' },
  { label: 'Who we are', to: '/about' },
  { label: 'Employers', to: '/employers' },
];

const moreGroup: NavGroup = {
  label: 'More',
  items: [
    { label: 'Capabilities', to: '/college-of-marketing#capabilities' },
    { label: 'Professional pathway', to: '/college-of-marketing#pathway' },
    { label: 'Funding', to: '/funding' },
    { label: 'Eligibility checker', to: '/college-of-marketing#eligibility' },
    { label: 'FAQ', to: '/faq' },
  ],
};

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const dropdown = (group: NavGroup) => (
    <div className="relative" key={group.label}>
      <button
        type="button"
        onClick={() => setOpenMenu(openMenu === group.label ? null : group.label)}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground-800 transition-colors hover:text-primary-800"
        aria-expanded={openMenu === group.label}
      >
        {group.label}
        <i
          className={`ri-arrow-down-s-line text-base transition-transform duration-300 ${
            openMenu === group.label ? 'rotate-180' : ''
          }`}
        />
      </button>
      {openMenu === group.label && (
        <div className="absolute left-0 top-full mt-2 w-72 rounded-[14px] border border-background-300 bg-background-50 p-2 shadow-md">
          {group.items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpenMenu(null)}
              className="block rounded-[10px] px-3 py-2.5 transition-colors hover:bg-background-100"
            >
              <span className="block text-sm font-medium text-foreground-900">{item.label}</span>
              {item.note && (
                <span className="mt-0.5 block text-xs text-foreground-500">{item.note}</span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 h-[88px] border-b sm:h-[96px] md:h-[104px] lg:h-[112px] transition-colors duration-300 ${
        scrolled
          ? 'border-background-300 bg-background-50/85 backdrop-blur-md'
          : 'border-transparent bg-background-50'
      }`}
    >
      <div className="container-wide flex h-full items-center justify-between gap-6">
        <Link
          to="/"
          className="flex h-full shrink-0 items-center"
          aria-label="College of Marketing home"
        >
          <img
            src="/brand/college-of-marketing-mark.png"
            alt="College of Marketing"
            className="h-14 w-14 object-contain sm:hidden"
          />
          <img
            src="/brand/college-of-marketing-logo.png"
            alt="College of Marketing"
            className="hidden w-[180px] max-w-[30vw] object-contain sm:block md:w-[200px] lg:w-[220px] xl:w-[220px]"
          />
        </Link>

        <nav className="hidden items-center lg:flex" aria-label="Primary">
          {dropdown(groups[0])}
          {simpleLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="px-3 py-2 text-sm font-medium text-foreground-800 transition-colors hover:text-primary-800"
            >
              {link.label}
            </Link>
          ))}
          {dropdown(moreGroup)}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/college-of-marketing#eligibility"
            className="text-sm font-medium text-foreground-700 transition-colors hover:text-primary-800"
          >
            Check eligibility
          </Link>
          <Button to="/college-of-marketing#apply" variant="primary" arrow>
            Apply Now
          </Button>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-md text-foreground-900 lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          <i className={mobileOpen ? 'ri-close-line text-2xl' : 'ri-menu-line text-2xl'} />
        </button>
      </div>

      {mobileOpen && (
        <div className="border-b border-background-300 bg-background-50 lg:hidden">
          <div className="container-wide flex flex-col py-4">
            {[...groups[0].items, ...simpleLinks, ...moreGroup.items].map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className="border-b border-background-200 py-3 text-sm font-medium text-foreground-800 last:border-0"
              >
                {item.label}
              </Link>
            ))}
            <Button to="/college-of-marketing#apply" variant="primary" className="mt-4 w-full" arrow>
              Apply Now
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
