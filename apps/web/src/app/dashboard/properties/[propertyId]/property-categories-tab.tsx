'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tag, Plus } from 'lucide-react';
import { useCategories, useCreateCategory } from '@/hooks/use-categories';
import { createCategorySchema, type CreateCategoryFormData } from '@/lib/validations';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface PropertyCategoriesTabProps {
  propertyId: string;
  isManager: boolean;
}

export function PropertyCategoriesTab({ propertyId, isManager }: PropertyCategoriesTabProps) {
  const { data: categories } = useCategories(propertyId);
  const createCategory = useCreateCategory(propertyId);
  const { toast } = useToast();

  const [catDialogOpen, setCatDialogOpen] = useState(false);

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

  if (!categories || categories.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Tag className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <h3 className="mb-1 text-lg font-medium">No categories yet</h3>
          <p className="text-sm text-muted-foreground text-center">
            Create categories to organize tickets for this property.
          </p>
          {isManager && (
            <Button className="mt-4" onClick={() => setCatDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Badge key={cat.id} variant="secondary" className="px-3 py-1.5 text-sm">
            <Tag className="mr-1.5 h-3.5 w-3.5" />
            {cat.name}
          </Badge>
        ))}
      </div>

      {/* Add Category Dialog */}
      {isManager && (
        <Dialog open={catDialogOpen} onOpenChange={setCatDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Category</DialogTitle>
              <DialogDescription>
                Create a new ticket category for this property.
              </DialogDescription>
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
      )}
    </>
  );
}
