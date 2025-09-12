import { TRPCError } from '@trpc/server'
import { and, desc, eq, lt, or } from 'drizzle-orm'
import { z } from 'zod'

import { db } from '@/db'
import { videos } from '@/db/schema'
import { createTRPCRouter, protectedProcedure } from '@/trpc/init'

export const studioRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.uuid() }))
    .query(async ({ ctx, input }) => {
      const { id: userId } = ctx.user
      const { id } = input

      const [video] = await db
        .select()
        .from(videos)
        .where(and(eq(videos.id, id), eq(videos.userId, userId)))

      if (!video) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Video not found' })
      }

      return video
    }),
  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { id: userId } = ctx.user
      const { cursor, limit } = input

      const data = await db
        .select()
        .from(videos)
        .where(
          and(
            eq(videos.userId, userId),
            cursor
              ? or(
                  lt(videos.updatedAt, cursor.updatedAt),
                  and(
                    eq(videos.updatedAt, cursor.updatedAt),
                    lt(videos.id, cursor.id),
                  ),
                )
              : undefined,
          ),
        )
        .orderBy(desc(videos.updatedAt), desc(videos.id))
        .limit(limit + 1) // check if more data

      const hasMore = data.length > limit

      // Remove the last item if there is more data
      const items = hasMore ? data.slice(0, -1) : data

      // Set the next cursor to the last item if there is more data
      const lastItem = items[items.length - 1]
      const nextCursor = hasMore
        ? { id: lastItem.id, updatedAt: lastItem.updatedAt }
        : null

      return { items, nextCursor }
    }),
})
