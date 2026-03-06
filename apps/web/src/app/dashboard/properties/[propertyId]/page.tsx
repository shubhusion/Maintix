'use client';

import { use, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Tag, Ticket, Plus, Trash2, UserPlus } from 'lucide-react';
import Link from 'next/link';
import {
  useProperty,
  usePropertyMembers,
  useAddMember,
  useRemoveMember,
} from '@/hooks/use-properties';
import { useCategories, useCreateCategory } from '@/hooks/use-categories';
import { useTickets } from '@/hooks/use-tickets';
import { useUsers } from '@/hooks/use-users';
import { useAuth } from '@/contexts/auth-context';
import { createCategorySchema, type CreateCategoryFormData } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  const { data: allUsers } = useUsers();
  const addMember = useAddMember(propertyId);
  const removeMember = useRemoveMember(propertyId);
  const createCategory = useCreateCategory(propertyId);
  const { toast } = useToast();

  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [removeMemberTarget, setRemoveMemberTarget] = useState<string | null>(null);

  const isManager = user?.role === Role.MANAGER;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCategoryFormData>({
    resolver: zodResolver(createCategorySchema),
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

  const tickets = ticketsData?.data ?? [];
  const memberIds = new Set(members?.map((m) => m.userId) ?? []);
  const addableUsers = allUsers?.data?.filter((u) => !memberIds.has(u.id)) ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{property.name}</h1>
        <p className="text-muted-foreground">{property.address}</p>
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
                        className={`h-2 w-2 rounded-full ${
                          ticket.priority === Priority.URGENT
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
