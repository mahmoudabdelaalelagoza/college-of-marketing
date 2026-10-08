import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import { usePublicContent } from '@/lib/publicContent';
import EditorialImage from '@/components/feature/EditorialImage';

interface TestimonialCard {
  quote: string;
  name: string;
  role: string;
  image: string | null;
  seed: string;
}

interface TestimonialRow {
  name: string;
  programme: string | null;
  reviewer_type: string | null;
  photo_url: string | null;
  review_text: string;
}

/**
 * Learner and employer testimonials.
 *
 * This section deliberately has no built-in fallback content. The public API
 * only returns testimonials that an editor has marked approved *and* recorded
 * consent for, so anything shown here is content the college has actually
 * approved and is entitled to publish.
 *
 * There is therefore nothing to show until real, consented quotes exist. The
 * section is hidden rather than filled with invented names and quotes, which
 * would misrepresent the college and weaken trust in everything else on the
 * page. Once approved testimonials are published in the dashboard the section
 * appears automatically, with no code change.
 */
export default function Testimonials() {
  const { items: cmsTestimonials } = usePublicContent<TestimonialRow>('testimonials', []);
  const testimonials = cmsTestimonials.map(mapTestimonial);

  if (testimonials.length === 0) return null;

  return (
    <section className="border-y border-background-300 bg-background-50 py-20 md:py-28">
      <div className="container-wide">
        <Reveal>
          <Eyebrow tone="muted">In their words</Eyebrow>
          <h2 className="mt-6 max-w-2xl font-heading text-[clamp(2rem,3.2vw,3rem)] font-semibold leading-[1.04] tracking-[-0.02em]">
            Confidence that carries into the workplace.
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <Reveal key={item.name} delay={index * 90}>
              <figure className="flex h-full flex-col justify-between rounded-[14px] border border-background-300 bg-background-100 p-8">
                <i className="ri-double-quotes-l text-3xl text-accent-500" />
                <blockquote className="mt-5 font-heading text-lg leading-snug text-foreground-900">
                  {item.quote}
                </blockquote>
                <figcaption className="mt-7 flex items-center gap-3 border-t border-background-200 pt-6">
                  <span className="h-11 w-11 overflow-hidden rounded-full bg-background-200">
                    <EditorialImage
                      src={item.image}
                      seed={item.seed}
                      alt={`${item.name}, ${item.role}`}
                      className="h-full w-full object-cover"
                    />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-foreground-900">{item.name}</span>
                    <span className="block text-xs text-foreground-500">{item.role}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function mapTestimonial(item: TestimonialRow): TestimonialCard {
  return {
    quote: item.review_text,
    name: item.name,
    role: item.programme || item.reviewer_type || 'College of Marketing',
    image: item.photo_url || null,
    seed: item.name,
  };
}