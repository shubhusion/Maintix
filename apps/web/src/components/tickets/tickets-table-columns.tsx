'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowUpDown, Ticket as TicketIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { statusConfig, priorityConfig } from '@/lib/ticket-config';
import { Priority } from '@maintix/shared-types';
import Link from 'next/link';

export interface TicketTableItem {
  id: string;
  title: string;
  property?: { id: string; name: string } | null;
  category?: { id: string; name: string } | null;
  status: string;
  priority: Priority | null;
  createdBy?: { id: string; firstName: string; lastName: string } | null;
  assignedTo?: { id: string; firstName: string; lastName: string } | null;
  createdAt: string;
  updatedAt: string;
}

interface UseTicketsColumnsProps {
  showProperty?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useTicketsColumns({ showProperty = false }: UseTicketsColumnsProps): ColumnDef<TicketTableItem>[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: boolean) => row.toggleSelected(value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'title',
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-2 font-medium"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Title
            <ArrowUpDown className="h-4 w-4" />
          </button>
        );
      },
      cell: ({ row }) => {
        const ticket = row.original;
        return (
          <Link
            href={`/dashboard/tickets/${ticket.id}`}
            className="font-medium hover:text-primary transition-colors"
          >
            <div className="flex items-center gap-2">
              <TicketIcon className="h-4 w-4 text-muted-foreground" />
              {ticket.title}
            </div>
          </Link>
        );
      },
    },
    ...(showProperty
      ? [
          {
            accessorKey: 'property.name' as const,
            accessorFn: (row: TicketTableItem) => row.property?.name ?? '',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            header: ({ column }: any) => {
              return (
                <button
                  className="flex items-center gap-2"
                  onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                  Property
                  <ArrowUpDown className="h-4 w-4" />
                </button>
              );
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            cell: ({ row }: any) => {
              const property = row.original.property;
              if (!property) return <span className="text-muted-foreground">—</span>;
              return (
                <Link
                  href={`/dashboard/properties/${property.id}`}
                  className="text-sm hover:text-primary transition-colors"
                >
                  {property.name}
                </Link>
              );
            },
          },
        ]
      : []),
    {
      accessorKey: 'status',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      header: ({ column }: any) => {
        return (
          <button
            className="flex items-center gap-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Status
            <ArrowUpDown className="h-4 w-4" />
          </button>
        );
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: any) => {
        const status = row.getValue('status') as string;
        const config = statusConfig[status];
        return <Badge variant={config?.variant ?? 'secondary'}>{config?.label ?? status}</Badge>;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      filterFn: (row: any, id: string, value: string[]) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: 'priority',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      header: ({ column }: any) => {
        return (
          <button
            className="flex items-center gap-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Priority
            <ArrowUpDown className="h-4 w-4" />
          </button>
        );
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: any) => {
        const priority = row.getValue('priority') as Priority | null;
        if (!priority) return <span className="text-muted-foreground">—</span>;
        
        const config = priorityConfig[priority];
        const dotColor =
          priority === Priority.URGENT
            ? 'bg-error-500 animate-pulse'
            : priority === Priority.HIGH
              ? 'bg-warning-500'
              : priority === Priority.MEDIUM
                ? 'bg-primary-500'
                : 'bg-neutral-400';

        return (
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${dotColor}`} />
            <span className="text-sm">{config?.label ?? priority}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'assignedTo',
      header: 'Assignee',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: any) => {
        const assignee = row.original.assignedTo;
        if (!assignee) return <span className="text-muted-foreground">Unassigned</span>;
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-[10px]">
                {assignee.firstName?.[0]}
                {assignee.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">
              {assignee.firstName} {assignee.lastName}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      header: ({ column }: any) => {
        return (
          <button
            className="flex items-center gap-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Created
            <ArrowUpDown className="h-4 w-4" />
          </button>
        );
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: any) => {
        const date = row.getValue('createdAt') as string;
        return (
          <span className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(date), { addSuffix: true })}
          </span>
        );
      },
    },
  ];
}
