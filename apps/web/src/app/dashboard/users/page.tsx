'use client';

import { useState, useDeferredValue } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Shield, Search, Eye, EyeOff } from 'lucide-react';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser, type User } from '@/hooks/use-users';
import { useAuth } from '@/contexts/auth-context';
import { createUserSchema } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { useToast } from '@/hooks/use-toast';
import { Role } from '@maintix/shared-types';
import type { z } from 'zod';
import { UsersTable } from '@/components/users/users-table';
import { type UserTableItem } from '@/components/users/users-table-columns';

type CreateUserValues = z.infer<typeof createUserSchema>;

export default function UsersPage() {
  const { user } = useAuth();
  const [searchInput, setSearchInput] = useState('');
  const deferredSearch = useDeferredValue(searchInput);
  const { data: users, isLoading } = useUsers(deferredSearch || undefined);
  const createUser = useCreateUser();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: string; firstName: string; lastName: string; email: string; role: Role } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);

  // Create hooks at component level
  const updateUser = useUpdateUser(selectedUser?.id || '');
  const deleteUser = useDeleteUser(selectedUser?.id || '');

  const isManager = user?.role === Role.MANAGER;

  // Transform users to table items
  const tableItems: UserTableItem[] = (users?.data ?? []).map((u: User) => ({
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email,
    role: u.role as Role,
    createdAt: u.createdAt,
  }));

  const form = useForm<CreateUserValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { email: '', firstName: '', lastName: '', password: '', role: Role.TENANT },
  });

  // Edit form
  const editForm = useForm<CreateUserValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { email: '', firstName: '', lastName: '', password: '', role: Role.TENANT },
  });

  const onSubmit = async (values: CreateUserValues) => {
    try {
      await createUser.mutateAsync(values);
      toast({ title: 'User created successfully' });
      setDialogOpen(false);
      form.reset();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      toast({ title: 'Error', description: message, variant: 'destructive' });
    }
  };

  const handleEdit = (userItem: UserTableItem) => {
    setSelectedUser({
      id: userItem.id,
      firstName: userItem.firstName,
      lastName: userItem.lastName,
      email: userItem.email,
      role: userItem.role,
    });
    editForm.reset({
      email: userItem.email,
      firstName: userItem.firstName,
      lastName: userItem.lastName,
      password: '',
      role: userItem.role as Role.TENANT | Role.TECHNICIAN,
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async (values: CreateUserValues) => {
    if (!selectedUser) return;
    try {
      await updateUser.mutateAsync({
        firstName: values.firstName,
        lastName: values.lastName,
        role: values.role as Role.TENANT | Role.TECHNICIAN,
      });
      toast({ title: 'User updated successfully' });
      setEditDialogOpen(false);
      setSelectedUser(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      toast({ title: 'Error', description: message, variant: 'destructive' });
    }
  };

  const handleDeleteClick = (userItem: UserTableItem) => {
    setSelectedUser({
      id: userItem.id,
      firstName: userItem.firstName,
      lastName: userItem.lastName,
      email: userItem.email,
      role: userItem.role,
    });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;
    try {
      await deleteUser.mutateAsync();
      toast({ title: 'User deleted successfully' });
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      toast({ title: 'Error', description: message, variant: 'destructive' });
    }
  };

  if (!isManager) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Shield className="mb-4 h-12 w-12 text-muted-foreground/50" />
        <h3 className="text-lg font-medium">Access Denied</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Only managers can access user management.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage tenants and technicians</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-auto">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search users…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-9 w-full sm:w-[280px]"
        />
      </div>

      {/* Users Table */}
      <UsersTable 
        users={tableItems} 
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        isManager={isManager}
      />

      {/* Create User Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>Add a new tenant, technician, or manager.</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">
                  First Name <span className="text-error-500">*</span>
                </Label>
                <Input id="firstName" {...form.register('firstName')} placeholder="John" />
                {form.formState.errors.firstName && (
                  <p className="text-xs text-error-500">
                    {form.formState.errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName">
                  Last Name <span className="text-error-500">*</span>
                </Label>
                <Input id="lastName" {...form.register('lastName')} placeholder="Doe" />
                {form.formState.errors.lastName && (
                  <p className="text-xs text-error-500">{form.formState.errors.lastName.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">
                Email <span className="text-error-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                {...form.register('email')}
                placeholder="john@example.com"
              />
              {form.formState.errors.email && (
                <p className="text-xs text-error-500">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">
                Password <span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...form.register('password')}
                  placeholder="••••••••"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters, with an uppercase letter and a number.
              </p>
              {form.formState.errors.password && (
                <p className="text-xs text-error-500">{form.formState.errors.password.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>
                Role <span className="text-error-500">*</span>
              </Label>
              <Select
                value={form.watch('role')}
                onValueChange={(v) => form.setValue('role', v as Role.TENANT | Role.TECHNICIAN)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Role.TENANT}>Tenant</SelectItem>
                  <SelectItem value={Role.TECHNICIAN}>Technician</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createUser.isPending}>
                {createUser.isPending ? 'Creating...' : 'Create User'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information and role.</DialogDescription>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="edit-firstName">
                  First Name <span className="text-error-500">*</span>
                </Label>
                <Input id="edit-firstName" {...editForm.register('firstName')} placeholder="John" />
                {editForm.formState.errors.firstName && (
                  <p className="text-xs text-error-500">
                    {editForm.formState.errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-lastName">
                  Last Name <span className="text-error-500">*</span>
                </Label>
                <Input id="edit-lastName" {...editForm.register('lastName')} placeholder="Doe" />
                {editForm.formState.errors.lastName && (
                  <p className="text-xs text-error-500">{editForm.formState.errors.lastName.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-email">
                Email <span className="text-error-500">*</span>
              </Label>
              <Input
                id="edit-email"
                type="email"
                {...editForm.register('email')}
                placeholder="john@example.com"
                disabled
                className="bg-muted/50"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
              {editForm.formState.errors.email && (
                <p className="text-xs text-error-500">{editForm.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>
                Role <span className="text-error-500">*</span>
              </Label>
              <Select
                value={editForm.watch('role')}
                onValueChange={(v) => editForm.setValue('role', v as Role.TENANT | Role.TECHNICIAN)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Role.TENANT}>Tenant</SelectItem>
                  <SelectItem value={Role.TECHNICIAN}>Technician</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={editForm.formState.isSubmitting}>
                {editForm.formState.isSubmitting ? 'Updating...' : 'Update User'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user &quot;
              {selectedUser?.firstName} {selectedUser?.lastName}&quot; ({selectedUser?.email}) and remove their access to all properties.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedUser(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-error-500 hover:bg-error-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
