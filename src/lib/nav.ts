import type { CollegeNavItem } from '@/components/feature/CollegeNav';

/**
 * Shared contextual navigation for the standalone information pages
 * (Courses, Events, Who we are, Employers, Funding, FAQ).
 */
export const secondaryNav: CollegeNavItem[] = [
  { id: 'overview', label: 'Overview', href: '/college-of-marketing' },
  { id: 'courses', label: 'Courses', href: '/courses' },
  { id: 'events', label: 'Events', href: '/events' },
  { id: 'about', label: 'Who we are', href: '/about' },
  { id: 'employers', label: 'Employers', href: '/employers' },
  { id: 'funding', label: 'Funding', href: '/funding' },
  { id: 'faq', label: 'FAQ', href: '/faq' },
];