import PageShell from '@/components/feature/PageShell';
import { secondaryNav } from '@/lib/nav';
import FAQHero from './components/FAQHero';
import FAQGroups from './components/FAQGroups';
import FAQCTA from './components/FAQCTA';
import { useSeo } from '@/lib/seo';

export default function FAQ() {

  useSeo({
    title: 'Frequently Asked Questions',
    description:
      'Answers to common questions from learners, employers and funders about College of Marketing programmes, apprenticeship funding, eligibility and workplace learning.',
    path: '/faq',
  });
  return (
    <PageShell navItems={secondaryNav}>
      <FAQHero />
      <FAQGroups />
      <FAQCTA />
    </PageShell>
  );
}

