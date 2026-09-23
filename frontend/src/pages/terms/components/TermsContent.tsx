import Eyebrow from '@/components/base/Eyebrow';

export default function TermsContent() {
  return (
    <section className="container-wide py-20 md:py-28">
      <Eyebrow tone="maroon">Terms</Eyebrow>
      <h1 className="mt-6 max-w-3xl font-heading text-[clamp(2.2rem,4vw,3.6rem)] font-semibold leading-[1.04]">
        Website terms.
      </h1>
      <div className="reading-width mt-8 space-y-5 text-[15px] leading-relaxed text-foreground-700">
        <p>
          The information on this website is provided for general guidance about College of
          Marketing programmes, funding routes and employer support.
        </p>
        <p>
          Programme details, eligibility and funding positions can change. Final confirmation is
          provided during admissions or employer consultation.
        </p>
        <p>
          Content may not be copied or reused commercially without permission from Kent Business
          College.
        </p>
      </div>
    </section>
  );
}

