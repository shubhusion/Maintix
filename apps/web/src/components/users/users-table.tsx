'use client';

import { DataTable } from '@/components/ui/data-table';
import { useUsersColumns, type UserTableItem } from './users-table-columns';

interface UsersTableProps {
  users: UserTableItem[];
  isLoading?: boolean;
}

export function UsersTable({ users, isLoading }: UsersTableProps) {
  const columns = useUsersColumns();

  return <DataTable columns={columns} data={users} isLoading={isLoading} />;
}
