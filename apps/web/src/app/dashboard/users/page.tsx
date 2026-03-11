'use client';

import { useState, useDeferredValue } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Shield, Search } from 'lucide-react';
import { useUsers, useCreateUser, type User } from '@/hooks/use-users';
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
      <UsersTable users={tableItems} isLoading={isLoading} />

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
              <Input
                id="password"
                type="password"
                {...form.register('password')}
                placeholder="••••••••"
              />
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
    </div>
  );
}
