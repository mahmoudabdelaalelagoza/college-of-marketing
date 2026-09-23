import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';

const moments = [
  {
    caption: 'Industry networking evenings',
    ratio: 'aspect-[4/3]',
    image:
      'https://readdy.ai/api/search-image?query=Marketing%20professionals%20networking%20and%20sharing%20ideas%20at%20a%20lively%20industry%20meetup%20with%20drinks%20and%20conversation%2C%20editorial%20premium%20business%20photography%2C%20warm%20ambient%20light%2C%20muted%20maroon%20gold%20and%20cream%20tones%2C%20vibrant%20social%20atmosphere&width=900&height=680&seq=kbc-social-networking-01&orientation=landscape',
  },
  {
    caption: 'The content studio',
    ratio: 'aspect-[3/4]',
    image:
      'https://readdy.ai/api/search-image?query=Young%20marketing%20professionals%20creating%20social%20media%20content%20with%20a%20smartphone%20on%20a%20tripod%20and%20ring%20light%20in%20a%20bright%20studio%2C%20editorial%20premium%20business%20photography%2C%20warm%20natural%20light%2C%20muted%20warm%20neutral%20tones%2C%20creative%20playful%20atmosphere&width=680&height=850&seq=kbc-social-content-01&orientation=portrait',
  },
  {
    caption: 'Hands-on campaign workshops',
    ratio: 'aspect-[4/3]',
    image:
      'https://readdy.ai/api/search-image?query=Collaborative%20marketing%20workshop%20with%20a%20diverse%20group%20around%20tables%20covered%20in%20post-it%20notes%20and%20campaign%20posters%2C%20editorial%20premium%20business%20photography%2C%20warm%20natural%20light%2C%20muted%20cream%20and%20maroon%20tones%2C%20energetic%20collaborative%20atmosphere&width=900&height=680&seq=kbc-social-workshop-01&orientation=landscape',
  },
  {
    caption: 'Celebrating achievement',
    ratio: 'aspect-[3/4]',
    image:
      'https://readdy.ai/api/search-image?query=Celebratory%20graduation%20and%20awards%20event%20with%20smiling%20marketing%20graduates%20holding%20certificates%20and%20applauding%2C%20editorial%20premium%20business%20photography%2C%20warm%20ambient%20light%2C%20muted%20gold%20and%20maroon%20tones%2C%20joyful%20proud%20atmosphere&width=680&height=850&seq=kbc-social-event-01&orientation=portrait',
  },
  {
    caption: 'A community that spreads ideas',
    ratio: 'aspect-[4/3]',
    image:
      'https://readdy.ai/api/search-image?query=Marketing%20community%20gathering%20in%20a%20bright%20atrium%20with%20people%20in%20small%20groups%20chatting%20and%20exchanging%20business%20cards%2C%20editorial%20premium%20business%20photography%2C%20warm%20natural%20light%2C%20muted%20warm%20neutral%20tones%2C%20welcoming%20community%20atmosphere&width=900&height=680&seq=kbc-social-community-01&orientation=landscape',
  },
];

export default function CommunityGallery() {
  return (
    <section
      id="community"
      className="scroll-mt-[148px] border-y border-background-300 bg-background-50 py-20 md:py-28"
    >
      <div className="container-wide">
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow tone="maroon">Community &amp; social life</Eyebrow>
              <h2 className="mt-6 max-w-2xl font-heading text-[clamp(2rem,3.4vw,3.2rem)] font-semibold leading-[1.04] tracking-[-0.02em]">
                Marketing is social. So is the way we learn.
              </h2>
            </div>
            <p className="max-w-sm text-[15px] leading-relaxed text-foreground-600">
              Networking, live briefs, content studios and a community of marketers who help each
              other's work reach further.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {moments.map((item, index) => (
            <Reveal key={item.caption} delay={index * 70}>
              <figure className="mb-4 break-inside-avoid">
                <div
                  className={`overflow-hidden rounded-[14px] border border-background-300 ${item.ratio}`}
                >
                  <img
                    src={item.image}
                    alt={item.caption}
                    title={`College of Marketing — ${item.caption}`}
                    className="h-full w-full object-top"
                  />
                </div>
                <figcaption className="mt-3 flex items-center gap-2 text-sm text-foreground-600">
                  <i className="ri-camera-line text-accent-600" />
                  {item.caption}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}