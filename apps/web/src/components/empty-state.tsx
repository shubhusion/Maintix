import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { EmptyIllustration } from '@/components/empty-illustration';

interface EmptyStateProps {
  illustration?: 'properties' | 'tickets' | 'users' | 'notifications' | 'search' | 'no-data';
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  illustration = 'no-data',
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12', className)}>
      {illustration ? (
        <EmptyIllustration type={illustration} className="mb-6" />
      ) : (
        icon && <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4">{icon}</div>
      )}
      <h3 className="mb-1 text-lg font-medium">{title}</h3>
      {description && <p className="text-sm text-muted-foreground text-center max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
