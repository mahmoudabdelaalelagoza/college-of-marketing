import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';

const testimonials = [
  {
    quote:
      'The programme gave me a way of thinking, not just a set of tactics. I can now explain the commercial reasoning behind a campaign and get decisions agreed far more quickly.',
    name: 'Amelia Hart',
    role: 'Marketing Executive — Level 4',
    image:
      'https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20a%20confident%20British%20female%20marketing%20professional%20in%20her%20late%20twenties%2C%20natural%20window%20light%2C%20neutral%20studio%20background%2C%20editorial%20business%20photography%2C%20warm%20muted%20tones&width=320&height=320&seq=kbc-testimonial-amelia-01&orientation=squarish',
  },
  {
    quote:
      'I moved from delivering campaigns to setting the direction for a team. The strategy, budgeting and leadership content mapped straight onto the decisions I was already facing.',
    name: 'Daniel Okafor',
    role: 'Marketing Manager — Level 6',
    image:
      'https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20a%20confident%20British%20male%20marketing%20manager%20in%20his%20thirties%2C%20natural%20window%20light%2C%20neutral%20studio%20background%2C%20editorial%20business%20photography%2C%20warm%20muted%20tones&width=320&height=320&seq=kbc-testimonial-daniel-01&orientation=squarish',
  },
  {
    quote:
      'The outputs our team produced were genuinely useful. Learning sat alongside delivery, so the capability stayed in the business rather than in a folder.',
    name: 'Priya Nair',
    role: 'Head of Marketing, employer partner',
    image:
      'https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20a%20confident%20British%20female%20head%20of%20marketing%20in%20her%20forties%2C%20natural%20window%20light%2C%20neutral%20studio%20background%2C%20editorial%20business%20photography%2C%20warm%20muted%20tones&width=320&height=320&seq=kbc-testimonial-priya-01&orientation=squarish',
  },
];

export default function Testimonials() {
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
                  <span className="h-11 w-11 overflow-hidden rounded-full">
                    <img
                      src={item.image}
                      alt={`${item.name}, ${item.role}`}
                      title={`${item.name} — ${item.role}`}
                      className="h-full w-full object-top"
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