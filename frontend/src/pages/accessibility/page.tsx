import PageShell from '@/components/feature/PageShell';
import { secondaryNav } from '@/lib/nav';
import AccessibilityContent from './components/AccessibilityContent';
import { useSeo } from '@/lib/seo';

export default function Accessibility() {

  useSeo({
    title: 'Accessibility Statement',
    description:
      'The accessibility statement for the Kent Business College College of Marketing website, including our conformance target and how to report a barrier.',
    path: '/accessibility',
  });
  return (
    <PageShell navItems={secondaryNav}>
      <AccessibilityContent />
    </PageShell>
  );
}

