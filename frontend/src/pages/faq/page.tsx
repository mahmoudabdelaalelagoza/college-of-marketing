import SiteFooter from '@/components/feature/SiteFooter';
import SiteHeader from '@/components/feature/SiteHeader';
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
    <div className="min-h-screen bg-background-100">
      <SiteHeader />
      <main id="main-content">
        <FAQHero />
        <FAQGroups />
        <FAQCTA />
      </main>
      <SiteFooter />
    </div>
  );
}
