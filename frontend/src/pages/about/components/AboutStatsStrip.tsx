import Reveal from '@/components/base/Reveal';
import { stats } from './data';

export default function AboutStatsStrip() {
  return (
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
  );
}

