import Eyebrow from '@/components/base/Eyebrow';

export default function AccessibilityContent() {
  return (
    <section className="container-wide py-20 md:py-28">
      <Eyebrow tone="maroon">Accessibility</Eyebrow>
      <h1 className="mt-6 max-w-3xl font-heading text-[clamp(2.2rem,4vw,3.6rem)] font-semibold leading-[1.04]">
        Accessibility statement.
      </h1>
      <div className="reading-width mt-8 space-y-5 text-[15px] leading-relaxed text-foreground-700">
        <p>
          We aim to make the College of Marketing website clear, readable and usable across desktop
          and mobile devices.
        </p>
        <p>
          The interface uses semantic headings, keyboard-accessible controls, visible labels and
          reduced-motion support where animation is present.
        </p>
        <p>
          If any page or form is difficult to use, contact Kent Business College so we can provide
          the information in another format and improve the website.
        </p>
      </div>
    </section>
  );
}

