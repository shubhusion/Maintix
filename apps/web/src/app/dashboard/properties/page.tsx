'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useProperties, useCreateProperty, useUpdateProperty, useDeleteProperty } from '@/hooks/use-properties';
import { useAuth } from '@/contexts/auth-context';
import { createPropertySchema, type CreatePropertyFormData } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/empty-state';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Role } from '@maintix/shared-types';

export default function PropertiesPage() {
  const { user } = useAuth();
  const { data: properties, isLoading } = useProperties();
  const createProperty = useCreateProperty();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<{ id: string; name: string; address: string } | null>(null);

  // Create hooks at component level
  const updateProperty = useUpdateProperty(selectedProperty?.id || '');
  const deleteProperty = useDeleteProperty(selectedProperty?.id || '');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreatePropertyFormData>({
    resolver: zodResolver(createPropertySchema),
  });

  // Edit form
  const editForm = useForm<CreatePropertyFormData>({
    resolver: zodResolver(createPropertySchema),
    defaultValues: { name: '', address: '' },
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

  const handleEdit = (property: { id: string; name: string; address: string }) => {
    setSelectedProperty(property);
    editForm.reset({ name: property.name, address: property.address });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async (data: CreatePropertyFormData) => {
    if (!selectedProperty) return;
    try {
      await updateProperty.mutateAsync(data);
      toast({ title: 'Property updated successfully' });
      setEditDialogOpen(false);
      setSelectedProperty(null);
    } catch (err: unknown) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'An error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteClick = (property: { id: string; name: string; address: string }) => {
    setSelectedProperty(property);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProperty) return;
    try {
      await deleteProperty.mutateAsync();
      toast({ title: 'Property deleted successfully' });
      setDeleteDialogOpen(false);
      setSelectedProperty(null);
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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Properties</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage your buildings and units.</p>
        </div>
        {isManager && (
          <Button onClick={() => setDialogOpen(true)} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[140px] rounded-lg" />
          ))}
        </div>
      ) : properties && properties.length > 0 ? (
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <div key={property.id} className="group relative">
              <Link href={`/dashboard/properties/${property.id}`}>
                <Card className="cursor-pointer transition-all hover:border-primary/50 hover:shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm sm:text-base truncate">{property.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">{property.address}</p>
                  </CardContent>
                </Card>
              </Link>
              {isManager && (
                <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 sm:opacity-100 sm:group-hover:opacity-100">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleEdit(property);
                    }}
                    aria-label="Edit property"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-error-500 hover:text-error-600 hover:bg-error-500/10"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteClick(property);
                    }}
                    aria-label="Delete property"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <EmptyState
            illustration="properties"
            title="No properties"
            description={
              isManager
                ? 'Add your first property to get started.'
                : 'Ask your manager to add you to a property.'
            }
          />
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
              <Label htmlFor="name">
                Name <span className="text-error-500">*</span>
              </Label>
              <Input id="name" placeholder="Sunrise Apartments" {...register('name')} />
              {errors.name && <p className="text-sm text-error-500">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">
                Address <span className="text-error-500">*</span>
              </Label>
              <Input id="address" placeholder="123 Main St, City, State" {...register('address')} />
              {errors.address && <p className="text-sm text-error-500">{errors.address.message}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Property'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Property Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Property</DialogTitle>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">
                Name <span className="text-error-500">*</span>
              </Label>
              <Input id="edit-name" placeholder="Sunrise Apartments" {...editForm.register('name')} />
              {editForm.formState.errors.name && (
                <p className="text-sm text-error-500">{editForm.formState.errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-address">
                Address <span className="text-error-500">*</span>
              </Label>
              <Input id="edit-address" placeholder="123 Main St, City, State" {...editForm.register('address')} />
              {editForm.formState.errors.address && (
                <p className="text-sm text-error-500">{editForm.formState.errors.address.message}</p>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={editForm.formState.isSubmitting}>
                {editForm.formState.isSubmitting ? 'Updating...' : 'Update Property'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Property Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Property?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the property &quot;
              {selectedProperty?.name}&quot; and all associated data including tickets, members, and categories.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedProperty(null)}>Cancel</AlertDialogCancel>
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
