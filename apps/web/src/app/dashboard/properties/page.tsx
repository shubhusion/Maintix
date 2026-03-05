'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Building2 } from 'lucide-react';
import Link from 'next/link';
import {
  useProperties,
  useCreateProperty,
} from '@/hooks/use-properties';
import { useAuth } from '@/contexts/auth-context';
import { createPropertySchema, type CreatePropertyFormData } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Role } from '@maintix/shared-types';

export default function PropertiesPage() {
  const { user } = useAuth();
  const { data: properties, isLoading } = useProperties();
  const createProperty = useCreateProperty();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreatePropertyFormData>({
    resolver: zodResolver(createPropertySchema),
  });

  const onSubmit = async (data: CreatePropertyFormData) => {
    try {
      await createProperty.mutateAsync(data);
      toast({ title: 'Property created successfully' });
      setDialogOpen(false);
      reset();
    } catch (err: unknown) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'An error occurred',
        variant: 'destructive',
      });
    }
  };

  const isManager = user?.role === Role.MANAGER;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Properties</h1>
          <p className="text-muted-foreground">
            Manage your buildings and units.
          </p>
        </div>
        {isManager && (
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[140px] rounded-lg" />
          ))}
        </div>
      ) : properties && properties.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <Link
              key={property.id}
              href={`/dashboard/properties/${property.id}`}
            >
              <Card className="cursor-pointer transition-colors hover:border-primary/50">
                <CardHeader>
                  <CardTitle className="text-base">{property.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {property.address}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="mb-1 text-lg font-medium">No properties</h3>
            <p className="text-sm text-muted-foreground">
              {isManager
                ? 'Add your first property to get started.'
                : 'Ask your manager to add you to a property.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Create Property Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Property</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name <span className="text-error-500">*</span></Label>
              <Input
                id="name"
                placeholder="Sunrise Apartments"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-error-500">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address <span className="text-error-500">*</span></Label>
              <Input
                id="address"
                placeholder="123 Main St, City, State"
                {...register('address')}
              />
              {errors.address && (
                <p className="text-sm text-error-500">
                  {errors.address.message}
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
                {isSubmitting ? 'Creating...' : 'Create Property'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
