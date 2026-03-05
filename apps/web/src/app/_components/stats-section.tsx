'use client';

import { BlurFade } from '@/components/ui/blur-fade';
import { NumberTicker } from '@/components/ui/number-ticker';

export function StatsSection() {
  return (
    <BlurFade className="relative z-20 -mt-16 pb-24 md:pb-32" offset={30}>
      <div className="mx-auto max-w-3xl px-6">
        <div className="gradient-border grid grid-cols-3 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl p-6 gap-4 shadow-xl shadow-black/[0.03]">
          {[
            { value: 500, suffix: '+', label: 'Tickets resolved', sub: 'And counting' },
            { value: 98, suffix: '%', label: 'Satisfaction rate', sub: 'Avg. across users' },
            { value: 2, suffix: 'hr', label: 'Avg. response', sub: 'From open to assigned' },
          ].map(({ value, suffix, label, sub }) => (
            <div key={label} className="text-center">
              <div className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground font-display">
                <NumberTicker
                  value={value}
                  className="text-foreground font-extrabold"
                />
                <span>{suffix}</span>
              </div>
              <div className="mt-1 text-xs font-semibold text-foreground/80">{label}</div>
              <div className="text-xs text-muted-foreground">{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </BlurFade>
  );
}
