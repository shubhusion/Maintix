'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, Mail } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Role } from '@maintix/shared-types';

export interface UserTableItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  createdAt: string;
  propertiesCount?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useUsersColumns(): ColumnDef<UserTableItem>[] {
  return [
    {
      accessorKey: 'name',
      accessorFn: (row: UserTableItem) => `${row.firstName} ${row.lastName}`,
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-2 font-medium"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            User
            <ArrowUpDown className="h-4 w-4" />
          </button>
        );
      },
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback role={user.role} className="text-xs">
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-medium truncate">
                {user.firstName} {user.lastName}
              </p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Mail className="h-3 w-3" />
                <span className="truncate">{user.email}</span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'role',
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Role
            <ArrowUpDown className="h-4 w-4" />
          </button>
        );
      },
      cell: ({ row }) => {
        const role = row.getValue('role') as string;
        const roleBadgeConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
          MANAGER: { label: 'Manager', variant: 'default' },
          TECHNICIAN: { label: 'Technician', variant: 'secondary' },
          TENANT: { label: 'Tenant', variant: 'outline' },
        };
        const config = roleBadgeConfig[role];
        return <Badge variant={config?.variant ?? 'outline'}>{config?.label ?? role}</Badge>;
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: 'propertiesCount',
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Properties
            <ArrowUpDown className="h-4 w-4" />
          </button>
        );
      },
      cell: ({ row }) => {
        const count = row.getValue('propertiesCount') as number | undefined;
        if (count === undefined || count === null) return <span className="text-muted-foreground">—</span>;
        return <span className="text-sm font-medium">{count}</span>;
      },
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Joined
            <ArrowUpDown className="h-4 w-4" />
          </button>
        );
      },
      cell: ({ row }) => {
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
