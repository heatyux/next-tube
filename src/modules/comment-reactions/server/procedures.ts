import { and, eq } from 'drizzle-orm'
import z from 'zod'

import { db } from '@/db'
import { commentReactions } from '@/db/schema'
import { createTRPCRouter, protectedProcedure } from '@/trpc/init'

export const commentReactionsRouter = createTRPCRouter({
  like: protectedProcedure
    .input(
      z.object({
        commentId: z.uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user
      const { commentId } = input

      const [existingCommentReactionLike] = await db
        .select()
        .from(commentReactions)
        .where(
          and(
            eq(commentReactions.commentId, commentId),
            eq(commentReactions.userId, userId),
            eq(commentReactions.type, 'like'),
          ),
        )

      if (existingCommentReactionLike) {
        const [deletedCommentReaction] = await db
          .delete(commentReactions)
          .where(
            and(
              eq(commentReactions.commentId, commentId),
              eq(commentReactions.userId, userId),
            ),
          )
          .returning()

        return deletedCommentReaction
      }

      const [createdCommentReactionLike] = await db
        .insert(commentReactions)
        .values({
          userId,
          commentId,
          type: 'like',
        })
        .onConflictDoUpdate({
          target: [commentReactions.commentId, commentReactions.userId],
          set: {
            type: 'like',
          },
        })
        .returning()

      return createdCommentReactionLike
    }),
  dislike: protectedProcedure
    .input(
      z.object({
        commentId: z.uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user
      const { commentId } = input

      const [existingCommentReactionDislike] = await db
        .select()
        .from(commentReactions)
        .where(
          and(
            eq(commentReactions.commentId, commentReactions.commentId),
            eq(commentReactions.userId, commentReactions.userId),
            eq(commentReactions.type, 'dislike'),
          ),
        )

      if (existingCommentReactionDislike) {
        const [deletedCommentReactionDislike] = await db
          .delete(commentReactions)
          .where(
            and(
              eq(commentReactions.commentId, commentId),
              eq(commentReactions.userId, userId),
            ),
          )
          .returning()

        return deletedCommentReactionDislike
      }

      const [createdCommentReactionDislike] = await db
        .insert(commentReactions)
        .values({
          commentId,
          userId,
          type: 'dislike',
        })
        .onConflictDoUpdate({
          target: [commentReactions.commentId, commentReactions.userId],
          set: {
            type: 'dislike',
          },
        })
        .returning()

      return createdCommentReactionDislike
    }),
})
