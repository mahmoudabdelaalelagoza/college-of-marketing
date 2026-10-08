import PageShell from '@/components/feature/PageShell';
import { secondaryNav } from '@/lib/nav';
import PrivacyContent from './components/PrivacyContent';
import { useSeo } from '@/lib/seo';

export default function Privacy() {

  useSeo({
    title: 'Privacy Notice',
    description:
      'How Kent Business College College of Marketing collects, uses and protects your personal data.',
    path: '/privacy',
  });
  return (
    <PageShell navItems={secondaryNav}>
      <PrivacyContent />
    </PageShell>
  );
}

