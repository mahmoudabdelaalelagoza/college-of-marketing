import { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import NotFound from '../pages/NotFound';
import DashboardFallback from './DashboardFallback';
import CollegeOfMarketing from '../pages/college-of-marketing/page';
import MarketingExecutiveLevel4 from '../pages/college-of-marketing/marketing-executive-level-4/page';
import MarketingManagerLevel6 from '../pages/college-of-marketing/marketing-manager-level-6/page';
import Courses from '../pages/courses/page';
import Consultation from '../pages/consultation/page';
import Events from '../pages/events/page';
import About from '../pages/about/page';
import Employers from '../pages/employers/page';
import Funding from '../pages/funding/page';
import FAQ from '../pages/faq/page';
import Privacy from '../pages/privacy/page';
import Terms from '../pages/terms/page';
import Accessibility from '../pages/accessibility/page';
import DashboardLogin from '../pages/dashboard/login/page';

/**
 * The staff dashboard is a large, rarely used area that public visitors never
 * need, so it is split into a separate chunk that is only fetched when a
 * dashboard route is actually opened.
 */
const DashboardLayout = lazy(() => import('../pages/dashboard/components/DashboardLayout'));
const DashboardOverview = lazy(() => import('../pages/dashboard/page'));
const DashboardLeads = lazy(() => import('../pages/dashboard/leads/page'));
const DashboardContent = lazy(() => import('../pages/dashboard/content/page'));
const DashboardAssistant = lazy(() => import('../pages/dashboard/assistant/page'));
const DashboardSiteAccess = lazy(() => import('../pages/dashboard/site-access/page'));

const routes: RouteObject[] = [
  {
    path: '/',
    element: <CollegeOfMarketing />,
  },
  {
    // The College of Marketing page is the site homepage. This legacy path is
    // kept as an inbound-link-safe redirect so the same content is never
    // served from two URLs, which would split canonical signals.
    path: '/college-of-marketing',
    element: <Navigate to="/" replace />,
  },
  {
    path: '/college-of-marketing/marketing-executive-level-4',
    element: <MarketingExecutiveLevel4 />,
  },
  {
    path: '/college-of-marketing/marketing-manager-level-6',
    element: <MarketingManagerLevel6 />,
  },
  {
    path: '/courses',
    element: <Courses />,
  },
  {
    path: '/consultation',
    element: <Consultation />,
  },
  {
    path: '/events',
    element: <Events />,
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '/employers',
    element: <Employers />,
  },
  {
    path: '/funding',
    element: <Funding />,
  },
  {
    path: '/faq',
    element: <FAQ />,
  },
  {
    path: '/privacy',
    element: <Privacy />,
  },
  {
    path: '/terms',
    element: <Terms />,
  },
  {
    path: '/accessibility',
    element: <Accessibility />,
  },
  {
    path: '/dashboard/login',
    element: <DashboardLogin />,
  },
  {
    path: '/dashboard',
    element: (
      <Suspense fallback={<DashboardFallback />}>
        <DashboardLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <DashboardOverview />,
      },
      {
        path: 'leads',
        element: <DashboardLeads />,
      },
      {
        path: 'assistant',
        element: <DashboardAssistant />,
      },
      {
        path: 'site-access',
        element: <DashboardSiteAccess />,
      },
      {
        path: 'content/:resource',
        element: <DashboardContent />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
