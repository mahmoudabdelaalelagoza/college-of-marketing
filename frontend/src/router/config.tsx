import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import NotFound from "../pages/NotFound";
import CollegeOfMarketing from "../pages/college-of-marketing/page";
import MarketingExecutiveLevel4 from "../pages/college-of-marketing/marketing-executive-level-4/page";
import MarketingManagerLevel6 from "../pages/college-of-marketing/marketing-manager-level-6/page";
import Courses from "../pages/courses/page";
import Events from "../pages/events/page";
import About from "../pages/about/page";
import Employers from "../pages/employers/page";
import Funding from "../pages/funding/page";
import FAQ from "../pages/faq/page";
import Privacy from "../pages/privacy/page";
import Terms from "../pages/terms/page";
import Accessibility from "../pages/accessibility/page";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/college-of-marketing" replace />,
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
    path: "*",
    element: <NotFound />,
  },
];

export default routes;

