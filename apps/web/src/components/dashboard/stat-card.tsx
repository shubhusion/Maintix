'use client';

import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { StatSparkline } from './stat-sparkline';

interface StatCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon?: ReactNode;
  iconColor?: string;
  iconBgColor?: string;
  trend?: 'up' | 'down' | 'neutral';
  sparklineData?: number[];
  progress?: {
    current: number;
    total: number;
    label?: string;
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon,
  iconColor = 'text-primary',
  iconBgColor = 'bg-primary/10',
  trend,
  sparklineData,
  progress,
  className,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        'group relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/20',
        className,
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && (
          <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', iconBgColor)}>
            <div className={cn('h-4 w-4', iconColor)}>{icon}</div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-3xl font-bold tracking-tight">{value}</div>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
            {progress && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{progress.label || `${progress.current} of ${progress.total}`}</span>
                </div>
                <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${Math.min((progress.current / progress.total) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
          {sparklineData && sparklineData.length > 0 && (
            <StatSparkline
              data={sparklineData}
              color={trend === 'up' ? 'hsl(var(--success))' : trend === 'down' ? 'hsl(var(--error))' : 'hsl(var(--primary))'}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
