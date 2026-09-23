import type { CollegeNavItem } from '@/components/feature/CollegeNav';
import CollegeShell from '@/pages/college-of-marketing/components/CollegeShell';
import type { ProgrammeConfig } from './types';
import ProgrammeHero from './components/ProgrammeHero';
import ProgrammeKeyFacts from './components/ProgrammeKeyFacts';
import ProgrammeOverview from './components/ProgrammeOverview';
import ProgrammeCurriculum from './components/ProgrammeCurriculum';
import ProgrammeCapabilities from './components/ProgrammeCapabilities';
import ProgrammeOutputs from './components/ProgrammeOutputs';
import ProgrammePathway from './components/ProgrammePathway';
import ProgrammeFunding from './components/ProgrammeFunding';
import ProgrammeFAQ from './components/ProgrammeFAQ';
import ProgrammeCTA from './components/ProgrammeCTA';

interface ProgrammePageProps {
  config: ProgrammeConfig;
}

const sectionIds = ['overview', 'curriculum', 'capabilities', 'outputs', 'pathway', 'funding', 'faq', 'apply'];

export default function ProgrammePage({ config }: ProgrammePageProps) {
  const otherLevel = config.level === 'Level 4' ? 'Level 6' : 'Level 4';
  const otherPath =
    config.level === 'Level 4'
      ? '/college-of-marketing/marketing-manager-level-6'
      : '/college-of-marketing/marketing-executive-level-4';

  const navItems: CollegeNavItem[] = [
    { id: 'overview', label: 'Overview', href: '#overview' },
    { id: 'curriculum', label: 'Curriculum', href: '#curriculum' },
    { id: 'capabilities', label: 'Capabilities', href: '#capabilities' },
    { id: 'outputs', label: 'Workplace outputs', href: '#outputs' },
    { id: 'pathway', label: 'Professional pathway', href: '#pathway' },
    { id: 'funding', label: 'Funding', href: '#funding' },
    { id: 'faq', label: 'FAQ', href: '#faq' },
    { id: 'apply', label: 'Apply', href: '#apply' },
    { id: `other-${otherLevel}`, label: otherLevel, href: otherPath },
    { id: 'college', label: 'College overview', href: '/college-of-marketing' },
  ];

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Course',
        name: `${config.shortTitle} - ${config.level}`,
        description: config.hero.copy,
        provider: { '@type': 'CollegeOrUniversity', name: 'Kent Business College' },
        educationalLevel: config.level,
        hasCourseInstance: {
          '@type': 'CourseInstance',
          courseMode: 'Blended',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: config.faq.items.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <CollegeShell navItems={navItems} spyIds={sectionIds}>
        <ProgrammeHero config={config} />
        <ProgrammeKeyFacts config={config} />
        <ProgrammeOverview config={config} />
        <ProgrammeCurriculum config={config} />
        <ProgrammeCapabilities config={config} />
        <ProgrammeOutputs config={config} />
        <ProgrammePathway config={config} />
        <ProgrammeFunding config={config} />
        <ProgrammeFAQ config={config} />
        <ProgrammeCTA config={config} />
      </CollegeShell>
    </>
  );
}
