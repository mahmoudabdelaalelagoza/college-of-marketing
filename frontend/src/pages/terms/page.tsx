import PageShell from '@/components/feature/PageShell';
import { secondaryNav } from '@/lib/nav';
import TermsContent from './components/TermsContent';

export default function Terms() {
  return (
    <PageShell navItems={secondaryNav}>
      <TermsContent />
    </PageShell>
  );
}

