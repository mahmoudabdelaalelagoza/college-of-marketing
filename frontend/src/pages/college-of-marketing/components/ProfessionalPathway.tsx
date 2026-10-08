import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import EditorialImage from '@/components/feature/EditorialImage';
import { externalImages } from '@/lib/externalImages';

const steps = [
  {
    tag: 'Entry',
    title: 'Marketing Executive - Level 4',
    copy: 'Build the professional and digital foundations, with a route to the CIM Level 4 Certificate.',
    image: externalImages.marketingLaptopPortrait,
    seed: 'kbc-pathway-l4-01',
  },
  {
    tag: 'Progression',
    title: 'Marketing Manager - Level 6',
    copy: 'Move into strategic leadership, commercial accountability and the CIM Level 6 Diploma pathway.',
    image: externalImages.teamPresentationWide,
    seed: 'kbc-pathway-l6-01',
  },
  {
    tag: 'Continuing',
    title: 'Professional development',
    copy: 'Sustain your practice through CIM membership, continuing professional development and specialisms.',
    image: externalImages.collaborationWorkspace,
    seed: 'kbc-pathway-cpd-01',
  },
];

export default function ProfessionalPathway() {
  return (
    <section
      id="pathway"
      className="scroll-mt-[148px] border-y border-background-300 bg-background-50 py-20 md:py-28"
    >
      <div className="container-wide">
        <Reveal>
          <div className="max-w-3xl">
            <Eyebrow tone="maroon">Professional recognition</Eyebrow>
            <h2 className="mt-6 font-heading text-[clamp(2rem,3.4vw,3.2rem)] font-semibold leading-[1.04] tracking-[-0.02em]">
              A pathway that is recognised across the profession.
            </h2>
            <p className="reading-width mt-5 text-[17px] leading-relaxed text-foreground-600">
              The programmes are designed around apprenticeship standards and aligned to Chartered
              Institute of Marketing qualifications, giving learners a clear, recognised route from
              professional foundations to strategic leadership.
            </p>
          </div>
        </Reveal>

        <div className="relative mt-14">
          <div className="absolute left-[27px] top-4 bottom-4 w-px bg-background-300 md:left-1/2 md:top-[27px] md:h-px md:w-auto md:right-0 md:bottom-auto" />
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
            {steps.map((step, index) => (
              <Reveal key={step.tag} delay={index * 100}>
                <div className="relative flex gap-6 md:flex-col md:gap-0">
                  <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-accent-500/40 bg-background-50 font-heading text-lg text-primary-800">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="md:mt-7 md:pr-6">
                    <span className="eyebrow text-accent-700">{step.tag}</span>
                    <h3 className="mt-3 font-heading text-xl font-semibold leading-tight">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-foreground-600">
                      {step.copy}
                    </p>
                    <div className="mt-5 overflow-hidden rounded-[12px] border border-background-300">
                      <EditorialImage
                        src={step.image}
                        seed={step.seed}
                        alt={step.title}
                        className="h-40 w-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
