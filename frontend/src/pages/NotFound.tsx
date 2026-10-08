import { useLocation } from 'react-router-dom';
import Button from '@/components/base/Button';
import PageShell from '@/components/feature/PageShell';
import { secondaryNav } from '@/lib/nav';
import { useSeo } from '@/lib/seo';

export default function NotFound() {
  const location = useLocation();

  useSeo({
    title: 'Page not found',
    description:
      'The page you were looking for could not be found. Browse College of Marketing courses, programmes, funding and employer information.',
    path: '/404',
  });

  return (
    <PageShell navItems={secondaryNav}>
      <section className="relative overflow-hidden bg-background-100 py-24 md:py-32">
        <div className="container-wide text-center">
          <p className="font-heading text-[clamp(5rem,16vw,10rem)] font-semibold leading-none text-background-300">
            404
          </p>
          <h1 className="mt-6 font-heading text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-tight text-foreground-950">
            We could not find that page
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-foreground-600">
            The page may have moved, or the address may be incorrect. Use the navigation above, or
            start from one of the sections below.
          </p>
          <p className="mt-3 break-all text-sm text-foreground-500">{location.pathname}</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button to="/college-of-marketing" variant="primary" arrow>
              College of Marketing overview
            </Button>
            <Button to="/consultation" variant="outline">
              Book a consultation
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
