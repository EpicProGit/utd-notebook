import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { type z } from 'zod';
import { file } from './schema/file';
import { userMetadata } from './schema/user';

// Schema definition for file table
export const insertFile = createInsertSchema(file);
export const selectFile = createSelectSchema(file);

export type InsertFile = z.infer<typeof insertFile>;
export type SelectFile = typeof file.$inferSelect;

// Schema types for userMetadata
export const insertUserMetadata = createInsertSchema(userMetadata);
export const selectUserMetadata = createSelectSchema(userMetadata);

export type InsertUserMetadata = z.infer<typeof insertUserMetadata>;
export type SelectUserMetadata = z.infer<typeof selectUserMetadata>;
