'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TicketStatus } from '@maintix/shared-types';
import { statusConfig } from '@/lib/ticket-config';

const STATUS_COLORS: Record<string, string> = {
  [TicketStatus.OPEN]: '#6b7280',
  [TicketStatus.ASSIGNED]: '#3b82f6',
  [TicketStatus.IN_PROGRESS]: '#f59e0b',
  [TicketStatus.AWAITING_APPROVAL]: '#8b5cf6',
  [TicketStatus.DONE]: '#22c55e',
  [TicketStatus.CANCELLED]: '#ef4444',
};

interface TicketStatusChartProps {
  tickets: { status: string }[];
}

export function TicketStatusChart({ tickets }: TicketStatusChartProps) {
  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const t of tickets) {
      counts[t.status] = (counts[t.status] || 0) + 1;
    }
    return Object.entries(counts).map(([status, count]) => ({
      name: statusConfig[status]?.label ?? status,
      value: count,
      status,
    }));
  }, [tickets]);

  if (tickets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ticket Distribution</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-sm text-muted-foreground">No tickets to display</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm sm:text-base">Ticket Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240} className="sm:h-[280px]">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.status}
                  fill={STATUS_COLORS[entry.status] ?? '#94a3b8'}
                  strokeWidth={0}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any) => [value ?? 0, 'Tickets']}
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid hsl(var(--border))',
                backgroundColor: 'hsl(var(--popover))',
                color: 'hsl(var(--popover-foreground))',
                fontSize: '12px',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
