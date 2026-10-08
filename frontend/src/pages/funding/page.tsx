import PageShell from '@/components/feature/PageShell';
import { secondaryNav } from '@/lib/nav';
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
    <PageShell navItems={secondaryNav}>
      <FundingHero />
      <FundingFundingTypes />
      <FundingSteps />
      <FundingCTA />
    </PageShell>
  );
}

