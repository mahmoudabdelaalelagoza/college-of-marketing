import PageShell from '@/components/feature/PageShell';
import { secondaryNav } from '@/lib/nav';
import AboutHero from './components/AboutHero';
import AboutStatsStrip from './components/AboutStatsStrip';
import AboutMission from './components/AboutMission';
import AboutValues from './components/AboutValues';
import AboutLeadership from './components/AboutLeadership';
import AboutCTA from './components/AboutCTA';

export default function About() {
  return (
    <PageShell navItems={secondaryNav}>
      <AboutHero />
      <AboutStatsStrip />
      <AboutMission />
      <AboutValues />
      <AboutLeadership />
      <AboutCTA />
    </PageShell>
  );
}

