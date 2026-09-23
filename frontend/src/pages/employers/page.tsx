import PageShell from '@/components/feature/PageShell';
import { secondaryNav } from '@/lib/nav';
import EmployersHero from './components/EmployersHero';
import EmployersValueProps from './components/EmployersValueProps';
import EmployersHowItWorks from './components/EmployersHowItWorks';
import EmployersSectors from './components/EmployersSectors';
import EmployersConsultation from './components/EmployersConsultation';

export default function Employers() {
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

