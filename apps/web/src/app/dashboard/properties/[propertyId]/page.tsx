'use client';

import { use, useState, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Tag, Ticket, Plus, Trash2, UserPlus, Upload, X, FileText, ImageIcon } from 'lucide-react';
import {
  ALLOWED_FILE_TYPES,
  ALLOWED_FILE_EXTENSIONS,
  MAX_UPLOAD_SIZE,
  MAX_ATTACHMENTS_PER_TICKET,
} from '@maintix/shared-types';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import {
  useProperty,
  usePropertyMembers,
  useAddMember,
  useRemoveMember,
} from '@/hooks/use-properties';
import { useCategories, useCreateCategory } from '@/hooks/use-categories';
import { useTickets, useCreateTicket } from '@/hooks/use-tickets';
import { useUsers } from '@/hooks/use-users';
import { useAuth } from '@/contexts/auth-context';
import {
  createCategorySchema,
  type CreateCategoryFormData,
  createTicketSchema,
  type CreateTicketFormData,
} from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { statusConfig, priorityConfig } from '@/lib/ticket-config';
import { Role, Priority } from '@maintix/shared-types';

export default function PropertyDetailPage({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}) {
  const { propertyId } = use(params);
  const { user } = useAuth();
  const { data: property, isLoading: propLoading } = useProperty(propertyId);
  const { data: members } = usePropertyMembers(propertyId);
  const { data: categories } = useCategories(propertyId);
  const { data: ticketsData } = useTickets(propertyId);
  const { data: allUsers } = useUsers(undefined, user?.role === Role.MANAGER);
  const addMember = useAddMember(propertyId);
  const removeMember = useRemoveMember(propertyId);
  const createCategory = useCreateCategory(propertyId);
  const createTicket = useCreateTicket(propertyId);
  const { toast } = useToast();

  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [removeMemberTarget, setRemoveMemberTarget] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isManager = user?.role === Role.MANAGER;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCategoryFormData>({
    resolver: zodResolver(createCategorySchema),
  });

  const {
    register: registerTicket,
    handleSubmit: handleTicketSubmit,
    reset: resetTicket,
    setValue: setTicketValue,
    watch: watchTicket,
    formState: { errors: ticketErrors, isSubmitting: isTicketSubmitting },
  } = useForm<CreateTicketFormData>({
    resolver: zodResolver(createTicketSchema),
  });

  const onCreateCategory = async (data: CreateCategoryFormData) => {
    try {
      await createCategory.mutateAsync(data);
      toast({ title: 'Category created' });
      setCatDialogOpen(false);
      reset();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      toast({ title: 'Error', description: message, variant: 'destructive' });
    }
  };

  const onCreateTicket = async (data: CreateTicketFormData) => {
    try {
      await createTicket.mutateAsync({ ...data, files: selectedFiles });
      toast({
        title: 'Ticket created successfully',
        description: selectedFiles.length > 0
          ? `${selectedFiles.length} attachment${selectedFiles.length !== 1 ? 's' : ''} uploaded`
          : undefined,
      });
      setTicketDialogOpen(false);
      resetTicket();
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

  const onAddMember = async () => {
    if (!selectedUserId) return;
    try {
      await addMember.mutateAsync({ userId: selectedUserId });
      toast({ title: 'Member added' });
      setMemberDialogOpen(false);
      setSelectedUserId('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      toast({ title: 'Error', description: message, variant: 'destructive' });
    }
  };

  const onRemoveMember = async (userId: string) => {
    try {
      await removeMember.mutateAsync(userId);
      toast({ title: 'Member removed' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      toast({ title: 'Error', description: message, variant: 'destructive' });
    }
  };

  if (propLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Building2 className="mb-4 h-12 w-12 text-muted-foreground/50" />
        <h3 className="text-lg font-medium">Property not found</h3>
      </div>
    );
  }

  const tickets = (ticketsData?.data ?? []).filter(t => t !== undefined && t !== null);
  const memberIds = new Set(members?.map((m) => m.userId) ?? []);
  const addableUsers = allUsers?.data?.filter((u) => !memberIds.has(u.id)) ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{property.name}</h1>
          <p className="text-muted-foreground">{property.address}</p>
        </div>
        {user?.role === Role.TENANT && (
          <Button onClick={() => setTicketDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Ticket
          </Button>
        )}
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tickets.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{members?.length ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories?.length ?? 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Members */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Members</CardTitle>
              <CardDescription>People in this property</CardDescription>
            </div>
            {isManager && (
              <Button size="sm" variant="outline" onClick={() => setMemberDialogOpen(true)}>
                <UserPlus className="mr-1 h-4 w-4" />
                Add
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {members && members.length > 0 ? (
              <ul className="space-y-3">
                {members.map((m) => (
                  <li key={m.userId} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        {m.user.firstName[0]}
                        {m.user.lastName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {m.user.firstName} {m.user.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {m.user.role.toLowerCase()}
                        </p>
                      </div>
                    </div>
                    {isManager && m.userId !== user?.id && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-error-500"
                        onClick={() => setRemoveMemberTarget(m.userId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No members yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Categories */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Categories</CardTitle>
              <CardDescription>Ticket categories for this property</CardDescription>
            </div>
            {isManager && (
              <Button size="sm" variant="outline" onClick={() => setCatDialogOpen(true)}>
                <Plus className="mr-1 h-4 w-4" />
                Add
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {categories && categories.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Badge key={cat.id} variant="secondary">
                    <Tag className="mr-1 h-3 w-3" />
                    {cat.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No categories yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Tickets */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Recent Tickets</CardTitle>
            <CardDescription>Latest maintenance requests</CardDescription>
          </div>
          <Link href={`/dashboard/tickets?propertyId=${propertyId}`}>
            <Button size="sm" variant="outline">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {tickets.length > 0 ? (
            <div className="space-y-3">
              {tickets.slice(0, 5).map((ticket) => (
                <Link
                  key={ticket.id}
                  href={`/dashboard/tickets/${ticket.id}`}
                  className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:border-primary/50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{ticket.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {ticket.category?.name} · by {ticket.createdBy?.firstName}
                    </p>
                  </div>
                  <div className="ml-4 flex items-center gap-2">
                    {ticket.priority && priorityConfig[ticket.priority] && (
                      <span
                        className={`h-2 w-2 rounded-full ${ticket.priority === Priority.URGENT
                          ? 'animate-pulse bg-error-500'
                          : ticket.priority === Priority.HIGH
                            ? 'bg-warning-500'
                            : ticket.priority === Priority.MEDIUM
                              ? 'bg-primary-500'
                              : 'bg-neutral-400'
                          }`}
                      />
                    )}
                    <Badge variant={statusConfig[ticket.status]?.variant ?? 'secondary'}>
                      {statusConfig[ticket.status]?.label ?? ticket.status}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <Ticket className="mb-3 h-10 w-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No tickets yet for this property.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Member Dialog */}
      <Dialog open={memberDialogOpen} onOpenChange={setMemberDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Member</DialogTitle>
            <DialogDescription>
              Select a user to add as a member of this property.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {addableUsers.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.firstName} {u.lastName} ({u.role.toLowerCase()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMemberDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={onAddMember} disabled={!selectedUserId}>
              Add Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Category Dialog */}
      <Dialog open={catDialogOpen} onOpenChange={setCatDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription>Create a new ticket category for this property.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onCreateCategory)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="catName">
                Name <span className="text-error-500">*</span>
              </Label>
              <Input id="catName" placeholder="e.g. Plumbing" {...register('name')} />
              {errors.name && <p className="text-sm text-error-500">{errors.name.message}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCatDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create Ticket Dialog */}
      {user?.role === Role.TENANT && (
        <Dialog
          open={ticketDialogOpen}
          onOpenChange={(open) => {
            setTicketDialogOpen(open);
            if (!open) {
              resetTicket();
              setSelectedFiles([]);
            }
          }}
        >
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Ticket</DialogTitle>
              <DialogDescription>Submit a new maintenance request.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleTicketSubmit(onCreateTicket)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-error-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="e.g. Leaking faucet in unit 3B"
                  {...registerTicket('title')}
                />
                {ticketErrors.title && <p className="text-sm text-error-500">{ticketErrors.title.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-error-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the issue in detail..."
                  rows={4}
                  {...registerTicket('description')}
                />
                <div className="flex justify-between">
                  <p className="text-xs text-muted-foreground">
                    {ticketErrors.description && (
                      <span className="text-error-500">{ticketErrors.description.message}</span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {watchTicket('description')?.length ?? 0} / 5000
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Label>
                  Category <span className="text-error-500">*</span>
                </Label>
                <Select onValueChange={(val) => setTicketValue('categoryId', val)}>
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
                {ticketErrors.categoryId && (
                  <p className="text-sm text-error-500">{ticketErrors.categoryId.message}</p>
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

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setTicketDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isTicketSubmitting}>
                  {isTicketSubmitting ? 'Creating...' : 'Create Ticket'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Remove Member Confirmation */}
      <AlertDialog
        open={!!removeMemberTarget}
        onOpenChange={(open) => {
          if (!open) setRemoveMemberTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove member?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the user from this property. They will lose access to all tickets and
              data associated with it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (removeMemberTarget) {
                  onRemoveMember(removeMemberTarget);
                  setRemoveMemberTarget(null);
                }
              }}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
