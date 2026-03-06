'use client';

import { BlurFade } from '@/components/ui/blur-fade';

export function HowItWorksSection() {
  const steps = [
    {
      step: '01',
      title: 'Submit',
      desc: 'Tenant describes the issue, picks a category and priority. Takes 30 seconds.',
    },
    {
      step: '02',
      title: 'Assign',
      desc: 'Manager reviews incoming tickets and routes them to the right technician.',
    },
    {
      step: '03',
      title: 'Resolve',
      desc: 'Technician completes the work. Manager approves and closes the ticket.',
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-24 md:py-32 border-y border-border/50 bg-muted/30"
      aria-label="How it works"
    >
      <div className="mx-auto max-w-6xl px-6">
        <BlurFade>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-500 mb-3 text-center">
            How It Works
          </p>
          <h2 className="text-center text-3xl md:text-[2.75rem] font-extrabold tracking-[-0.03em] text-foreground font-display">
            Three steps. Zero complexity.
          </h2>
        </BlurFade>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {steps.map(({ step, title, desc }, i) => (
            <BlurFade
              key={step}
              delay={i * 0.1}
              direction={i === 0 ? 'left' : i === 2 ? 'right' : 'up'}
            >
              <div className="relative group">
                {i < 2 && (
                  <div
                    className="hidden md:block absolute top-7 left-full w-full h-px z-0 overflow-hidden"
                    aria-hidden="true"
                  >
                    <div className="h-full animated-dash" />
                  </div>
                )}

                {i < 2 && (
                  <div
                    className="md:hidden absolute -bottom-6 left-6 w-px h-6 z-0"
                    aria-hidden="true"
                  >
                    <div className="w-full h-full border-l border-dashed border-border" />
                  </div>
                )}

                <div className="relative rounded-2xl border border-border/50 bg-card/50 p-7 transition-all duration-500 hover:bg-card/80 hover:border-primary-500/15 hover:shadow-lg hover:shadow-primary-500/[0.04]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white text-sm font-bold shadow-lg shadow-primary-600/20 mb-5">
                    {step}
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
