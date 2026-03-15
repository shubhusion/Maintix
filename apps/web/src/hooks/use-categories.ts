import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

interface Category {
  id: string;
  name: string;
  propertyId: string;
  createdAt: string;
}

export function useCategories(propertyId: string) {
  return useQuery({
    queryKey: ['categories', propertyId],
    queryFn: () => api.get<Category[]>(`/properties/${propertyId}/categories`),
    enabled: !!propertyId,
  });
}

export function useAllCategories(propertyIds: string[]) {
  return useQuery({
    queryKey: ['categories', 'all', propertyIds],
    queryFn: async () => {
      const results = await Promise.all(
        propertyIds.map((id) => api.get<Category[]>(`/properties/${id}/categories`)),
      );
      // Flatten and deduplicate by category id
      const allCategories = results.flat();
      const unique = Array.from(
        new Map(allCategories.map((c) => [c.id, c])).values(),
      );
      return unique.sort((a, b) => a.name.localeCompare(b.name));
    },
    enabled: propertyIds.length > 0,
  });
}

export function useCreateCategory(propertyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string }) =>
      api.post<Category>(`/properties/${propertyId}/categories`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', propertyId] });
    },
  });
}

export type { Category };
