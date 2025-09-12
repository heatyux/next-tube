import { TRPCError } from '@trpc/server'
import { and, eq } from 'drizzle-orm'
import z from 'zod'

import { db } from '@/db'
import { videoUpdateSchema, videos } from '@/db/schema'
import { mux } from '@/lib/mux'
import { createTRPCRouter, protectedProcedure } from '@/trpc/init'

export const videosRouter = createTRPCRouter({
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
    }),
})
