import SiteFooter from '@/components/feature/SiteFooter';
import SiteHeader from '@/components/feature/SiteHeader';
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
    <div className="min-h-screen bg-background-100">
      <SiteHeader />
      <main id="main-content">
        <EmployersHero />
        <EmployersValueProps />
        <EmployersHowItWorks />
        <EmployersSectors />
        <EmployersConsultation />
      </main>
      <SiteFooter />
    </div>
  );
}
