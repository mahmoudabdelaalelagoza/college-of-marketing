import PageShell from '@/components/feature/PageShell';
import { secondaryNav } from '@/lib/nav';
import AboutHero from './components/AboutHero';
import AboutStatsStrip from './components/AboutStatsStrip';
import AboutMission from './components/AboutMission';
import AboutValues from './components/AboutValues';
import AboutLeadership from './components/AboutLeadership';
import AboutCTA from './components/AboutCTA';
import { useSeo } from '@/lib/seo';

export default function About() {

  useSeo({
    title: 'Who We Are',
    description:
      'The purpose, values and leadership behind Kent Business College College of Marketing, a specialist college for professional marketing development in Kent.',
    path: '/about',
  });
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

