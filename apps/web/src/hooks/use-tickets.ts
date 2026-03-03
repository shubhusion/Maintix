import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { TicketStatus, Priority } from '@maintix/shared-types';

interface TicketUser {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: Priority;
  version: number;
  createdAt: string;
  updatedAt: string;
  cancellationReason?: string;
  createdBy: TicketUser;
  assignedTo: TicketUser | null;
  category: { id: string; name: string };
  property: { id: string; name: string };
  attachments?: any[];
}

interface TicketsResponse {
  data: Ticket[];
  meta: { hasMore: boolean; nextCursor: string | null };
}

interface TicketQueryParams {
  status?: TicketStatus;
  priority?: Priority;
  categoryId?: string;
  assignedToId?: string;
  createdById?: string;
  sortBy?: string;
  sortDir?: string;
  cursor?: string;
  limit?: number;
}

function buildQueryString(params: TicketQueryParams): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

export function useTickets(propertyId: string, params: TicketQueryParams = {}) {
  return useQuery({
    queryKey: ['tickets', propertyId, params],
    queryFn: () =>
      api.get<TicketsResponse>(
        `/properties/${propertyId}/tickets${buildQueryString(params)}`,
      ),
    enabled: !!propertyId,
  });
}

export function useInfiniteTickets(propertyId: string, params: TicketQueryParams = {}) {
  return useInfiniteQuery({
    queryKey: ['tickets', 'infinite', propertyId, params],
    queryFn: ({ pageParam }) => {
      const merged = pageParam ? { ...params, cursor: pageParam } : params;
      return api.get<TicketsResponse>(
        `/properties/${propertyId}/tickets${buildQueryString(merged)}`,
      );
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.meta?.hasMore ? lastPage.meta.nextCursor ?? undefined : undefined,
    enabled: !!propertyId,
  });
}

export function useTicket(id: string) {
  return useQuery({
    queryKey: ['tickets', 'detail', id],
    queryFn: () => api.get<Ticket>(`/tickets/${id}`),
    enabled: !!id,
  });
}

export function useCreateTicket(propertyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { title: string; description: string; categoryId: string }) =>
      api.post<Ticket>(`/properties/${propertyId}/tickets`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets', propertyId] });
    },
  });
}

export function useAssignTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      ticketId,
      technicianId,
      version,
    }: {
      ticketId: string;
      technicianId: string;
      version: number;
    }) => api.patch<Ticket>(`/tickets/${ticketId}/assign`, { technicianId, version }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['tickets', 'detail', variables.ticketId] });
    },
  });
}

export function useStartWork() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ticketId, version }: { ticketId: string; version: number }) =>
      api.patch<Ticket>(`/tickets/${ticketId}/start`, { version }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['tickets', 'detail', variables.ticketId] });
    },
  });
}

export function useSubmitCompletion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ticketId, version }: { ticketId: string; version: number }) =>
      api.patch<Ticket>(`/tickets/${ticketId}/complete`, { version }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['tickets', 'detail', variables.ticketId] });
    },
  });
}

export function useApproveTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ticketId, version }: { ticketId: string; version: number }) =>
      api.patch<Ticket>(`/tickets/${ticketId}/approve`, { version }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['tickets', 'detail', variables.ticketId] });
    },
  });
}

export function useCancelTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      ticketId,
      reason,
      version,
    }: {
      ticketId: string;
      reason: string;
      version: number;
    }) => api.patch<Ticket>(`/tickets/${ticketId}/cancel`, { reason, version }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['tickets', 'detail', variables.ticketId] });
    },
  });
}

export function useUpdatePriority() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      ticketId,
      priority,
      version,
    }: {
      ticketId: string;
      priority: Priority;
      version: number;
    }) =>
      api.patch<Ticket>(`/tickets/${ticketId}/priority`, { priority, version }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['tickets', 'detail', variables.ticketId] });
    },
  });
}

export function useReassignTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      ticketId,
      technicianId,
      version,
    }: {
      ticketId: string;
      technicianId: string;
      version: number;
    }) =>
      api.patch<Ticket>(`/tickets/${ticketId}/reassign`, { technicianId, version }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['tickets', 'detail', variables.ticketId] });
    },
  });
}

export type { Ticket, TicketUser, TicketsResponse, TicketQueryParams };
