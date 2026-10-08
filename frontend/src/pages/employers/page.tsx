import PageShell from '@/components/feature/PageShell';
import { secondaryNav } from '@/lib/nav';
import EmployersHero from './components/EmployersHero';
import EmployersValueProps from './components/EmployersValueProps';
import EmployersHowItWorks from './components/EmployersHowItWorks';
import EmployersSectors from './components/EmployersSectors';
import EmployersConsultation from './components/EmployersConsultation';
import { useSeo } from '@/lib/seo';

export default function Employers() {

  useSeo({
    title: 'Employers & Workforce Development',
    description:
      'Build customer, digital and commercial marketing capability across your organisation with funded Level 4 and Level 6 apprenticeship pathways from Kent Business College.',
    path: '/employers',
  });
  return (
    <PageShell navItems={secondaryNav}>
      <EmployersHero />
      <EmployersValueProps />
      <EmployersHowItWorks />
      <EmployersSectors />
      <EmployersConsultation />
    </PageShell>
  );
}

