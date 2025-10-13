import { TRPCError } from '@trpc/server'
import { and, eq, getTableColumns, inArray, isNotNull } from 'drizzle-orm'
import { UTApi } from 'uploadthing/server'
import z from 'zod'

import { db } from '@/db'
import {
  subscriptions,
  users,
  videoReactions,
  videoUpdateSchema,
  videoViews,
  videos,
} from '@/db/schema'
import { mux } from '@/lib/mux'
import { workflow } from '@/lib/workflow'
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from '@/trpc/init'

export const videosRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(z.object({ id: z.uuid() }))
    .query(async ({ ctx, input }) => {
      const { clerkUserId } = ctx

      let userId

      const [user] = await db
        .select()
        .from(users)
        .where(inArray(users.clerkId, clerkUserId ? [clerkUserId] : []))

      if (user) {
        userId = user.id
      }

      // Common Table Expressions
      const viewerReactions = db.$with('viewerReactions').as(
        db
          .select({
            videoId: videoReactions.videoId,
            type: videoReactions.type,
          })
          .from(videoReactions)
          .where(inArray(videoReactions.userId, userId ? [userId] : [])),
      )

      const viewerSubscriptions = db.$with('viewerSubscriptions').as(
        db
          .select()
          .from(subscriptions)
          .where(inArray(subscriptions.viewerId, userId ? [userId] : [])),
      )

      const [existingVideo] = await db
        .with(viewerReactions, viewerSubscriptions)
        .select({
          ...getTableColumns(videos),
          user: {
            ...getTableColumns(users),
            subscriberCount: db.$count(
              subscriptions,
              eq(subscriptions.creatorId, users.id),
            ),
            viewerSubcribed: isNotNull(viewerSubscriptions.viewerId).mapWith(
              Boolean,
            ),
          },
          videoViews: db.$count(videoViews, eq(videoViews.videoId, videos.id)),
          likeCount: db.$count(
            videoReactions,
            and(
              eq(videoReactions.videoId, videos.id),
              eq(videoReactions.type, 'like'),
            ),
          ),
          dislikeCount: db.$count(
            videoReactions,
            and(
              eq(videoReactions.videoId, videos.id),
              eq(videoReactions.type, 'dislike'),
            ),
          ),
          viewerReaction: viewerReactions.type,
        })
        .from(videos)
        .innerJoin(users, eq(videos.userId, users.id))
        .leftJoin(viewerReactions, eq(videos.id, viewerReactions.videoId))
        .leftJoin(
          viewerSubscriptions,
          eq(users.id, viewerSubscriptions.creatorId),
        )
        .where(eq(videos.id, input.id))
      // .limit(1)

      // .groupBy(videos.id, users.id, videoReactions.type)

      if (!existingVideo) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      return existingVideo
    }),
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const { id: userId } = ctx.user

    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        passthrough: userId,
        playback_policies: ['public'],
        inputs: [
          {
            generated_subtitles: [
              {
                language_code: 'en',
                name: 'English',
              },
            ],
          },
        ],
      },
      cors_origin: '*', // TODO: In production, set to the application's url
    })

    const [video] = await db
      .insert(videos)
      .values({
        userId,
        title: 'Untitled',
        muxStatus: 'waiting',
        muxUploadId: upload.id,
      })
      .returning()

    return { video, url: upload.url }
  }),
  update: protectedProcedure
    .input(videoUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user
      const { id, title, description, thumbnailUrl, categoryId, visibility } =
        input

      if (!id) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Video ID is required',
        })
      }

      const [updateVideo] = await db
        .update(videos)
        .set({
          title,
          description,
          thumbnailUrl,
          categoryId,
          visibility,
        })
        .where(and(eq(videos.id, id), eq(videos.userId, userId)))
        .returning()

      if (!updateVideo) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Video could not be updated',
        })
      }

      return updateVideo
    }),
  remove: protectedProcedure
    .input(
      z.object({
        id: z.uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user

      const [removeVideo] = await db
        .delete(videos)
        .where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
        .returning()

      if (!removeVideo) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Video not found' })
      }

      return removeVideo
    }),
  restoreThumbnail: protectedProcedure
    .input(z.object({ id: z.uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user

      const [existingVideo] = await db
        .select()
        .from(videos)
        .where(and(eq(videos.id, input.id), eq(videos.userId, userId)))

      if (!existingVideo) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Video not found' })
      }

      if (existingVideo.thumbnailKey) {
        const utApi = new UTApi()

        await utApi.deleteFiles(existingVideo.thumbnailKey)

        await db
          .update(videos)
          .set({ thumbnailKey: null, thumbnailUrl: null })
          .where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
      }

      if (!existingVideo.muxPlaybackId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Video does not have a playback ID',
        })
      }

      const tempThumbnailUrl = `https://image.mux.com/${existingVideo.muxPlaybackId}/thumbnail.png`

      const utApi = new UTApi()
      const uploadedThumbnail = await utApi.uploadFilesFromUrl(tempThumbnailUrl)

      if (!uploadedThumbnail.data) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
      }

      const { key: thumbnailKey, ufsUrl: thumbnailUrl } = uploadedThumbnail.data

      const [updatedVideo] = await db
        .update(videos)
        .set({ thumbnailUrl, thumbnailKey })
        .where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
        .returning()

      return updatedVideo
    }),
  generateTitle: protectedProcedure
    .input(z.object({ id: z.uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user
      const { workflowRunId } = await workflow.trigger({
        url: `${process.env.NEXT_PUBLIC_APP_URL}/api/videos/workflows/title`,
        body: { userId, videoId: input.id },
      })

      return workflowRunId
    }),
  generateDescription: protectedProcedure
    .input(z.object({ id: z.uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user
      const { workflowRunId } = await workflow.trigger({
        url: `${process.env.NEXT_PUBLIC_APP_URL}/api/videos/workflows/description`,
        body: { userId, videoId: input.id },
      })

      return workflowRunId
    }),
})
