import { useAuth } from '@clerk/nextjs'
import Link from 'next/link'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { UserAvatar } from '@/components/user-avatar'
import { userSelectSchema } from '@/db/schema'
import { SubscriptionButton } from '@/modules/subscriptions/ui/components/subscription-button'

interface VideoOwnerProps {
  user: z.infer<typeof userSelectSchema>
  videoId: string
}

export const VideoOwner = ({ user, videoId }: VideoOwnerProps) => {
  const { userId } = useAuth()

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
      {userId === user.clerkId ? (
        <Button variant="secondary" className="rounded-full" asChild>
          <Link href={`/studio/videos/${videoId}`}>Edit Video</Link>
        </Button>
      ) : (
        <SubscriptionButton
          disabled={false}
          isSubscribed={false}
          size="default"
          onClick={() => {}}
          className="flex-none"
        />
      )}
    </div>
  )
}
