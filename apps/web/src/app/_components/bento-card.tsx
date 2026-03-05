import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BentoCard({
  icon: Icon,
  title,
  description,
  className = '',
  iconColor = 'text-primary-500 dark:text-primary-400',
  iconBg = 'bg-primary-500/10',
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  iconColor?: string;
  iconBg?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-border/60 bg-card/50 p-6 transition-all duration-500 hover:border-primary-500/20 hover:bg-card/80 hover:shadow-lg hover:shadow-primary-500/[0.04]',
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-primary-500/[0.04] via-transparent to-transparent"
        aria-hidden="true"
      />
      <div className="relative z-10">
        <div className={cn('mb-4 inline-flex rounded-xl p-2.5', iconBg, iconColor)}>
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-base font-semibold text-foreground mb-1.5">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
      {children}
    </div>
  );
}
