'use client';

import { useState, useDeferredValue, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, ArrowUpDown, Search, Upload, X, FileText, ImageIcon, List, LayoutGrid } from 'lucide-react';
import {
  ALLOWED_FILE_TYPES,
  ALLOWED_FILE_EXTENSIONS,
  MAX_UPLOAD_SIZE,
  MAX_ATTACHMENTS_PER_TICKET,
} from '@maintix/shared-types';
import { cn } from '@/lib/utils';
import { useProperties } from '@/hooks/use-properties';
import {
  useInfiniteTickets,
  useAllPropertyTickets,
  useCreateTicket,
  type TicketQueryParams,
} from '@/hooks/use-tickets';
import { useCategories, useAllCategories } from '@/hooks/use-categories';
import { createTicketSchema, type CreateTicketFormData } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { useToast } from '@/hooks/use-toast';
import { statusConfig } from '@/lib/ticket-config';
import { TicketStatus, Priority } from '@maintix/shared-types';
import { TicketsTable } from '@/components/tickets/tickets-table';
import { type TicketTableItem } from '@/components/tickets/tickets-table-columns';
import { TicketsKanbanBoard, type KanbanTicket } from '@/components/tickets/tickets-kanban';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';

export default function TicketsPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const initialPropertyId = searchParams.get('propertyId') || '';
  const { data: properties } = useProperties();
  const { toast } = useToast();

  const isTenant = user?.role === 'TENANT';
  const isManager = user?.role === 'MANAGER';
  const isTechnician = user?.role === 'TECHNICIAN';

  const [selectedPropertyId, setSelectedPropertyId] = useState(initialPropertyId || 'all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortDir, setSortDir] = useState<string>('desc');
  const [searchInput, setSearchInput] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const deferredSearch = useDeferredValue(searchInput);
  const deferredDateRange = useDeferredValue(dateRange);
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAllProperties = selectedPropertyId === 'all';
  const allPropertyIds = properties?.map((p) => p.id) ?? [];

  const queryParams: TicketQueryParams = {};
  if (statusFilter !== 'all') queryParams.status = statusFilter as TicketStatus;
  if (priorityFilter !== 'all') queryParams.priority = priorityFilter as Priority;
  if (deferredSearch.trim()) queryParams.search = deferredSearch.trim();
  queryParams.sortBy = sortBy;
  queryParams.sortDir = sortDir;

  const {
    data: ticketsData,
    isLoading: isSingleLoading,
  } = useInfiniteTickets(isAllProperties ? '' : selectedPropertyId, queryParams);

  const { tickets: allTickets, isLoading: isAllLoading } = useAllPropertyTickets(
    isAllProperties ? allPropertyIds : [],
    queryParams,
  );

  const { data: categories } = isAllProperties
    ? useAllCategories(allPropertyIds)
    : useCategories(selectedPropertyId);
  const createTicket = useCreateTicket(isAllProperties ? '' : selectedPropertyId);

  const isLoading = isAllProperties ? isAllLoading : isSingleLoading;
  
  // Filter tickets by date range
  const filteredTickets = (isAllProperties
    ? allTickets
    : (ticketsData?.pages.flatMap((page) => page.data) ?? [])
  ).filter((t) => {
    if (!t) return false;
    if (!deferredDateRange?.from) return true;
    
    const ticketDate = new Date(t.createdAt);
    const fromDate = new Date(deferredDateRange.from);
    fromDate.setHours(0, 0, 0, 0);
    
    if (deferredDateRange.to) {
      const toDate = new Date(deferredDateRange.to);
      toDate.setHours(23, 59, 59, 999);
      return ticketDate >= fromDate && ticketDate <= toDate;
    }
    
    return ticketDate >= fromDate;
  });

  const tickets = filteredTickets;

  // Transform tickets to table items
  const tableItems: TicketTableItem[] = tickets.map((t) => ({
    id: t.id,
    title: t.title,
    property: t.property,
    category: t.category,
    status: t.status,
    priority: t.priority,
    createdBy: t.createdBy,
    assignedTo: t.assignedTo,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  }));

  // Transform tickets for Kanban
  const kanbanItems: KanbanTicket[] = tickets.map((t) => ({
    id: t.id,
    title: t.title,
    property: t.property,
    category: t.category,
    status: t.status,
    priority: t.priority,
    assignedTo: t.assignedTo,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  }));

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateTicketFormData & { propertyId?: string }>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      priority: Priority.MEDIUM, // Default to MEDIUM for normal requests
      propertyId: isAllProperties ? undefined : selectedPropertyId,
    },
  });

  const onSubmit = async (data: CreateTicketFormData & { propertyId?: string }) => {
    try {
      // Determine which property to create the ticket under
      const targetPropertyId = isAllProperties ? data.propertyId : selectedPropertyId;
      
      if (!targetPropertyId) {
        toast({
          title: 'Property required',
          description: 'Please select a property for this ticket',
          variant: 'destructive',
        });
        return;
      }

      await createTicket.mutateAsync({ ...data, propertyId: targetPropertyId, files: selectedFiles });
      toast({
        title: 'Ticket created successfully',
        description: selectedFiles.length > 0
          ? `${selectedFiles.length} attachment${selectedFiles.length !== 1 ? 's' : ''} uploaded`
          : undefined,
      });
      setDialogOpen(false);
      reset();
      setSelectedFiles([]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      toast({ title: 'Error', description: message, variant: 'destructive' });
    }
  };

  const handleFileSelect = useCallback(
    (files: FileList | File[]) => {
      const newFiles = Array.from(files);
      const totalCount = selectedFiles.length + newFiles.length;

      if (totalCount > MAX_ATTACHMENTS_PER_TICKET) {
        toast({
          title: 'Too many files',
          description: `Maximum of ${MAX_ATTACHMENTS_PER_TICKET} attachments per ticket`,
          variant: 'destructive',
        });
        return;
      }

      for (const file of newFiles) {
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
          toast({
            title: 'Invalid file type',
            description: `"${file.name}" is not supported. Allowed: ${ALLOWED_FILE_EXTENSIONS.join(', ')}`,
            variant: 'destructive',
          });
          return;
        }
        if (file.size > MAX_UPLOAD_SIZE) {
          toast({
            title: 'File too large',
            description: `"${file.name}" exceeds the ${MAX_UPLOAD_SIZE / (1024 * 1024)}MB limit`,
            variant: 'destructive',
          });
          return;
        }
      }

      setSelectedFiles((prev) => [...prev, ...newFiles]);
    },
    [selectedFiles, toast],
  );

  const removeFile = useCallback((index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            {isTenant ? 'My Requests' : isTechnician ? 'My Tickets' : 'All Tickets'}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            {isTenant
              ? 'Maintenance requests you have submitted.'
              : isTechnician
                ? 'Tickets assigned to you.'
                : 'Maintenance requests across your properties.'}
          </p>
        </div>
        {isTenant && (
          <Button onClick={() => setDialogOpen(true)} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            New Ticket
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tickets…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9 w-full sm:w-[220px]"
          />
        </div>

        <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Select property" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            <SelectItem value="all">All Properties</SelectItem>
            {properties?.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            <SelectItem value="all">All Status</SelectItem>
            {Object.values(TicketStatus).map((s) => (
              <SelectItem key={s} value={s}>
                {statusConfig[s]?.label ?? s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            <SelectItem value="all">All Priority</SelectItem>
            {Object.values(Priority).map((p) => (
              <SelectItem key={p} value={p}>
                {p.charAt(0) + p.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={`${sortBy}:${sortDir}`}
          onValueChange={(val) => {
            const [field, dir] = val.split(':');
            setSortBy(field);
            setSortDir(dir);
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <ArrowUpDown className="mr-2 h-3.5 w-3.5" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            <SelectItem value="createdAt:desc">Newest First</SelectItem>
            <SelectItem value="createdAt:asc">Oldest First</SelectItem>
            <SelectItem value="updatedAt:desc">Recently Updated</SelectItem>
            <SelectItem value="priority:desc">Highest Priority</SelectItem>
            <SelectItem value="priority:asc">Lowest Priority</SelectItem>
          </SelectContent>
        </Select>

        <DateRangePicker
          date={dateRange}
          onDateChange={setDateRange}
          placeholder="Filter by date"
        />

        {/* Clear date filter button */}
        {dateRange?.from && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDateRange(undefined)}
            className="h-10"
          >
            Clear
          </Button>
        )}
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-2">
        <div className="flex items-center rounded-lg border p-1">
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors",
              viewMode === 'list'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">List</span>
          </button>
          <button
            onClick={() => setViewMode('board')}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors",
              viewMode === 'board'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="hidden sm:inline">Board</span>
          </button>
        </div>
      </div>

      {/* Tickets View */}
      {viewMode === 'list' ? (
        <TicketsTable
          tickets={tableItems}
          isLoading={isLoading}
          showProperty={isAllProperties}
        />
      ) : (
        <div className="h-[calc(100vh-18rem)] sm:h-[calc(100vh-20rem)] lg:h-[calc(100vh-24rem)] overflow-x-auto">
          <TicketsKanbanBoard
            tickets={kanbanItems}
            onTicketClick={(ticketId) => {
              window.location.href = `/dashboard/tickets/${ticketId}`;
            }}
          />
        </div>
      )}

      {/* Create Ticket Dialog - Tenants Only */}
      {isTenant && (
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              reset();
              setSelectedFiles([]);
            }
          }}
        >
          <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-h-[90vh] sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">Create Ticket</DialogTitle>
              <DialogDescription className="text-sm">Submit a new maintenance request.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
              {/* Property Selector - Show when "All Properties" is selected and there are multiple properties */}
              {isAllProperties && properties && properties.length > 0 && (
                <div className="space-y-2">
                  <Label>
                    Property <span className="text-error-500">*</span>
                  </Label>
                  <Select onValueChange={(val) => setValue('propertyId', val, { shouldValidate: true })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select property" />
                    </SelectTrigger>
                    <SelectContent>
                      {properties.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.propertyId && (
                    <p className="text-sm text-error-500">{errors.propertyId.message}</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-error-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="e.g. Leaking faucet in unit 3B"
                  {...register('title')}
                />
                {errors.title && <p className="text-sm text-error-500">{errors.title.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-error-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the issue in detail..."
                  rows={4}
                  {...register('description')}
                />
                <div className="flex justify-between">
                  <p className="text-xs text-muted-foreground">
                    {errors.description && (
                      <span className="text-error-500">{errors.description.message}</span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {watch('description')?.length ?? 0} / 5000
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Label>
                  Category <span className="text-error-500">*</span>
                </Label>
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
                  <p className="text-sm text-error-500">{errors.categoryId.message}</p>
                )}
              </div>

              {/* Priority Selector */}
              <div className="space-y-2">
                <Label>
                  Priority
                </Label>
                <Select onValueChange={(val) => setValue('priority', val as Priority)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Leave as Medium for normal requests. Select High or Urgent for critical issues.
                </p>
                {errors.priority && (
                  <p className="text-sm text-error-500">{errors.priority.message}</p>
                )}
              </div>

              {/* Attachments */}
              <div className="space-y-2">
                <Label>Attachments</Label>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.dataTransfer.files.length > 0) handleFileSelect(e.dataTransfer.files);
                  }}
                  className={cn(
                    'flex flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed p-4 transition-colors cursor-pointer',
                    'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50',
                  )}
                >
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Drag & drop or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {ALLOWED_FILE_EXTENSIONS.join(', ')} — Max {MAX_UPLOAD_SIZE / (1024 * 1024)}MB — {MAX_ATTACHMENTS_PER_TICKET - selectedFiles.length} slot{MAX_ATTACHMENTS_PER_TICKET - selectedFiles.length !== 1 ? 's' : ''} remaining
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept={ALLOWED_FILE_TYPES.join(',')}
                  multiple
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleFileSelect(e.target.files);
                      e.target.value = '';
                    }
                  }}
                />
                {selectedFiles.length > 0 && (
                  <div className="space-y-1.5">
                    {selectedFiles.map((file, idx) => (
                      <div
                        key={`${file.name}-${idx}`}
                        className="flex items-center gap-2 rounded-md border p-2 text-sm"
                      >
                        {file.type.startsWith('image/') ? (
                          <ImageIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                        ) : (
                          <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                        )}
                        <span className="truncate flex-1">{file.name}</span>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {(file.size / 1024).toFixed(0)}KB
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 shrink-0"
                          onClick={() => removeFile(idx)}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <DialogFooter className="flex-col sm:flex-row gap-2 pt-3 sm:pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                  {isSubmitting ? 'Creating...' : 'Create Ticket'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
