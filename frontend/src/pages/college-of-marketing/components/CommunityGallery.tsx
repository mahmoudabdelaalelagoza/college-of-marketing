import Eyebrow from '@/components/base/Eyebrow';
import Reveal from '@/components/base/Reveal';
import EditorialImage from '@/components/feature/EditorialImage';
import { externalImages } from '@/lib/externalImages';

const moments = [
  {
    caption: 'Industry networking evenings',
    ratio: 'aspect-[4/3]',
    image: externalImages.collaborationWorkspace,
    seed: 'kbc-social-networking-01',
  },
  {
    caption: 'The content studio',
    ratio: 'aspect-[3/4]',
    image: externalImages.marketingLaptopPortrait,
    seed: 'kbc-social-content-01',
  },
  {
    caption: 'Hands-on campaign workshops',
    ratio: 'aspect-[4/3]',
    image: externalImages.marketingWorkshopPortrait,
    seed: 'kbc-social-workshop-01',
  },
  {
    caption: 'Celebrating achievement',
    ratio: 'aspect-[3/4]',
    image: externalImages.teamPresentationWide,
    seed: 'kbc-social-event-01',
  },
  {
    caption: 'A community that spreads ideas',
    ratio: 'aspect-[4/3]',
    image: externalImages.meetingPresentationPortrait,
    seed: 'kbc-social-community-01',
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
                  <EditorialImage
                    src={item.image}
                    seed={item.seed}
                    alt={item.caption}
                    className="h-full w-full object-cover"
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
