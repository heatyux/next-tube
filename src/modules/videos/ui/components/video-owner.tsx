import Link from 'next/link'
import { z } from 'zod'

import { UserAvatar } from '@/components/user-avatar'
import { userSelectSchema } from '@/db/schema'

interface VideoOwnerProps {
  user: z.infer<typeof userSelectSchema>
  videoId: string
}

export const VideoOwner = ({ user }: VideoOwnerProps) => {
  return (
    <div className="flex min-w-0 items-center justify-between gap-3 sm:items-start sm:justify-start">
      <Link href={`/users/${user.id}`}>
        <div className="flex min-w-0 items-center gap-3">
          <UserAvatar imageUrl={user.imageUrl} name={user.name} size="lg" />
          <span className="text-muted-foreground line-clamp-1 text-sm">
            {/* TODO: Properly fill in the subscribers */}
            {0} Subscribers
          </span>
        </div>
      </Link>
    </div>
  )
}
