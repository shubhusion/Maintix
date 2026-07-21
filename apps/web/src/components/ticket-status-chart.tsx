'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TicketStatus } from '@maintix/shared-types';
import { statusConfig } from '@/lib/ticket-config';

const STATUS_COLORS: Record<string, string> = {
  [TicketStatus.OPEN]: '#64748b',
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
    return Object.entries(counts)
      .map(([status, count]) => ({
        name: statusConfig[status]?.label ?? status,
        value: count,
        status,
      }))
      .sort((a, b) => b.value - a.value);
  }, [tickets]);

  const totalTickets = tickets.length;

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
        <div className="relative">
          <ResponsiveContainer width="100%" height={240} className="sm:h-[280px]">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={3}
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
                animationEasing="ease-out"
              >
                {chartData.map((entry) => (
                  <Cell
                    key={entry.status}
                    fill={STATUS_COLORS[entry.status] ?? '#94a3b8'}
                    strokeWidth={0}
                    style={{
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [
                  `${value} (${Math.round(((value as number) / totalTickets) * 100)}%)`,
                  'Tickets',
                ]}
                contentStyle={{
                  borderRadius: '10px',
                  border: '1px solid hsl(var(--border))',
                  backgroundColor: 'hsl(var(--popover))',
                  color: 'hsl(var(--popover-foreground))',
                  fontSize: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold text-foreground">{totalTickets}</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Total</span>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          {chartData.map((entry) => (
            <div key={entry.status} className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded-full shadow-sm"
                style={{ backgroundColor: STATUS_COLORS[entry.status] ?? '#94a3b8' }}
              />
              <span className="text-xs text-muted-foreground">{entry.name}</span>
              <span className="text-xs font-medium text-foreground">{entry.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
