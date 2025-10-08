import { z } from 'zod';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { userMetadata } from './schema/user';
import { section } from './schema/section';
import { file } from './schema/file';

// Schema types for userMetadata
export const insertUserMetadata = createInsertSchema(userMetadata);
export const selectUserMetadata = createSelectSchema(userMetadata);
export type InsertUserMetadata = z.infer<typeof insertUserMetadata>;
export type SelectUserMetadata = z.infer<typeof selectUserMetadata>;

// Schema types for section
export const insertSection = createInsertSchema(section);
export const selectSection = createSelectSchema(section);
export type InsertSection = z.infer<typeof insertSection>;
export type SelectSection = z.infer<typeof selectSection>;

// Schema types for file
export const insertFile = createInsertSchema(file);
export const selectFile = createSelectSchema(file);
export type InsertFile = z.infer<typeof insertFile>;
export type SelectFile = z.infer<typeof selectFile>;

export const sectionWithFiles = selectSection.extend({
  files: z.array(selectFile),
});
export type SectionWithFiles = z.infer<typeof sectionWithFiles>;
