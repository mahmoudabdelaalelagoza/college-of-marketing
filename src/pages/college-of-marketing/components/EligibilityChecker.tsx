import { useState } from 'react';
import Button from '@/components/base/Button';
import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';

type Level = 'level4' | 'level6';

interface Option {
  label: string;
  level?: Level;
  both?: boolean;
}

interface Question {
  question: string;
  options: Option[];
}

const questions: Question[] = [
  {
    question: 'Which best describes your current role?',
    options: [
      { label: 'I deliver marketing activity day to day', level: 'level4' },
      { label: 'I manage campaigns, channels or a small team', level: 'level6' },
      { label: 'I lead marketing strategy, budgets or a function', level: 'level6' },
      { label: 'I am new to marketing or moving into it', level: 'level4' },
    ],
  },
  {
    question: 'How much marketing experience do you have?',
    options: [
      { label: 'Less than 1 year', level: 'level4' },
      { label: '1 to 3 years', level: 'level4' },
      { label: '3 to 5 years', level: 'level6' },
      { label: 'More than 5 years', level: 'level6' },
    ],
  },
  {
    question: 'What do you most want to develop?',
    options: [
      { label: 'Practical delivery, digital and content foundations', level: 'level4' },
      { label: 'Strategy, commercial thinking and leadership', level: 'level6' },
      { label: 'Not sure yet — I would like guidance', both: true },
    ],
  },
];

const resultCopy: Record<'level4' | 'level6' | 'both', { title: string; body: string }> = {
  level4: {
    title: 'Marketing Executive — Level 4',
    body: 'This pathway builds professional and digital marketing foundations, ideal if you plan and deliver activity and want a stronger framework for decisions and performance.',
  },
  level6: {
    title: 'Marketing Manager — Level 6',
    body: 'This pathway is designed for experienced marketers moving into strategic leadership, with responsibility for strategy, budgets, teams and commercial outcomes.',
  },
  both: {
    title: 'We suggest exploring both pathways',
    body: 'Based on your answers, either route could work depending on your role and ambition. A short conversation will help us recommend the best fit.',
  },
};

export default function EligibilityChecker() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(Option | null)[]>([null, null, null]);
  const [done, setDone] = useState(false);

  const select = (option: Option) => {
    const next = [...answers];
    next[step] = option;
    setAnswers(next);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setDone(true);
    }
  };

  const reset = () => {
    setAnswers([null, null, null]);
    setStep(0);
    setDone(false);
  };

  const computeResult = (): 'level4' | 'level6' | 'both' => {
    if (answers.some((a) => a?.both)) return 'both';
    let l4 = 0;
    let l6 = 0;
    answers.forEach((a) => {
      if (a?.level === 'level4') l4 += 1;
      if (a?.level === 'level6') l6 += 1;
    });
    if (l4 > 0 && l6 > 0) return 'both';
    return l6 > l4 ? 'level6' : 'level4';
  };

  const result = done ? computeResult() : null;

  return (
    <section id="eligibility" className="container-wide scroll-mt-[148px] py-20 md:py-28">
      <Reveal>
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow tone="maroon" className="justify-center">
            Eligibility checker
          </Eyebrow>
          <h2 className="mt-6 font-heading text-[clamp(2rem,3.2vw,3rem)] font-semibold leading-[1.04] tracking-[-0.02em]">
            Which pathway may suit you?
          </h2>
          <p className="mt-5 text-[16px] leading-relaxed text-foreground-600">
            Answer three quick questions for an indicative recommendation. It takes under a minute.
          </p>
        </div>
      </Reveal>

      <Reveal delay={120}>
        <div className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-[16px] border border-background-300 bg-background-50">
          {!done ? (
            <div className="p-8 md:p-10">
              <div className="flex items-center gap-3">
                {questions.map((_, index) => (
                  <span
                    key={index}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      index <= step ? 'bg-primary-700' : 'bg-background-200'
                    }`}
                  />
                ))}
              </div>
              <p className="eyebrow mt-7 text-foreground-500">
                Question {step + 1} of {questions.length}
              </p>
              <h3 className="mt-3 font-heading text-[clamp(1.4rem,2.4vw,2rem)] font-semibold leading-tight">
                {questions[step].question}
              </h3>

              <div className="mt-7 flex flex-col gap-3">
                {questions[step].options.map((option) => (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => select(option)}
                    className="group flex items-center justify-between gap-4 rounded-[12px] border border-background-300 bg-background-50 px-5 py-4 text-left transition-all duration-200 hover:border-primary-400 hover:bg-background-100"
                  >
                    <span className="text-[15px] font-medium text-foreground-800">{option.label}</span>
                    <i className="ri-arrow-right-line text-primary-700 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                ))}
              </div>

              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground-600 transition-colors hover:text-primary-800"
                >
                  <i className="ri-arrow-left-line" />
                  Back
                </button>
              )}
            </div>
          ) : (
            <div className="p-8 md:p-10">
              <span className="eyebrow text-accent-700">Recommended pathway</span>
              <h3 className="mt-4 font-heading text-[clamp(1.5rem,2.6vw,2.2rem)] font-semibold leading-tight">
                {result ? resultCopy[result].title : ''}
              </h3>
              <p className="reading-width mt-4 text-[15px] leading-relaxed text-foreground-600">
                {result ? resultCopy[result].body : ''}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {result !== 'level6' && (
                  <Button to="/college-of-marketing/marketing-executive-level-4" variant="primary" arrow>
                    Explore Level 4
                  </Button>
                )}
                {result !== 'level4' && (
                  <Button to="/college-of-marketing/marketing-manager-level-6" variant="primary" arrow>
                    Explore Level 6
                  </Button>
                )}
                <Button to="/college-of-marketing#apply" variant="outline">
                  Speak to an adviser
                </Button>
              </div>

              <button
                type="button"
                onClick={reset}
                className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-foreground-600 transition-colors hover:text-primary-800"
              >
                <i className="ri-restart-line" />
                Start again
              </button>
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}