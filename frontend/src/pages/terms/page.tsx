import PageShell from '@/components/feature/PageShell';
import { secondaryNav } from '@/lib/nav';
import TermsContent from './components/TermsContent';
import { useSeo } from '@/lib/seo';

export default function Terms() {

  useSeo({
    title: 'Terms & Conditions',
    description:
      'Terms and conditions for using the Kent Business College College of Marketing website.',
    path: '/terms',
  });
  return (
    <PageShell navItems={secondaryNav}>
      <TermsContent />
    </PageShell>
  );
}

