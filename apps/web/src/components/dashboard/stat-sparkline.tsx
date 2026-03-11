'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface StatSparklineProps {
  data: number[];
  className?: string;
  color?: string;
}

export function StatSparkline({ data, className, color = 'hsl(var(--primary))' }: StatSparklineProps) {
  const path = useMemo(() => {
    if (data.length === 0) return '';
    if (data.length === 1) return '';

    const max = Math.max(...data, 1);
    const min = Math.min(...data, 0);
    const range = max - min || 1;
    const width = 100;
    const height = 40;
    const padding = 4;

    return data
      .map((value, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - padding - ((value - min) / range) * (height - padding * 2);
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  }, [data]);

  if (data.length === 0) return null;

  return (
    <div className={cn('h-10 w-24', className)}>
      <svg width="100" height="40" className="overflow-visible">
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
