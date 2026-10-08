import { level4 } from '@/pages/programme/level4-data';
import { level6 } from '@/pages/programme/level6-data';
import type { CurriculumModule, ProgrammeConfig } from '@/pages/programme/types';

function programmeMeta(config: ProgrammeConfig) {
  return [
    { label: 'Qualification', value: config.hero.facts.find((fact) => fact.label === 'Qualification')?.value ?? 'CIM aligned' },
    { label: 'Duration', value: config.hero.facts.find((fact) => fact.label === 'Duration')?.value ?? 'Blended' },
    { label: 'Best for', value: config.level === 'Level 4' ? 'Marketers delivering activity' : 'Strategic marketing leaders' },
  ];
}

function enrolPath(programme: ProgrammeConfig, module: CurriculumModule) {
  const params = new URLSearchParams({
    programme: `${programme.shortTitle} - ${programme.level}`,
    course: module.title,
  });

  return `/consultation?${params.toString()}`;
}

function modulesFor(programme: ProgrammeConfig) {
  return programme.curriculum.modules.map((module) => ({
    ...module,
    enrolTo: enrolPath(programme, module),
  }));
}

export const programmes = [
  {
    level: level4.level,
    tag: level4.shortTitle,
    copy: level4.hero.copy,
    meta: programmeMeta(level4),
    to: '/college-of-marketing/marketing-executive-level-4',
    panel: level4.panelClass,
    image: level4.hero.image,
    seed: level4.hero.seed,
  },
  {
    level: level6.level,
    tag: level6.shortTitle,
    copy: level6.hero.copy,
    meta: programmeMeta(level6),
    to: '/college-of-marketing/marketing-manager-level-6',
    panel: level6.panelClass,
    image: level6.hero.image,
    seed: level6.hero.seed,
  },
];

export const programmeCourses = [
  {
    programme: `${level4.shortTitle} - ${level4.level}`,
    eyebrow: 'Level 4 course modules',
    heading: level4.curriculum.heading,
    intro: `${level4.curriculum.intro} If you are not eligible for the full apprenticeship route, each module can be taken as a paid standalone course after consultation.`,
    modules: modulesFor(level4),
  },
  {
    programme: `${level6.shortTitle} - ${level6.level}`,
    eyebrow: 'Level 6 course modules',
    heading: level6.curriculum.heading,
    intro: `${level6.curriculum.intro} If the funded apprenticeship is not available, you can enrol on selected modules as paid professional courses.`,
    modules: modulesFor(level6),
  },
];

export const paidCourseSteps = [
  {
    title: 'Check apprenticeship eligibility first',
    copy: 'If the learner and role qualify, the full programme is usually the strongest route because the modules connect together.',
    icon: 'ri-shield-check-line',
  },
  {
    title: 'Choose standalone modules if needed',
    copy: 'If the full programme is not suitable, we help choose one or more paid modules around the capability gap.',
    icon: 'ri-stack-line',
  },
  {
    title: 'Book a consultation to enrol',
    copy: 'A short consultation confirms level, module choice, pricing route and practical next steps before enrolment.',
    icon: 'ri-calendar-check-line',
  },
];
