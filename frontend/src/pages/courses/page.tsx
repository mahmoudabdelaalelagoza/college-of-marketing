import PageShell from '@/components/feature/PageShell';
import { secondaryNav } from '@/lib/nav';
import CoursesHero from './components/CoursesHero';
import CoursesProgrammes from './components/CoursesProgrammes';
import CoursesModules from './components/CoursesModules';
import CoursesShortCourses from './components/CoursesShortCourses';
import CoursesCTA from './components/CoursesCTA';

export default function Courses() {
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

