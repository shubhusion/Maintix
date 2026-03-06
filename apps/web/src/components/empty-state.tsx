import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12', className)}>
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4">
        {icon}
      </div>
      <h3 className="mb-1 text-lg font-medium">{title}</h3>
      {description && <p className="text-sm text-muted-foreground text-center">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
