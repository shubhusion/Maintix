'use client';

import { DataTable } from '@/components/ui/data-table';
import { useTicketsColumns, type TicketTableItem } from './tickets-table-columns';

interface TicketsTableProps {
  tickets: TicketTableItem[];
  isLoading?: boolean;
  showProperty?: boolean;
}

export function TicketsTable({
  tickets,
  isLoading,
  showProperty = false,
}: TicketsTableProps) {
  const columns = useTicketsColumns({ showProperty });

  return <DataTable columns={columns} data={tickets} isLoading={isLoading} />;
}
