// Shared Constants for Maintix API
// Auto-copied from packages/shared-types for standalone builds

export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_ATTACHMENTS_PER_TICKET = 5;
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
export const ALLOWED_FILE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];

export const RATE_LIMITS = {
  LOGIN: { ttl: 60_000, limit: 5 },
  TICKET_CREATION: { ttl: 60_000, limit: 10 },
  GENERAL: { ttl: 60_000, limit: 30 },
} as const;

export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 50,
} as const;

export const STORAGE_BUCKET = 'ticket-attachments';
