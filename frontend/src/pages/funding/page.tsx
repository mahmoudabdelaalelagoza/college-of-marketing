import SiteFooter from '@/components/feature/SiteFooter';
import SiteHeader from '@/components/feature/SiteHeader';
import FundingHero from './components/FundingHero';
import FundingFundingTypes from './components/FundingFundingTypes';
import FundingSteps from './components/FundingSteps';
import FundingCTA from './components/FundingCTA';
import { useSeo } from '@/lib/seo';

export default function Funding() {

  useSeo({
    title: 'Apprenticeship Funding Explained',
    description:
      'How apprenticeship funding works for Level 4 and Level 6 marketing programmes, including employer levy, co-investment and the eligibility rules that apply.',
    path: '/funding',
  });
  return (
    <div className="min-h-screen bg-background-100">
      <SiteHeader />
      <main id="main-content">
        <FundingHero />
        <FundingFundingTypes />
        <FundingSteps />
        <FundingCTA />
      </main>
      <SiteFooter />
    </div>
  );
}

