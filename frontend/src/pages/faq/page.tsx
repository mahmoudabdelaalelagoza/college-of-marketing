import PageShell from '@/components/feature/PageShell';
import { secondaryNav } from '@/lib/nav';
import FAQHero from './components/FAQHero';
import FAQGroups from './components/FAQGroups';
import FAQCTA from './components/FAQCTA';

export default function FAQ() {
  return (
    <PageShell navItems={secondaryNav}>
      <FAQHero />
      <FAQGroups />
      <FAQCTA />
    </PageShell>
  );
}

