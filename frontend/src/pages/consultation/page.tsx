import SiteFooter from '@/components/feature/SiteFooter';
import SiteHeader from '@/components/feature/SiteHeader';
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
    <div className="min-h-screen bg-background-100">
      <SiteHeader />
      <main id="main-content">
        <ConsultationHero />
        <ConsultationBooking />
      </main>
      <SiteFooter />
    </div>
  );
}
