'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Ticket, Filter } from 'lucide-react';
import Link from 'next/link';
import { useProperties } from '@/hooks/use-properties';
import { useInfiniteTickets, useCreateTicket, type TicketQueryParams } from '@/hooks/use-tickets';
import { useCategories } from '@/hooks/use-categories';
import { createTicketSchema, type CreateTicketFormData } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { statusConfig } from '@/lib/ticket-config';
import { TicketStatus, Priority } from '@maintix/shared-types';

export default function TicketsPage() {
  const searchParams = useSearchParams();
  const initialPropertyId = searchParams.get('propertyId') || '';
  const { data: properties } = useProperties();
  const { toast } = useToast();

  const [selectedPropertyId, setSelectedPropertyId] = useState(initialPropertyId);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);

  const queryParams: TicketQueryParams = {};
  if (statusFilter !== 'all') queryParams.status = statusFilter as TicketStatus;
  if (priorityFilter !== 'all') queryParams.priority = priorityFilter as Priority;

  const {
    data: ticketsData,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteTickets(selectedPropertyId, queryParams);
  const { data: categories } = useCategories(selectedPropertyId);
  const createTicket = useCreateTicket(selectedPropertyId);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateTicketFormData>({
    resolver: zodResolver(createTicketSchema),
  });

  const onSubmit = async (data: CreateTicketFormData) => {
    try {
      await createTicket.mutateAsync(data);
      toast({ title: 'Ticket created successfully' });
      setDialogOpen(false);
      reset();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      toast({ title: 'Error', description: message, variant: 'destructive' });
    }
  };

  const tickets = ticketsData?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tickets</h1>
          <p className="text-muted-foreground">
            Maintenance requests across your properties.
          </p>
        </div>
        {selectedPropertyId && (
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Ticket
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select property" />
          </SelectTrigger>
          <SelectContent>
            {properties?.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {Object.values(TicketStatus).map((s) => (
              <SelectItem key={s} value={s}>
                {statusConfig[s]?.label ?? s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            {Object.values(Priority).map((p) => (
              <SelectItem key={p} value={p}>
                {p.charAt(0) + p.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!selectedPropertyId ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Filter className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="mb-1 text-lg font-medium">Select a property</h3>
            <p className="text-sm text-muted-foreground">
              Choose a property to view its tickets.
            </p>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[72px] rounded-lg" />
          ))}
        </div>
      ) : tickets.length > 0 ? (
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <Link
              key={ticket.id}
              href={`/dashboard/tickets/${ticket.id}`}
            >
              <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:border-primary/50">
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{ticket.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {ticket.category?.name} · {ticket.createdBy?.firstName}{' '}
                    {ticket.createdBy?.lastName} ·{' '}
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="ml-4 flex items-center gap-3">
                  {ticket.priority === Priority.URGENT && (
                    <span className="h-2 w-2 animate-pulse rounded-full bg-error-500" />
                  )}
                  {ticket.priority === Priority.HIGH && (
                    <span className="h-2 w-2 rounded-full bg-warning-500" />
                  )}
                  {ticket.assignedTo && (
                    <span className="text-xs text-muted-foreground">
                      → {ticket.assignedTo.firstName}
                    </span>
                  )}
                  <Badge variant={statusConfig[ticket.status]?.variant ?? 'secondary'}>
                    {statusConfig[ticket.status]?.label ?? ticket.status}
                  </Badge>
                </div>
              </div>
            </Link>
          ))}
          {hasNextPage && (
            <div className="text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Ticket className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="mb-1 text-lg font-medium">No tickets</h3>
            <p className="text-sm text-muted-foreground">
              Create your first maintenance ticket.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Create Ticket Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Ticket</DialogTitle>
            <DialogDescription>Submit a new maintenance request.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="e.g. Leaking faucet in unit 3B"
                {...register('title')}
              />
              {errors.title && (
                <p className="text-sm text-error-500">{errors.title.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the issue in detail..."
                rows={4}
                {...register('description')}
              />
              {errors.description && (
                <p className="text-sm text-error-500">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select onValueChange={(val) => setValue('categoryId', val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-sm text-error-500">
                  {errors.categoryId.message}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Ticket'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
