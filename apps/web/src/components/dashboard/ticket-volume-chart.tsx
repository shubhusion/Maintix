'use client';

import { useMemo, useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { useTheme } from 'next-themes';

interface TicketVolumeChartProps {
  tickets: { createdAt: string; status: string }[];
  days?: number;
}

export function TicketVolumeChart({ tickets, days = 7 }: TicketVolumeChartProps) {
  const { theme, resolvedTheme } = useTheme();
  const [colors, setColors] = useState({
    primary: '#4f46e5',
    success: '#16a34a',
    mutedForeground: '#737373',
  });

  // Get computed colors from CSS variables
  useEffect(() => {
    const updateColors = () => {
      const root = document.documentElement;
      const style = getComputedStyle(root);
      
      // Get the actual color values from CSS variables
      const primaryColor = style.getPropertyValue('--color-primary-600').trim() || '#4f46e5';
      const successColor = style.getPropertyValue('--color-success-600').trim() || '#16a34a';
      const mutedColor = style.getPropertyValue('--color-neutral-500').trim() || '#737373';
      
      setColors({
        primary: primaryColor,
        success: successColor,
        mutedForeground: mutedColor,
      });
    };

    updateColors();
    
    // Update colors when theme changes (with a small delay for CSS to apply)
    const timeout = setTimeout(updateColors, 50);
    return () => clearTimeout(timeout);
  }, [theme, resolvedTheme]);

  const chartData = useMemo(() => {
    const now = new Date();
    const dateMap = new Map<string, { date: string; created: number; resolved: number }>();

    // Initialize all dates
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = format(date, 'MMM dd');
      dateMap.set(dateStr, { date: dateStr, created: 0, resolved: 0 });
    }

    // Count tickets
    tickets.forEach((ticket) => {
      const dateStr = format(new Date(ticket.createdAt), 'MMM dd');
      const entry = dateMap.get(dateStr);
      if (entry) {
        entry.created += 1;
        if (ticket.status === 'DONE' || ticket.status === 'CANCELLED') {
          entry.resolved += 1;
        }
      }
    });

    return Array.from(dateMap.values());
  }, [tickets, days]);

  const totalCreated = chartData.reduce((sum, d) => sum + d.created, 0);
  const totalResolved = chartData.reduce((sum, d) => sum + d.resolved, 0);

  if (tickets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ticket Volume</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-sm text-muted-foreground">No tickets to display</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">Ticket Volume</CardTitle>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: colors.primary }} />
            <span className="text-muted-foreground">Created: {totalCreated}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: colors.success }} />
            <span className="text-muted-foreground">Resolved: {totalResolved}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3} />
                <stop offset="95%" stopColor={colors.primary} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.success} stopOpacity={0.3} />
                <stop offset="95%" stopColor={colors.success} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              className="text-xs"
              tick={{ fill: colors.mutedForeground, fontSize: 12 }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: colors.mutedForeground, fontSize: 12 }}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: `1px solid hsl(var(--border))`,
                backgroundColor: 'hsl(var(--popover))',
                color: 'hsl(var(--popover-foreground))',
              }}
            />
            <Area
              type="monotone"
              dataKey="created"
              stroke={colors.primary}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCreated)"
            />
            <Area
              type="monotone"
              dataKey="resolved"
              stroke={colors.success}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorResolved)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
