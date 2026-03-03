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
