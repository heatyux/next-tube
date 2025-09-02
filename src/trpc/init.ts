import { cache } from 'react'

import { auth } from '@clerk/nextjs/server'
import { TRPCError, initTRPC } from '@trpc/server'
import { eq } from 'drizzle-orm'
import superjson from 'superjson'

import { db } from '@/db'
import { users } from '@/db/schema'

export const createTRPCContext = cache(async () => {
  const { userId } = await auth()

  return { clerkUserId: userId }
})

export type Context = Awaited<ReturnType<typeof createTRPCContext>>

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Context>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
})
// Base router and procedure helpers
export const createTRPCRouter = t.router
export const createCallerFactory = t.createCallerFactory
export const baseProcedure = t.procedure
export const protectedProcedure = t.procedure.use(
  async function isAuthed(opts) {
    const { ctx } = opts

    if (!ctx.clerkUserId) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You must be signed in to do this.',
      })
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, ctx.clerkUserId))
      .limit(1)
      .then((res) => res[0])

    if (!user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: "User doesn't exist in the database.",
      })
    }

    return opts.next({
      ctx: {
        ...ctx,
        user,
      },
    })
  },
)
