export interface HeroFact {
  label: string;
  value: string;
}

export interface KeyFact {
  icon: string;
  label: string;
  value: string;
}

export interface CurriculumModule {
  number: string;
  title: string;
  copy: string;
  topics: string[];
}

export interface Capability {
  number: string;
  title: string;
  headline: string;
  copy: string;
  subs: string[];
}

export interface Output {
  icon: string;
  title: string;
  copy: string;
}

export interface PathwayStep {
  stage: string;
  title: string;
  copy: string;
  current?: boolean;
}

export interface FundingFact {
  label: string;
  value: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ProgrammeConfig {
  level: string;
  shortTitle: string;
  /** Absolute site path, used for canonical URLs. */
  path: string;
  panelClass: string;
  hero: {
    eyebrow: string;
    title: string;
    highlight: string;
    copy: string;
    image: string | null;
    seed: string;
    imageAlt: string;
    facts: HeroFact[];
  };
  keyFacts: KeyFact[];
  overview: {
    eyebrow: string;
    heading: string;
    body: string;
    bullets: string[];
  };
  curriculum: {
    eyebrow: string;
    heading: string;
    intro: string;
    modules: CurriculumModule[];
  };
  capabilities: {
    eyebrow: string;
    heading: string;
    intro: string;
    items: Capability[];
  };
  outputs: {
    eyebrow: string;
    heading: string;
    intro: string;
    items: Output[];
  };
  pathway: {
    eyebrow: string;
    heading: string;
    intro: string;
    steps: PathwayStep[];
  };
  funding: {
    eyebrow: string;
    heading: string;
    body: string;
    facts: FundingFact[];
  };
  faq: {
    eyebrow: string;
    heading: string;
    intro: string;
    items: FaqItem[];
  };
  cta: {
    heading: string;
    body: string;
    bullets: string[];
    formId: string;
    submitLabel: string;
    successMessage: string;
  };
  related: {
    label: string;
    title: string;
    copy: string;
    to: string;
  };
}
