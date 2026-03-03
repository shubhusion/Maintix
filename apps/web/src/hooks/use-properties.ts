import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

interface Property {
  id: string;
  name: string;
  address: string;
  createdAt: string;
}

interface PropertyMember {
  userId: string;
  user: { id: string; firstName: string; lastName: string; email: string; role: string };
}

export function useProperties() {
  return useQuery({
    queryKey: ['properties'],
    queryFn: () => api.get<Property[]>('/properties'),
  });
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: ['properties', id],
    queryFn: () => api.get<Property>(`/properties/${id}`),
    enabled: !!id,
  });
}

export function usePropertyMembers(propertyId: string) {
  return useQuery({
    queryKey: ['properties', propertyId, 'members'],
    queryFn: () =>
      api.get<PropertyMember[]>(`/properties/${propertyId}/members`),
    enabled: !!propertyId,
  });
}

export function useCreateProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; address: string }) =>
      api.post<Property>('/properties', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

export function useUpdateProperty(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name?: string; address?: string }) =>
      api.patch<Property>(`/properties/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

export function useAddMember(propertyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { userId: string }) =>
      api.post(`/properties/${propertyId}/members`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['properties', propertyId, 'members'],
      });
    },
  });
}

export function useRemoveMember(propertyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) =>
      api.delete(`/properties/${propertyId}/members/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['properties', propertyId, 'members'],
      });
    },
  });
}
