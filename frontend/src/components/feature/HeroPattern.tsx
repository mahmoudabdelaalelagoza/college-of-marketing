/**
 * Decorative, non-interactive line-art pattern used across the site on dark
 * (maroon / level-panel) surfaces.
 *
 * variant="full"    -> rich hero treatment (all rings, motifs, networks, dots)
 * variant="compact" -> lighter treatment for CTA strips and short dark sections
 *
 * Layers: soft grid, gold dot field, orbiting rings, floating motifs
 * (graduation cap, charts, bank, networks of nodes), connecting lines
 * and a slow light sheen. All animation respects prefers-reduced-motion.
 */
interface HeroPatternProps {
  variant?: 'full' | 'compact';
}

export default function HeroPattern({ variant = 'full' }: HeroPatternProps) {
  const full = variant === 'full';

  return (
    <div aria-hidden="true" className="hero-pattern hero-sheen">
      <div className="hero-grid" />
      <div className="hero-dots" />

      <span className="hero-ring hero-ring-lg" />
      {full && <span className="hero-ring hero-ring-md" />}
      {full && <span className="hero-ring hero-ring-sm" />}
      {full && <span className="hero-ring hero-ring-xs" />}

      {full && (
        <>
          <span className="hero-line absolute left-[8%] top-[30%] w-[22%] rotate-[24deg]" />
          <span className="hero-line absolute right-[10%] top-[36%] w-[20%] -rotate-[18deg]" />
          <span className="hero-line absolute left-[40%] bottom-[22%] w-[18%] rotate-[-10deg]" />
        </>
      )}

      <span className="hero-float-a absolute left-[43%] top-[9%] hidden h-20 w-20 items-center justify-center rounded-full border border-background-50/10 md:flex">
        <i className="ri-graduation-cap-line text-3xl text-accent-500/30" />
      </span>

      <span className="hero-float-b absolute right-[5%] top-[11%] hidden h-16 w-16 items-center justify-center rounded-full border border-background-50/8 lg:flex">
        <i className="ri-bar-chart-2-line text-2xl text-accent-500/26" />
      </span>

      {full && (
        <>
          <span className="hero-float-c absolute right-[1%] top-[40%] hidden h-14 w-14 items-center justify-center rounded-full border border-background-50/8 xl:flex">
            <i className="ri-donut-chart-line text-xl text-accent-500/24" />
          </span>

          <span className="hero-float-a absolute bottom-[8%] right-[42%] hidden text-2xl text-accent-500/22 xl:block">
            <i className="ri-arrow-right-up-line" />
          </span>

          <span className="hero-float-c absolute left-[16%] top-[14%] hidden text-xl text-accent-500/22 xl:block">
            <i className="ri-pie-chart-line" />
          </span>

          <span className="hero-float-b absolute right-[9%] bottom-[22%] hidden text-xl text-accent-500/20 xl:block">
            <i className="ri-line-chart-line" />
          </span>

          <span className="hero-float-a absolute bottom-[30%] left-[30%] hidden text-lg text-accent-500/18 xl:block">
            <i className="ri-focus-3-line" />
          </span>

          <span className="hero-float-c absolute left-[62%] top-[8%] hidden text-lg text-accent-500/20 xl:block">
            <i className="ri-share-line" />
          </span>
        </>
      )}

      <span className="hero-float-b absolute bottom-[9%] left-[3%] hidden h-16 w-16 items-center justify-center rounded-full border border-background-50/8 lg:flex">
        <i className="ri-bank-line text-2xl text-accent-500/24" />
      </span>

      <div className="hero-network left-[2%] top-[40%] hidden lg:block">
        <span className="l l1" />
        <span className="l l2" />
        <span className="l l3" />
        <span className="l l4" />
        <span className="n n1" />
        <span className="n n2" />
        <span className="n n3" />
        <span className="n n4" />
      </div>

      {full && (
        <div className="hero-network bottom-[14%] right-[3%] hidden scale-x-[-1] lg:block">
          <span className="l l1" />
          <span className="l l2" />
          <span className="l l3" />
          <span className="l l4" />
          <span className="n n1" />
          <span className="n n2" />
          <span className="n n3" />
          <span className="n n4" />
        </div>
      )}

      <span className="hero-dot-pulse absolute left-[18%] top-[26%] h-1.5 w-1.5 rounded-full bg-accent-500/60" />
      <span className="hero-dot-pulse absolute left-[64%] top-[17%] h-1 w-1 rounded-full bg-accent-500/50" />
      <span className="hero-dot-pulse absolute bottom-[16%] right-[22%] h-1.5 w-1.5 rounded-full bg-accent-500/60" />

      {full && (
        <>
          <span className="hero-dot-pulse absolute bottom-[12%] left-[30%] h-1 w-1 rounded-full bg-accent-500/50" />
          <span className="hero-dot-pulse absolute left-[8%] top-[62%] h-1 w-1 rounded-full bg-accent-500/50" />
          <span className="hero-dot-pulse absolute right-[30%] top-[30%] h-1.5 w-1.5 rounded-full bg-accent-500/55" />
          <span className="hero-dot-pulse absolute bottom-[34%] left-[52%] h-1 w-1 rounded-full bg-accent-500/45" />
        </>
      )}
    </div>
  );
}
