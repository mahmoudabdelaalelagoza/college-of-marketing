import PageShell from '@/components/feature/PageShell';
import { secondaryNav } from '@/lib/nav';
import AccessibilityContent from './components/AccessibilityContent';

export default function Accessibility() {
  return (
    <PageShell navItems={secondaryNav}>
      <AccessibilityContent />
    </PageShell>
  );
}

