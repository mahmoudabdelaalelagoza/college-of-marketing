import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import { usePublicContent } from '@/lib/publicContent';
import EditorialImage from '@/components/feature/EditorialImage';

interface PersonRow {
  name: string;
  role_title: string | null;
  affiliation: string | null;
  biography: string | null;
  image_url: string | null;
  initials: string | null;
}

/**
 * Leadership profiles.
 *
 * No fallback roster is bundled with the code. The earlier version shipped
 * invented people ("Dr. Eleanor Hart" and similar) as though they were real
 * college staff, which is not acceptable on a live site.
 *
 * The section therefore renders only profiles that exist in the CMS, and only
 * where the editor has supplied a real name. It hides itself when there is
 * nothing genuine to show, rather than implying a team that does not exist.
 * Add verified staff profiles in the dashboard and they appear here.
 */
export default function AboutLeadership() {
  const { items: people } = usePublicContent<PersonRow>('people', []);
  const leadership = people
    .map(mapPerson)
    .filter((person): person is NonNullable<ReturnType<typeof mapPerson>> => person !== null);

  if (leadership.length === 0) return null;

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
                <EditorialImage
                  src={person.image}
                  seed={person.seed}
                  alt={person.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <h3 className="mt-6 font-heading text-xl font-semibold leading-tight">{person.name}</h3>
              {person.role ? <p className="eyebrow mt-1 text-accent-700">{person.role}</p> : null}
              {person.copy ? (
                <p className="mt-3 text-[14px] leading-relaxed text-foreground-600">{person.copy}</p>
              ) : null}
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/**
 * Returns null for rows that are too incomplete to present as a real person, so
 * a half-filled CMS record never becomes a misleading profile card.
 *
 * A name alone is deliberately not enough. The live database contained a row
 * named "mahmoud abdelaal" with no role, no affiliation and no biography, which
 * passed the name-only check and rendered as a leadership card with nothing but
 * a name under the heading "The people behind the college." Requiring a role or
 * a biography hides that stub, and hides any future one, while still publishing
 * a real staff member the moment an editor adds a title or a bio.
 */
function mapPerson(person: PersonRow) {
  const name = (person.name || '').trim();
  if (!name) return null;

  const biography = (person.biography || '').trim();
  const role = (person.role_title || person.affiliation || '').trim();
  if (!role && !biography) return null;

  return {
    name,
    role,
    copy: biography,
    image: person.image_url || null,
    seed: person.initials || name,
  };
}
