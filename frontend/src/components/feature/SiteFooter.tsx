import { Link } from 'react-router-dom';

const columns = [
  {
    title: 'College of Marketing',
    links: [
      { label: 'Overview', to: '/college-of-marketing' },
      { label: 'Who we are', to: '/about' },
      { label: 'Courses', to: '/courses' },
      { label: 'Events', to: '/events' },
    ],
  },
  {
    title: 'Programmes',
    links: [
      { label: 'Marketing Executive - Level 4', to: '/college-of-marketing/marketing-executive-level-4' },
      { label: 'Marketing Manager - Level 6', to: '/college-of-marketing/marketing-manager-level-6' },
      { label: 'Funding explained', to: '/funding' },
      { label: 'Eligibility checker', to: '/college-of-marketing#eligibility' },
    ],
  },
  {
    title: 'Employers',
    links: [
      { label: 'Employer value', to: '/employers' },
      { label: 'Workforce consultation', to: '/employers#consultation' },
      { label: 'Case studies', to: '/college-of-marketing#case-studies' },
      { label: 'FAQ', to: '/faq' },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="bg-primary-950 text-background-50">
      <div className="container-wide py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link
              to="/college-of-marketing"
              className="inline-flex rounded-md border border-accent-400/25 bg-background-50 px-4 py-3 shadow-soft"
              aria-label="College of Marketing home"
            >
              <img
                src="/brand/college-of-marketing-logo.png"
                alt="College of Marketing"
                className="h-16 w-auto max-w-[280px] object-contain md:h-20"
              />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-background-50/65">
              A specialist marketing college connecting professional theory with the real
              responsibilities of working marketers - building confident, commercially minded
              professionals.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {['CIM aligned', 'Employer funded', 'Workplace applied'].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-background-50/15 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-background-50/70"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="eyebrow text-accent-500">{col.title}</h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-background-50/70 transition-colors hover:text-background-50"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-background-50/12 pt-8 text-xs text-background-50/55 sm:flex-row sm:items-center sm:justify-between">
          <p>(c) {new Date().getFullYear()} Kent Business College - College of Marketing. All rights reserved.</p>
          <div className="flex flex-wrap gap-5">
            <Link to="/privacy" className="transition-colors hover:text-background-50">
              Privacy
            </Link>
            <Link to="/terms" className="transition-colors hover:text-background-50">
              Terms
            </Link>
            <Link to="/accessibility" className="transition-colors hover:text-background-50">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

