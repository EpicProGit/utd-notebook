import { z } from 'zod';

export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const ACCEPTED_FILE_TYPES = ['application/pdf'];
const fileSchema = z
  .file('File required')
  .refine(
    (file) => !file || ACCEPTED_FILE_TYPES.includes(file.type),
    'Only PDF format is supported',
  )
  .refine(
    (file) => !file || file.size <= MAX_FILE_SIZE,
    'Max image size is 5MB',
  );

export const createFileFormSchema = z.object({
  file: fileSchema,
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Character limit reached'),
  description: z.string().max(1000, 'Character limit reached').optional(),
});

export const createFileSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Character limit reached'),
  description: z.string().max(1000, 'Character limit reached').optional(),
});

export const editFileFormSchema = z.object({
  id: z.string(),
  file: fileSchema,
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Character limit reached'),
  description: z.string().max(1000, 'Character limit reached').optional(),
});

export const editFileSchema = z.object({
  id: z.string(),
  file: z.url(),
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Character limit reached'),
  description: z.string().max(1000, 'Character limit reached').optional(),
});
