import { auth } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

import { db } from '@/db'
import { users } from '@/db/schema'

export const GET = async () => {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, userId))

  if (!existingUser) {
    redirect('/sign-in')
  }

  return redirect(`/users/${existingUser.id}`)
}
