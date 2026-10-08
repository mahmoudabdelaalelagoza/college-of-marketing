import type { ProgrammeConfig } from './types';

export const level6: ProgrammeConfig = {
  level: 'Level 6',
  shortTitle: 'Marketing Manager',
  path: '/college-of-marketing/marketing-manager-level-6',
  panelClass: 'panel-level6',
  hero: {
    eyebrow: 'Marketing Manager · Level 6',
    title: 'Move from campaign delivery to',
    highlight: 'strategic marketing leadership.',
    copy: 'A funded apprenticeship for experienced marketers leading strategy, budgets, teams and agencies. Develop commercial intelligence, brand and customer value leadership, performance management and responsible AI - and prove marketing\u2019s contribution to business outcomes.',
    image: null,
    seed: 'kbc-level6-hero-01',
    imageAlt: 'Marketing Manager presenting strategy to their team at Kent Business College',
    facts: [
      { label: 'Duration', value: 'Around 24 months' },
      { label: 'Qualification', value: 'CIM Level 6 Diploma' },
      { label: 'Delivery', value: 'Leadership applied, blended' },
    ],
  },
  keyFacts: [
    { icon: 'ri-time-line', label: 'Duration', value: 'Around 24 months, including a structured end-point assessment.' },
    { icon: 'ri-award-line', label: 'Professional body', value: 'Aligned to the CIM Level 6 Diploma in Professional Marketing.' },
    { icon: 'ri-user-star-line', label: 'Who it is for', value: 'Experienced marketers responsible for strategy, budgets, teams or a function.' },
    { icon: 'ri-briefcase-line', label: 'Apprenticeship', value: 'Marketing Manager / Senior Leader standard, applied to real leadership.' },
  ],
  overview: {
    eyebrow: 'About the programme',
    heading: 'Strategic marketing leadership with commercial discipline.',
    body: 'Level 6 develops the judgement to set direction, allocate resource and lead people toward measurable outcomes. You will learn to connect marketing decisions to commercial performance, build customer and brand value, and influence the wider business with confidence.',
    bullets: [
      'Set strategy and allocate budget with a clear commercial rationale',
      'Lead brand, customer value and integrated marketing across channels',
      'Manage teams, agencies and stakeholders to deliver results',
      'Use data and responsible AI to evidence and improve performance',
    ],
  },
  curriculum: {
    eyebrow: 'What you will learn',
    heading: 'Six modules that build strategic and commercial leadership.',
    intro: 'Each module develops a layer of leadership judgement, applied to your real strategy, budget and team responsibilities.',
    modules: [
      {
        number: '01',
        title: 'Strategic marketing and commercial intelligence',
        copy: 'Connect market, customer and competitor insight to strategy, positioning and the commercial contribution of marketing.',
        topics: ['Market analysis', 'Commercial literacy', 'Positioning', 'Strategy'],
      },
      {
        number: '02',
        title: 'Brand and customer value leadership',
        copy: 'Build brand equity and customer value over time, aligning proposition, promise and experience across the journey.',
        topics: ['Brand strategy', 'Customer value', 'Experience', 'Loyalty'],
      },
      {
        number: '03',
        title: 'Integrated marketing leadership',
        copy: 'Lead campaigns and programmes across channels, orchestrating owned, earned and paid media toward shared objectives.',
        topics: ['Integrated campaigns', 'Channel orchestration', 'Agencies', 'Innovation'],
      },
      {
        number: '04',
        title: 'Budgeting, performance and ROI',
        copy: 'Plan and manage budgets, define performance measures and demonstrate return on marketing investment.',
        topics: ['Budgeting', 'Measurement', 'Forecasting', 'ROI'],
      },
      {
        number: '05',
        title: 'Responsible AI and data governance',
        copy: 'Lead data and AI practice responsibly, balancing opportunity with ethics, compliance and reputation.',
        topics: ['Data governance', 'Responsible AI', 'Ethics', 'Compliance'],
      },
      {
        number: '06',
        title: 'Leadership, influence and change',
        copy: 'Influence stakeholders, lead teams through change and build the capability of the marketing function.',
        topics: ['Stakeholder influence', 'Team leadership', 'Change', 'Capability building'],
      },
    ],
  },
  capabilities: {
    eyebrow: 'Capability development',
    heading: 'The judgement behind strategic decisions.',
    intro: 'Level 6 capability is developed around leadership, commercial intelligence and responsible practice rather than isolated tactics.',
    items: [
      {
        number: '01',
        title: 'Strategy and commercial leadership',
        headline: 'Connect marketing decisions to commercial outcomes.',
        copy: 'Set direction, allocate resource and lead with a clear commercial rationale behind every marketing choice.',
        subs: ['Market analysis', 'Planning and budgeting', 'Commercial literacy', 'Strategic thinking'],
      },
      {
        number: '02',
        title: 'Brand and customer value',
        headline: 'Build equity and value over time.',
        copy: 'Lead brand and customer value with clarity, aligning proposition, promise and experience across the journey.',
        subs: ['Brand strategy', 'Customer value', 'Experience design', 'Loyalty'],
      },
      {
        number: '03',
        title: 'Performance and ROI',
        headline: 'Evidence marketing\u2019s contribution.',
        copy: 'Define measures, manage budgets and demonstrate return on marketing investment to the wider business.',
        subs: ['Measurement frameworks', 'Budgeting', 'Forecasting', 'ROI'],
      },
      {
        number: '04',
        title: 'Responsible AI and data',
        headline: 'Lead data and AI with integrity.',
        copy: 'Govern data and AI practice responsibly, balancing opportunity with ethics, compliance and reputation.',
        subs: ['Data governance', 'Responsible AI', 'Ethics', 'Compliance'],
      },
    ],
  },
  outputs: {
    eyebrow: 'Workplace outputs',
    heading: 'Evidence of strategic leadership.',
    intro: 'You produce outputs that shape real strategy and demonstrate marketing\u2019s commercial contribution, forming part of your assessment evidence.',
    items: [
      { icon: 'ri-route-line', title: 'Marketing strategy', copy: 'A strategic plan with clear objectives, positioning, resource and measures.' },
      { icon: 'ri-funds-line', title: 'Budget and ROI case', copy: 'A budget plan and a case for investment linked to commercial outcomes.' },
      { icon: 'ri-git-branch-line', title: 'Integrated campaign plan', copy: 'A coordinated plan orchestrating channels, agencies and media toward shared objectives.' },
      { icon: 'ri-team-line', title: 'Team and agency plan', copy: 'A plan for structuring and developing the team and agency relationships.' },
      { icon: 'ri-dashboard-line', title: 'Performance dashboard', copy: 'A measurement framework and dashboard that evidences marketing\u2019s impact.' },
      { icon: 'ri-scales-3-line', title: 'Responsible AI review', copy: 'A review of data and AI practice with ethical, compliance and reputation considerations.' },
    ],
  },
  pathway: {
    eyebrow: 'Professional pathway',
    heading: 'A recognised route to chartered status.',
    intro: 'Level 6 aligns to the CIM Level 6 Diploma, building toward chartered marketer status and senior marketing leadership.',
    steps: [
      {
        stage: 'Stage 1',
        title: 'Marketing Executive - Level 4',
        copy: 'Build professional and digital marketing foundations. Aligned to the CIM Level 4 Certificate.',
      },
      {
        stage: 'Stage 2',
        title: 'Marketing Manager - Level 6',
        copy: 'Develop strategic marketing leadership, aligned to the CIM Level 6 Diploma.',
        current: true,
      },
      {
        stage: 'Stage 3',
        title: 'Chartered and senior leadership',
        copy: 'Progress toward chartered marketer status and senior marketing leadership roles.',
      },
    ],
  },
  funding: {
    eyebrow: 'Funding',
    heading: 'Strategic development funded through the apprenticeship system.',
    body: 'As a higher apprenticeship, the Level 6 programme may be funded through your organisation\u2019s apprenticeship account. We confirm the current funding and eligibility position for your organisation during consultation.',
    facts: [
      { label: 'Levy funded', value: 'Employers with an apprenticeship service account can use levy funds to cover training and assessment.' },
      { label: 'Co-investment', value: 'Some employers co-invest a proportion of the cost, with support depending on size and learner age.' },
      { label: 'Eligibility', value: 'Learners typically need to be employed in a relevant leadership role and meet residency and prior attainment requirements.' },
    ],
  },
  faq: {
    eyebrow: 'FAQ',
    heading: 'Level 6, answered clearly.',
    intro: 'Common questions about the Marketing Manager Level 6 programme.',
    items: [
      {
        question: 'Who is the Level 6 programme designed for?',
        answer:
          'It suits experienced marketers responsible for strategy, budgets, teams, agencies, brand or customer value, who want to build strategic and commercial leadership.',
      },
      {
        question: 'How long does it take?',
        answer:
          'Around 24 months, including a structured end-point assessment. It is designed to fit alongside a senior marketing role.',
      },
      {
        question: 'What professional qualification does it lead to?',
        answer:
          'The programme aligns to the CIM Level 6 Diploma in Professional Marketing, supporting progression toward chartered marketer status.',
      },
      {
        question: 'How is learning applied to my role?',
        answer:
          'Each module applies to your real strategy, budget and team responsibilities, producing outputs such as a marketing strategy, budget case and performance dashboard.',
      },
      {
        question: 'Can apprenticeship funding cover the cost?',
        answer:
          'Yes, training and assessment may be funded through the apprenticeship system. We confirm eligibility and the funding position during consultation.',
      },
      {
        question: 'Do I need to have completed Level 4 first?',
        answer:
          'Not necessarily. If you already hold the relevant experience and responsibility, you may start at Level 6. We help assess the best entry point.',
      },
    ],
  },
  cta: {
    heading: 'Ready to lead marketing strategically?',
    body: 'Tell us about your role and leadership responsibilities and we will help you confirm the best entry point, understand funding and plan your next step.',
    bullets: [
      'Clarity on whether Level 6 is the right fit',
      'Guidance on apprenticeship funding and eligibility',
      'A clear view of the next steps to start',
    ],
    formId: 'level6-programme-enquiry',
   submitLabel: 'Submit enquiry',
    successMessage: 'Thank you. We have received your enquiry and will be in touch about the Level 6 programme.',
  },
  related: {
    label: 'Earlier stage',
    title: 'Marketing Executive - Level 4',
    copy: 'Building professional foundations first? Explore the Level 4 programme for marketing delivery.',
    to: '/college-of-marketing/marketing-executive-level-4',
  },
};

