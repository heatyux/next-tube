import { TRPCError } from '@trpc/server'
import {
  and,
  count,
  desc,
  eq,
  getTableColumns,
  inArray,
  isNotNull,
  isNull,
  lt,
  or,
} from 'drizzle-orm'
import { z } from 'zod'

import { db } from '@/db'
import { commentReactions, comments, users } from '@/db/schema'
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from '@/trpc/init'

export const commentsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        videoId: z.uuid(),
        value: z.string(),
        parentId: z.uuid().nullish(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user
      const { videoId, value, parentId } = input

      const [existingComment] = await db
        .select()
        .from(comments)
        .where(inArray(comments.id, parentId ? [parentId] : []))

      if (!existingComment && parentId) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Parent comment not found',
        })
      }

      if (existingComment?.parentId && parentId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Cannot reply to a reply',
        })
      }

      const [createdComment] = await db
        .insert(comments)
        .values({ videoId, value, userId, parentId })
        .returning()

      return createdComment
    }),
  getMany: baseProcedure
    .input(
      z.object({
        videoId: z.uuid(),
        parentId: z.uuid().nullish(),
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
      const { clerkUserId } = ctx
      const { videoId, parentId, cursor, limit } = input

      let userId

      const [user] = await db
        .select()
        .from(users)
        .where(inArray(users.clerkId, clerkUserId ? [clerkUserId] : []))

      if (user) {
        userId = user.id
      }

      const viewerReactions = db.$with('viewer_reactions').as(
        db
          .select({
            commentId: commentReactions.commentId,
            type: commentReactions.type,
          })
          .from(commentReactions)
          .where(inArray(commentReactions.userId, userId ? [userId] : [])),
      )

      const replies = db.$with('replies').as(
        db
          .select({
            parentId: comments.parentId,
            count: count(comments.id).as('count'),
          })
          .from(comments)
          .where(isNotNull(comments.parentId))
          .groupBy(comments.parentId),
      )

      const [totalData, commentsData] = await Promise.all([
        await db
          .select({ count: count() })
          .from(comments)
          .where(and(eq(comments.videoId, videoId), isNull(comments.parentId))),

        await db
          .with(viewerReactions, replies)
          .select({
            ...getTableColumns(comments),
            user: users,
            viewerReaction: viewerReactions.type,
            replyCount: replies.count,
            likeCount: db.$count(
              commentReactions,
              and(
                eq(commentReactions.type, 'like'),
                eq(commentReactions.commentId, comments.id),
              ),
            ),
            dislikeCount: db.$count(
              commentReactions,
              and(
                eq(commentReactions.type, 'dislike'),
                eq(commentReactions.commentId, comments.id),
              ),
            ),
          })
          .from(comments)
          .where(
            and(
              eq(comments.videoId, videoId),
              parentId
                ? eq(comments.parentId, parentId)
                : isNull(comments.parentId),
              cursor
                ? or(
                    lt(comments.updatedAt, cursor.updatedAt),
                    and(
                      eq(comments.updatedAt, cursor.updatedAt),
                      lt(comments.id, cursor.id),
                    ),
                  )
                : undefined,
            ),
          )
          .innerJoin(users, eq(users.id, comments.userId))
          .leftJoin(viewerReactions, eq(comments.id, viewerReactions.commentId))
          .leftJoin(replies, eq(comments.id, replies.parentId))
          .orderBy(desc(comments.updatedAt), desc(comments.id))
          .limit(limit + 1),
      ])

      const hasMore = commentsData.length > limit

      // Remove the last item if there is more
      const items = hasMore ? commentsData.slice(0, -1) : commentsData

      // Set the next cursor to the last item if there is more data
      const lastItem = items[items.length - 1]
      const nextCursor = hasMore
        ? { id: lastItem.id, updatedAt: lastItem.updatedAt }
        : null

      return {
        items,
        nextCursor,
        totalCount: totalData[0].count,
      }
    }),
  remove: protectedProcedure
    .input(z.object({ id: z.uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user
      const { id: commentId } = input

      const [deletedComment] = await db
        .delete(comments)
        .where(and(eq(comments.id, commentId), eq(comments.userId, userId)))
        .returning()

      if (!deletedComment) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Comment not found',
        })
      }

      return deletedComment
    }),
})
