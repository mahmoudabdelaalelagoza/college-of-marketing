import type { CollegeNavItem } from '@/components/feature/CollegeNav';
import CollegeShell from './components/CollegeShell';
import Hero from './components/Hero';
import TrustStrip from './components/TrustStrip';
import Positioning from './components/Positioning';
import AudienceRouter from './components/AudienceRouter';
import ProgrammeComparison from './components/ProgrammeComparison';
import CapabilitySystem from './components/CapabilitySystem';
import WorkplaceOS from './components/WorkplaceOS';
import WorkplaceOutputs from './components/WorkplaceOutputs';
import ProfessionalPathway from './components/ProfessionalPathway';
import EmployerValue from './components/EmployerValue';
import Funding from './components/Funding';
import EligibilityChecker from './components/EligibilityChecker';
import Testimonials from './components/Testimonials';
import CaseStudies from './components/CaseStudies';
import CommunityGallery from './components/CommunityGallery';
import FAQ from './components/FAQ';
import { faqItems } from './faq-data';
import FinalCTA from './components/FinalCTA';

const navItems: CollegeNavItem[] = [
  { id: 'overview', label: 'Overview', href: '#overview' },
  { id: 'level-4', label: 'Level 4', href: '/college-of-marketing/marketing-executive-level-4' },
  { id: 'level-6', label: 'Level 6', href: '/college-of-marketing/marketing-manager-level-6' },
  { id: 'capabilities', label: 'Capabilities', href: '#capabilities' },
  { id: 'employers', label: 'Employers', href: '#employers' },
  { id: 'pathway', label: 'Professional pathway', href: '#pathway' },
  { id: 'funding', label: 'Funding', href: '#funding' },
  { id: 'faq', label: 'FAQ', href: '#faq' },
];

const spyIds = ['overview', 'capabilities', 'employers', 'pathway', 'funding', 'faq'];

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollegeOrUniversity',
      name: 'Kent Business College — College of Marketing',
      description:
        'A specialist marketing college offering funded professional pathways: Marketing Executive Level 4 and Marketing Manager Level 6.',
      address: {
        '@type': 'PostalAddress',
        addressRegion: 'Kent',
        addressCountry: 'GB',
      },
      areaServed: 'United Kingdom',
    },
    {
      '@type': 'Course',
      name: 'Marketing Executive — Level 4',
      description:
        'Build the professional and digital foundations of modern marketing, with a CIM Level 4 Certificate pathway.',
      provider: { '@type': 'CollegeOrUniversity', name: 'Kent Business College' },
    },
    {
      '@type': 'Course',
      name: 'Marketing Manager — Level 6',
      description:
        'Move from campaign delivery to strategic marketing leadership, with a CIM Level 6 Diploma pathway.',
      provider: { '@type': 'CollegeOrUniversity', name: 'Kent Business College' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
  ],
};

export default function CollegeOfMarketing() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <CollegeShell navItems={navItems} spyIds={spyIds}>
        <Hero />
        <TrustStrip />
        <Positioning />
        <AudienceRouter />
        <ProgrammeComparison />
        <CapabilitySystem />
        <WorkplaceOS />
        <WorkplaceOutputs />
        <ProfessionalPathway />
        <EmployerValue />
        <Funding />
        <EligibilityChecker />
        <Testimonials />
        <CaseStudies />
        <CommunityGallery />
        <FAQ />
        <FinalCTA />
      </CollegeShell>
    </>
  );
}
