import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  useQueries,
} from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { ActivityAction } from '@maintix/shared-types';
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
  search?: string;
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
    queryFn: async () => {
      const result = await api.get<TicketsResponse | Ticket[]>(
        `/properties/${propertyId}/tickets${buildQueryString(params)}`,
      );
      // The TransformInterceptor passes {data,meta} responses through as-is,
      // and api-client does result.data — so we may receive the raw Ticket[]
      // OR a TicketsResponse depending on exact response shape.
      if (Array.isArray(result)) {
        return { data: result, meta: { hasMore: false, nextCursor: null } };
      }
      return result as TicketsResponse;
    },
    enabled: !!propertyId,
  });
}

export function useInfiniteTickets(propertyId: string, params: TicketQueryParams = {}) {
  return useInfiniteQuery({
    queryKey: ['tickets', 'infinite', propertyId, params],
    queryFn: async ({ pageParam }) => {
      const merged = pageParam ? { ...params, cursor: pageParam } : params;
      const result = await api.get<TicketsResponse | Ticket[]>(
        `/properties/${propertyId}/tickets${buildQueryString(merged)}`,
      );
      // Normalize: api-client may return raw array if interceptor passes through
      if (Array.isArray(result)) {
        return { data: result, meta: { hasMore: false, nextCursor: null } };
      }
      return result as TicketsResponse;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.meta?.hasMore ? (lastPage.meta.nextCursor ?? undefined) : undefined,
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
    mutationFn: async (data: {
      title: string;
      description: string;
      categoryId: string;
      priority?: Priority;
      propertyId?: string;
      files?: File[];
    }) => {
      // Use provided propertyId or fall back to the hook's propertyId
      const targetPropertyId = data.propertyId || propertyId;

      // Extract propertyId and files from the data - don't send propertyId in body
      const { propertyId: _propertyId, files, ...ticketData } = data;
      const ticket = await api.post<Ticket>(
        `/properties/${targetPropertyId}/tickets`,
        ticketData,
      );

      // Upload attachments sequentially after ticket creation
      if (files && files.length > 0 && ticket?.id) {
        for (const file of files) {
          const formData = new FormData();
          formData.append('file', file);
          await api.upload(
            `/properties/${targetPropertyId}/tickets/${ticket.id}/attachments`,
            formData,
          );
        }
      }

      return ticket;
    },
    onSuccess: (_, variables) => {
      const targetPropertyId = variables.propertyId || propertyId;
      queryClient.invalidateQueries({ queryKey: ['tickets', targetPropertyId] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
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
    }) => api.patch<Ticket>(`/tickets/${ticketId}/priority`, { priority, version }),
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
    }) => api.patch<Ticket>(`/tickets/${ticketId}/reassign`, { technicianId, version }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['tickets', 'detail', variables.ticketId] });
    },
  });
}

/**
 * Fetch tickets across all properties by issuing parallel queries per property.
 * Merges and sorts results client-side.
 */
export function useAllPropertyTickets(propertyIds: string[], params: TicketQueryParams = {}) {
  const queries = useQueries({
    queries: propertyIds.map((propertyId) => ({
      queryKey: ['tickets', propertyId, params],
      queryFn: async () => {
        const result = await api.get<TicketsResponse | Ticket[]>(
          `/properties/${propertyId}/tickets${buildQueryString(params)}`,
        );
        // Normalize: api-client may return raw array if interceptor passes through
        if (Array.isArray(result)) {
          return { data: result, meta: { hasMore: false, nextCursor: null } };
        }
        return result as TicketsResponse;
      },
      enabled: propertyIds.length > 0,
    })),
  });

  const isLoading = queries.some((q) => q.isLoading);
  const isError = queries.some((q) => q.isError);

  const tickets = queries
    .flatMap((q) => {
      const data = q.data;
      if (!data) return [];
      // data might be TicketsResponse or raw array depending on cache state
      if (Array.isArray(data)) return data;
      return data.data ?? [];
    })
    .filter((ticket): ticket is Ticket => ticket !== undefined && ticket !== null)
    .sort((a, b) => {
      const dir = params.sortDir === 'asc' ? 1 : -1;
      const field = params.sortBy || 'createdAt';
      if (field === 'priority') {
        const order: Record<string, number> = { LOW: 0, MEDIUM: 1, HIGH: 2, URGENT: 3 };
        return dir * ((order[a.priority] ?? 0) - (order[b.priority] ?? 0));
      }
      return (
        dir *
        (new Date(a[field as 'createdAt' | 'updatedAt'] ?? a.createdAt).getTime() -
          new Date(b[field as 'createdAt' | 'updatedAt'] ?? b.createdAt).getTime())
      );
    });

  return { tickets, isLoading, isError };
}

// === Activity types & hook ===

interface ActivityActor {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface TicketActivity {
  id: string;
  ticketId: string;
  action: ActivityAction;
  previousValue: Record<string, unknown> | null;
  newValue: Record<string, unknown> | null;
  createdAt: string;
  actor: ActivityActor;
}

interface ActivitiesResponse {
  data: TicketActivity[];
  meta: { hasMore: boolean; nextCursor: string | null };
}

export function useTicketActivities(ticketId: string) {
  return useInfiniteQuery({
    queryKey: ['tickets', ticketId, 'activity'],
    queryFn: async ({ pageParam }) => {
      const params = pageParam ? `?cursor=${pageParam}` : '';
      const result = await api.get<ActivitiesResponse | TicketActivity[]>(
        `/tickets/${ticketId}/activity${params}`,
      );
      // Normalize: api-client may return raw array if interceptor passes through
      if (Array.isArray(result)) {
        return { data: result, meta: { hasMore: false, nextCursor: null } };
      }
      return result as ActivitiesResponse;
    },
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.meta?.nextCursor ?? undefined,
    enabled: !!ticketId,
  });
}

export type {
  Ticket,
  TicketUser,
  TicketsResponse,
  TicketQueryParams,
  TicketActivity,
  ActivityActor,
};
