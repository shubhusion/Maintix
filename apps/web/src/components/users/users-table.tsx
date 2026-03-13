'use client';

import { DataTable } from '@/components/ui/data-table';
import { useUsersColumns, type UserTableItem } from './users-table-columns';

interface UsersTableProps {
  users: UserTableItem[];
  isLoading?: boolean;
  onEdit?: (user: UserTableItem) => void;
  onDelete?: (user: UserTableItem) => void;
  isManager?: boolean;
}

export function UsersTable({ users, isLoading, onEdit, onDelete, isManager }: UsersTableProps) {
  const columns = useUsersColumns({ onEdit, onDelete, isManager: isManager ?? false });

  return <DataTable columns={columns} data={users} isLoading={isLoading} />;
}
