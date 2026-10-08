import PageShell from '@/components/feature/PageShell';
import { secondaryNav } from '@/lib/nav';
import ConsultationHero from './components/ConsultationHero';
import ConsultationBooking from './components/ConsultationBooking';
import { useSeo } from '@/lib/seo';

export default function Consultation() {

  useSeo({
    title: 'Book a Consultation',
    description:
      'Book a College of Marketing consultation. We check apprenticeship eligibility and funding, then recommend the full programme or the paid modules that fit your goals.',
    path: '/consultation',
  });
  return (
    <PageShell navItems={secondaryNav}>
      <ConsultationHero />
      <ConsultationBooking />
    </PageShell>
  );
}
