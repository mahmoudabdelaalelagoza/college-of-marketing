import PageShell from '@/components/feature/PageShell';
import { secondaryNav } from '@/lib/nav';
import PrivacyContent from './components/PrivacyContent';

export default function Privacy() {
  return (
    <PageShell navItems={secondaryNav}>
      <PrivacyContent />
    </PageShell>
  );
}

