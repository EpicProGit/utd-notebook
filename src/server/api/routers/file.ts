import { TRPCError } from '@trpc/server';
import { eq, ilike } from 'drizzle-orm';
import { z } from 'zod';
import { file as files } from '@src/server/db/schema/file';
import { createFileSchema, editFileSchema } from '@src/utils/formSchemas';
import { callStorageAPI } from '@src/utils/storage';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';

const byIdSchema = z.object({
  id: z.string().default(''),
});

const byNameSchema = z.object({
  name: z.string().default(''),
  sortByDate: z.boolean().default(false),
});

export const fileRouter = createTRPCRouter({
  byId: publicProcedure.input(byIdSchema).query(async ({ input, ctx }) => {
    const { id } = input;

    try {
      const byId = await ctx.db.query.file.findFirst({
        where: (file) => eq(file.id, id),
        with: { section: true },
      });

      return byId;
    } catch (e) {
      console.error(e);

      throw e;
    }
  }),
  create: protectedProcedure
    .input(createFileSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;

      const res = await ctx.db
        .insert(files)
        .values({
          ...input,
          authorId: userId,
          sectionId: 'UxE9VWvMkXd0Ca8iBbh6', /// TODO: Link
          publicUrl: 'https://example.com', // This must be filled in with an update call right after the create call
        })
        .returning({ id: files.id });

      const newFile = res[0];
      if (!newFile)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to add event',
        });
      return newFile.id;
    }),
  update: protectedProcedure
    .input(editFileSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, file: publicUrl, ...data } = input;
      const userId = ctx.session.user.id;

      const file = await ctx.db.query.file.findFirst({
        where: (file) => eq(file.id, input.id),
      });

      if (!file) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'File not found' });
      }

      const isAuthor = file.authorId === userId;
      if (!isAuthor) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const res = await ctx.db
        .update(files)
        .set({
          ...data,
          publicUrl,
          updatedAt: new Date(),
        })
        .where(eq(files.id, id))
        .returning({ id: files.id });

      if (res.length == 0)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update event',
        });
      return res[0]?.id;
    }),
  delete: protectedProcedure
    .input(byIdSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;

      const file = await ctx.db.query.file.findFirst({
        where: (file) => eq(file.id, input.id),
      });

      if (!file) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'File not found' });
      }

      const isAuthor = file.authorId === userId;
      if (!isAuthor) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      await callStorageAPI('DELETE', file.id);

      await ctx.db.delete(files).where(eq(files.id, input.id));

      return { success: true };
    }),
  byName: publicProcedure.input(byNameSchema).query(async ({ input, ctx }) => {
    const { name, sortByDate } = input;
    try {
      const files = await ctx.db.query.file.findMany({
        where: (file) => ilike(file.name, `%${name}%`),
        orderBy: sortByDate
          ? (file, { desc }) => [desc(file.updatedAt)]
          : undefined,
        with: {
          section: true,
        },
      });

      return files;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }),
});
