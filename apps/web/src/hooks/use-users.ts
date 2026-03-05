import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export function useUsers(search?: string) {
  return useQuery({
    queryKey: ['users', search],
    queryFn: () => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      const qs = params.toString();
      return api.get<User[]>(`/users${qs ? `?${qs}` : ''}`);
    },
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      email: string;
      firstName: string;
      lastName: string;
      password: string;
      role: string;
    }) => api.post<User>('/users', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export type { User };
