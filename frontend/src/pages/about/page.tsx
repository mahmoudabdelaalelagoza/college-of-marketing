import SiteFooter from '@/components/feature/SiteFooter';
import SiteHeader from '@/components/feature/SiteHeader';
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
    <div className="min-h-screen bg-background-100">
      <SiteHeader />
      <main id="main-content">
        <AboutHero />
        <AboutStatsStrip />
        <AboutMission />
        <AboutValues />
        <AboutLeadership />
        <AboutCTA />
      </main>
      <SiteFooter />
    </div>
  );
}
