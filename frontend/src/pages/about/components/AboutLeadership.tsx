import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import { usePublicContent } from '@/lib/publicContent';
import { leadership as fallbackLeadership } from './data';

interface PersonRow {
  name: string;
  role_title: string | null;
  affiliation: string | null;
  biography: string | null;
  image_url: string | null;
}

export default function AboutLeadership() {
  const { items: people } = usePublicContent<PersonRow>('people', []);
  const leadership = people.length > 0 ? people.map(mapPerson) : fallbackLeadership;

  return (
    <section className="container-wide py-20 md:py-28">
      <Reveal>
        <div className="max-w-2xl">
          <Eyebrow tone="maroon">Leadership</Eyebrow>
          <h2 className="mt-6 font-heading text-[clamp(2rem,3.2vw,3rem)] font-semibold leading-[1.04] tracking-[-0.02em]">
            The people behind the college.
          </h2>
        </div>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
        {leadership.map((person, index) => (
          <Reveal key={person.name} delay={index * 90}>
            <article className="group flex h-full flex-col">
              <div className="relative aspect-[6/7] overflow-hidden rounded-[14px] border border-background-300 bg-background-100">
                <img
                  src={person.image}
                  alt={person.name}
                  title={`${person.name} - ${person.role}`}
                  className="h-full w-full object-top transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <h3 className="mt-6 font-heading text-xl font-semibold leading-tight">{person.name}</h3>
              <p className="eyebrow mt-1 text-accent-700">{person.role}</p>
              <p className="mt-3 text-[14px] leading-relaxed text-foreground-600">{person.copy}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function mapPerson(person: PersonRow) {
  return {
    name: person.name,
    role: person.role_title || person.affiliation || 'College of Marketing',
    copy: person.biography || 'Supports learners, employers and programme delivery at the College of Marketing.',
    image: person.image_url || '/brand/college-of-marketing-logo.png',
  };
}
