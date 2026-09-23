import PageShell from '@/components/feature/PageShell';
import { secondaryNav } from '@/lib/nav';
import ConsultationHero from './components/ConsultationHero';
import ConsultationBooking from './components/ConsultationBooking';

export default function Consultation() {
  return (
    <PageShell navItems={secondaryNav}>
      <ConsultationHero />
      <ConsultationBooking />
    </PageShell>
  );
}
