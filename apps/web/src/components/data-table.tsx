import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DataTableProps<T> {
  data: T[];
  keyField: keyof T;
  renderRow: (item: T) => ReactNode;
  empty?: ReactNode;
  loading?: ReactNode;
  className?: string;
}

export function DataTable<T>({
  data,
  keyField,
  renderRow,
  empty,
  loading,
  className,
}: DataTableProps<T>) {
  if (loading) {
    return <>{loading}</>;
  }

  if (!data || data.length === 0) {
    return empty ? <>{empty}</> : null;
  }

  return (
    <div className={cn('grid gap-3', className)}>
      {data.map((item) => (
        <div key={String(item[keyField])}>{renderRow(item)}</div>
      ))}
    </div>
  );
}
