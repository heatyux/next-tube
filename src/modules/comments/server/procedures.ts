import { eq, getTableColumns } from 'drizzle-orm'
import { z } from 'zod'

import { db } from '@/db'
import { comments, users } from '@/db/schema'
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from '@/trpc/init'

export const commentsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ videoId: z.uuid(), value: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user
      const { videoId, value } = input

      const [createdComment] = await db
        .insert(comments)
        .values({ videoId, value, userId })
        .returning()

      return createdComment
    }),
  getMany: baseProcedure
    .input(z.object({ videoId: z.uuid() }))
    .query(async ({ input }) => {
      const { videoId } = input

      const commentsData = await db
        .select({
          ...getTableColumns(comments),
          user: users,
        })
        .from(comments)
        .where(eq(comments.videoId, videoId))
        .innerJoin(users, eq(users.id, comments.userId))

      return commentsData
    }),
})
