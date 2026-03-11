import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-28" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Skeleton className="h-10 w-[220px]" />
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-10 w-[160px]" />
        <Skeleton className="h-10 w-[140px]" />
        <Skeleton className="h-10 w-[180px]" />
      </div>

      {/* Ticket list */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between rounded-lg border p-4">
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-5 w-64" />
              <Skeleton className="h-4 w-96" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
