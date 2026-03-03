import { z } from 'zod';
import { Role, Priority } from '@maintix/shared-types';

// === Auth ===

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// === Users ===

export const createUserSchema = z.object({
  email: z.string().email('Enter a valid email'),
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  role: z.enum([Role.TENANT, Role.TECHNICIAN]),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;

// === Properties ===

export const createPropertySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(200),
  address: z.string().min(5, 'Address must be at least 5 characters').max(500),
});

export type CreatePropertyFormData = z.infer<typeof createPropertySchema>;

// === Categories ===

export const createCategorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
});

export type CreateCategoryFormData = z.infer<typeof createCategorySchema>;

// === Tickets ===

export const createTicketSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(5000),
  categoryId: z.string().uuid('Select a category'),
});

export type CreateTicketFormData = z.infer<typeof createTicketSchema>;

export const assignTicketSchema = z.object({
  technicianId: z.string().uuid('Select a technician'),
  version: z.number(),
});

export type AssignTicketFormData = z.infer<typeof assignTicketSchema>;

export const cancelTicketSchema = z.object({
  reason: z
    .string()
    .min(5, 'Reason must be at least 5 characters')
    .max(1000),
  version: z.number(),
});

export type CancelTicketFormData = z.infer<typeof cancelTicketSchema>;

export const updatePrioritySchema = z.object({
  priority: z.nativeEnum(Priority),
  version: z.number(),
});

export type UpdatePriorityFormData = z.infer<typeof updatePrioritySchema>;
