import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import CollegeOfMarketing from "../pages/college-of-marketing/page";
import MarketingExecutiveLevel4 from "../pages/college-of-marketing/marketing-executive-level-4/page";
import MarketingManagerLevel6 from "../pages/college-of-marketing/marketing-manager-level-6/page";
import Courses from "../pages/courses/page";
import Consultation from "../pages/consultation/page";
import Events from "../pages/events/page";
import About from "../pages/about/page";
import Employers from "../pages/employers/page";
import Funding from "../pages/funding/page";
import FAQ from "../pages/faq/page";
import Privacy from "../pages/privacy/page";
import Terms from "../pages/terms/page";
import Accessibility from "../pages/accessibility/page";
import DashboardLayout from "../pages/dashboard/components/DashboardLayout";
import DashboardOverview from "../pages/dashboard/page";
import DashboardLogin from "../pages/dashboard/login/page";
import DashboardLeads from "../pages/dashboard/leads/page";
import DashboardContent from "../pages/dashboard/content/page";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <CollegeOfMarketing />,
  },
  {
    path: "/college-of-marketing",
    element: <CollegeOfMarketing />,
  },
  {
    path: "/college-of-marketing/marketing-executive-level-4",
    element: <MarketingExecutiveLevel4 />,
  },
  {
    path: "/college-of-marketing/marketing-manager-level-6",
    element: <MarketingManagerLevel6 />,
  },
  {
    path: "/courses",
    element: <Courses />,
  },
  {
    path: "/consultation",
    element: <Consultation />,
  },
  {
    path: "/events",
    element: <Events />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/employers",
    element: <Employers />,
  },
  {
    path: "/funding",
    element: <Funding />,
  },
  {
    path: "/faq",
    element: <FAQ />,
  },
  {
    path: "/privacy",
    element: <Privacy />,
  },
  {
    path: "/terms",
    element: <Terms />,
  },
  {
    path: "/accessibility",
    element: <Accessibility />,
  },
  {
    path: "/dashboard/login",
    element: <DashboardLogin />,
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <DashboardOverview />,
      },
      {
        path: "leads",
        element: <DashboardLeads />,
      },
      {
        path: "content/:resource",
        element: <DashboardContent />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
