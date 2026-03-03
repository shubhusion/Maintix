// ================================
// Maintix Shared Types
// ================================

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    hasMore: boolean;
    nextCursor: string | null;
    total?: number;
  };
}

export interface ApiResponse<T> {
  data: T;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  errorCode: string;
  timestamp: string;
  requestId?: string;
}
