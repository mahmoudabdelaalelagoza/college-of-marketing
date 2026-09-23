import Button from '@/components/base/Button';
import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import HeroPattern from '@/components/feature/HeroPattern';
import PageShell from '@/components/feature/PageShell';
import { secondaryNav } from '@/lib/nav';

const values = [
  {
    icon: 'ri-focus-3-line',
    title: 'Commercial rigour',
    copy: 'We teach marketing as a driver of business performance, not a set of isolated tactics.',
  },
  {
    icon: 'ri-briefcase-line',
    title: 'Applied learning',
    copy: 'Everything connects to real responsibilities and produces outputs the workplace can use.',
  },
  {
    icon: 'ri-shield-check-line',
    title: 'Responsible practice',
    copy: 'Data, ethics and AI are embedded in everyday decisions, never treated as an afterthought.',
  },
  {
    icon: 'ri-user-heart-line',
    title: 'Learner success',
    copy: 'We meet learners where they are and build confidence alongside capability.',
  },
];

const leadership = [
  {
    name: 'Dr. Eleanor Hart',
    role: 'Dean, College of Marketing',
    copy: "Leads the college's academic direction and the CIM-aligned pathway.",
    image:
      'https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20a%20confident%20British%20female%20academic%20in%20her%20fifties%2C%20editorial%20premium%20business%20photography%2C%20soft%20natural%20light%2C%20muted%20maroon%20and%20cream%20background%2C%20warm%20approachable%20expression&width=600&height=700&seq=kbc-team-hart-01&orientation=portrait',
  },
  {
    name: 'Marcus Reid',
    role: 'Director of Employer Partnerships',
    copy: 'Works with organisations to shape workforce capability and funding.',
    image:
      'https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20a%20friendly%20British%20male%20business%20leader%20in%20his%20forties%2C%20editorial%20premium%20business%20photography%2C%20soft%20natural%20light%2C%20muted%20warm%20neutral%20background%2C%20approachable%20expression&width=600&height=700&seq=kbc-team-reid-01&orientation=portrait',
  },
  {
    name: 'Priya Shah',
    role: 'Head of Learning & Delivery',
    copy: 'Leads the coaching and workplace application that makes learning stick.',
    image:
      'https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20a%20confident%20British%20female%20learning%20leader%20in%20her%20forties%2C%20editorial%20premium%20business%20photography%2C%20soft%20natural%20light%2C%20muted%20warm%20neutral%20background%2C%20warm%20expression&width=600&height=700&seq=kbc-team-shah-01&orientation=portrait',
  },
];

const stats = [
  { value: '2', label: 'Funded pathways' },
  { value: 'CIM', label: 'Professional alignment' },
  { value: '100%', label: 'Workplace applied' },
  { value: 'Kent', label: 'Rooted in the region' },
];

export default function About() {
  return (
    <PageShell navItems={secondaryNav}>
      {/* Hero */}
      <section className="container-wide pt-8 md:pt-10">
        <div className="hero-maroon-gradient warm-glow relative overflow-hidden rounded-[18px] px-6 py-14 text-background-50 md:px-14 md:py-20">
          <HeroPattern />
          <div className="relative z-10 grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <Reveal>
                <Eyebrow tone="gold">Who we are</Eyebrow>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="mt-6 font-heading text-[clamp(2.4rem,4.5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-background-50">
                  A specialist college for modern marketing.
                </h1>
              </Reveal>
              <Reveal delay={160}>
                <p className="reading-width mt-6 text-[17px] leading-relaxed text-background-50/75">
                  Kent Business College's College of Marketing connects professional theory with the
                  real responsibilities of working marketers — building confident, commercially
                  minded professionals.
                </p>
              </Reveal>
            </div>
            <div className="lg:col-span-5">
              <Reveal delay={200}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-[16px] border border-background-50/12">
                  <img
                    src="https://readdy.ai/api/search-image?query=Modern%20college%20building%20entrance%20with%20warm%20stone%20and%20glass%2C%20students%20and%20professionals%20walking%20in%2C%20editorial%20premium%20business%20photography%2C%20soft%20natural%20light%2C%20muted%20warm%20neutral%20tones&width=900&height=680&seq=kbc-about-campus-01&orientation=landscape"
                    alt="Kent Business College campus"
                    title="Kent Business College — College of Marketing"
                    className="h-full w-full object-top"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="container-wide py-12 md:py-16">
        <Reveal>
          <div className="grid grid-cols-2 gap-8 rounded-[16px] border border-background-300 bg-background-50 p-8 md:grid-cols-4 md:p-10">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-heading text-3xl font-semibold text-primary-800 md:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-foreground-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Mission */}
      <section className="container-wide py-8 md:py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow tone="maroon">Our purpose</Eyebrow>
              <h2 className="mt-6 font-heading text-[clamp(2rem,3.2vw,3rem)] font-semibold leading-[1.04] tracking-[-0.02em]">
                Marketing, understood as a commercial discipline.
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <Reveal delay={100}>
              <div className="space-y-5 text-[16px] leading-relaxed text-foreground-700">
                <p>
                  Too much marketing education is abstract, isolated from the pressures of running a
                  business. We believe marketers become valuable when they can connect what they do —
                  the insight, the campaigns, the content — to customer value and measurable results.
                </p>
                <p>
                  Every programme is built around that idea. Learning is applied to live work,
                  evidence is gathered from real responsibilities, and progression is measured by
                  the capability a marketer can actually show in the business.
                </p>
                <p>
                  We're rooted in Kent but work with employers and learners across the United
                  Kingdom, with a professional pathway aligned to the Chartered Institute of
                  Marketing.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-y border-background-300 bg-background-100 py-20 md:py-28">
        <div className="container-wide">
          <Reveal>
            <Eyebrow tone="maroon">What we stand for</Eyebrow>
            <h2 className="mt-6 max-w-2xl font-heading text-[clamp(2rem,3.2vw,3rem)] font-semibold leading-[1.04] tracking-[-0.02em]">
              Values that shape every programme.
            </h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <Reveal key={value.title} delay={index * 70}>
                <div>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-100 text-secondary-800">
                    <i className={`${value.icon} text-xl`} />
                  </span>
                  <h3 className="mt-5 font-heading text-lg font-semibold leading-tight">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-foreground-600">{value.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
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
                <div className="relative aspect-[6/7] overflow-hidden rounded-[14px] border border-background-300">
                  <img
                    src={person.image}
                    alt={person.name}
                    title={`${person.name} — ${person.role}`}
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

      {/* CTA */}
      <section className="container-wide pb-20 md:pb-28">
        <div className="hero-maroon-gradient warm-glow relative overflow-hidden rounded-[18px] px-6 py-14 text-background-50 md:px-14 md:py-16">
          <HeroPattern variant="compact" />
          <div className="relative z-10 flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Eyebrow tone="gold">Come and meet us</Eyebrow>
              <h2 className="mt-5 max-w-xl font-heading text-[clamp(1.8rem,3vw,2.6rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-background-50">
                See how we build marketing capability.
              </h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button to="/events" variant="gold" arrow>
                View events
              </Button>
              <Button to="/employers" variant="outlineLight">
                Work with us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}