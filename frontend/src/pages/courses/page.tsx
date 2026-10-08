import PageShell from '@/components/feature/PageShell';
import { secondaryNav } from '@/lib/nav';
import CoursesHero from './components/CoursesHero';
import CoursesProgrammes from './components/CoursesProgrammes';
import CoursesModules from './components/CoursesModules';
import CoursesShortCourses from './components/CoursesShortCourses';
import CoursesCTA from './components/CoursesCTA';
import { useSeo } from '@/lib/seo';

export default function Courses() {

  useSeo({
    title: 'Courses & Programmes',
    description:
      'Compare the Marketing Executive Level 4 and Marketing Manager Level 6 apprenticeship programmes, browse modules and standalone short courses from the College of Marketing.',
    path: '/courses',
  });
  return (
    <PageShell navItems={secondaryNav}>
      <CoursesHero />
      <CoursesProgrammes />
      <CoursesModules />
      <CoursesShortCourses />
      <CoursesCTA />
    </PageShell>
  );
}

