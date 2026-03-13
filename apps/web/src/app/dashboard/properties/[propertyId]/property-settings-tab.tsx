'use client';

import { Building2, MapPin, Trash2, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface Property {
  id: string;
  name: string;
  address: string;
  createdAt: string;
  updatedAt?: string;
}
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const updatePropertySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
});

type UpdatePropertyFormData = z.infer<typeof updatePropertySchema>;

interface PropertySettingsTabProps {
  propertyId: string;
  property: Property;
}

export function PropertySettingsTab({ property }: PropertySettingsTabProps) {
  const { toast } = useToast();

  const form = useForm<UpdatePropertyFormData>({
    resolver: zodResolver(updatePropertySchema),
    defaultValues: {
      name: property.name,
      address: property.address,
    },
  });

  const onSubmit = async (_data: UpdatePropertyFormData) => {
    try {
      // TODO: Implement API call to update property
      toast({
        title: 'Property updated',
        description: 'Property details have been updated successfully.',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update property.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    // TODO: Implement property deletion
    toast({
      title: 'Not implemented',
      description: 'Property deletion is not yet available.',
      variant: 'destructive',
    });
  };

  return (
    <div className="space-y-6">
      {/* Edit Property Card */}
      <Card>
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
          <CardDescription>Update the name and address of this property.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Property Name <span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  className="pl-10"
                  {...form.register('name')}
                />
              </div>
              {form.formState.errors.name && (
                <p className="text-sm text-error-500">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">
                Address <span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="address"
                  className="pl-10"
                  {...form.register('address')}
                />
              </div>
              {form.formState.errors.address && (
                <p className="text-sm text-error-500">{form.formState.errors.address.message}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-error-500/20">
        <CardHeader>
          <CardTitle className="text-error-500">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible actions related to this property.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Delete Property</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete this property and all associated data.
              </p>
            </div>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
