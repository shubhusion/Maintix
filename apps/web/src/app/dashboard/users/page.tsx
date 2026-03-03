'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Users as UsersIcon, Mail, Shield } from 'lucide-react';
import { useUsers, useCreateUser, type User } from '@/hooks/use-users';
import { useAuth } from '@/contexts/auth-context';
import { createUserSchema } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Role } from '@maintix/shared-types';
import type { z } from 'zod';

type CreateUserValues = z.infer<typeof createUserSchema>;

const roleConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  [Role.MANAGER]: { label: 'Manager', variant: 'default' },
  [Role.TECHNICIAN]: { label: 'Technician', variant: 'secondary' },
  [Role.TENANT]: { label: 'Tenant', variant: 'outline' },
};

export default function UsersPage() {
  const { user } = useAuth();
  const { data: users, isLoading } = useUsers();
  const createUser = useCreateUser();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);

  const isManager = user?.role === Role.MANAGER;

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

      {isLoading ? (
        <div className="grid gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      ) : !users?.length ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UsersIcon className="mb-4 h-12 w-12 text-muted-foreground/30" />
            <h3 className="text-lg font-medium">No users yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Create your first user to get started.
            </p>
            <Button className="mt-4" onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {users.map((u: User) => {
            const rc = roleConfig[u.role] ?? { label: u.role, variant: 'outline' as const };
            return (
              <Card key={u.id}>
                <CardContent className="flex items-center gap-4 py-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                    {u.firstName?.[0]}
                    {u.lastName?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">
                      {u.firstName} {u.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground truncate flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {u.email}
                    </p>
                  </div>
                  <Badge variant={rc.variant}>{rc.label}</Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create User Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>Add a new tenant, technician, or manager.</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  {...form.register('firstName')}
                  placeholder="John"
                />
                {form.formState.errors.firstName && (
                  <p className="text-xs text-error-500">
                    {form.formState.errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  {...form.register('lastName')}
                  placeholder="Doe"
                />
                {form.formState.errors.lastName && (
                  <p className="text-xs text-error-500">
                    {form.formState.errors.lastName.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...form.register('email')}
                placeholder="john@example.com"
              />
              {form.formState.errors.email && (
                <p className="text-xs text-error-500">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...form.register('password')}
                placeholder="••••••••"
              />
              {form.formState.errors.password && (
                <p className="text-xs text-error-500">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
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
