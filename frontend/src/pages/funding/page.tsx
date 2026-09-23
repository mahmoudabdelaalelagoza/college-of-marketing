import PageShell from '@/components/feature/PageShell';
import { secondaryNav } from '@/lib/nav';
import FundingHero from './components/FundingHero';
import FundingFundingTypes from './components/FundingFundingTypes';
import FundingSteps from './components/FundingSteps';
import FundingCTA from './components/FundingCTA';

export default function Funding() {
  return (
    <PageShell navItems={secondaryNav}>
      <FundingHero />
      <FundingFundingTypes />
      <FundingSteps />
      <FundingCTA />
    </PageShell>
  );
}

