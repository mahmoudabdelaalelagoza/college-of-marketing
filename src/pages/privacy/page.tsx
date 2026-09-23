import PageShell from '@/components/feature/PageShell';
import Eyebrow from '@/components/base/Eyebrow';
import { secondaryNav } from '@/lib/nav';

export default function Privacy() {
  return (
    <PageShell navItems={secondaryNav}>
      <section className="container-wide py-20 md:py-28">
        <Eyebrow tone="maroon">Privacy</Eyebrow>
        <h1 className="mt-6 max-w-3xl font-heading text-[clamp(2.2rem,4vw,3.6rem)] font-semibold leading-[1.04]">
          Privacy notice.
        </h1>
        <div className="reading-width mt-8 space-y-5 text-[15px] leading-relaxed text-foreground-700">
          <p>
            We use information submitted through this website to respond to enquiries, manage
            event interest and support applications to College of Marketing programmes.
          </p>
          <p>
            Enquiry and newsletter forms are stored in our database when configured. We do not
            sell personal data, and we only keep it for as long as needed for admissions,
            employer consultation and related communication.
          </p>
          <p>
            To request access, correction or deletion of your details, contact Kent Business
            College through your normal admissions or employer contact.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
