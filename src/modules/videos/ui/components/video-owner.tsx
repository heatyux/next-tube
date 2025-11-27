import { useAuth } from '@clerk/nextjs'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { UserAvatar } from '@/components/user-avatar'
import { useSubscription } from '@/modules/subscriptions/hooks/use-subscription'
import { SubscriptionButton } from '@/modules/subscriptions/ui/components/subscription-button'
import { UserInfo } from '@/modules/users/ui/components/user-info'

import { VideoGetOneOutput } from '../../types'

interface VideoOwnerProps {
  user: VideoGetOneOutput['user']
  videoId: string
}

export const VideoOwner = ({ user, videoId }: VideoOwnerProps) => {
  const { userId, isLoaded } = useAuth()

  const { isPending, onClick } = useSubscription({
    userId: user.id,
    isSubscribed: user.viewerSubcribed,
    fromVideoId: videoId,
  })

  return (
    <div className="flex min-w-0 items-center justify-between gap-3 sm:items-start sm:justify-start">
      <Link prefetch href={`/users/${user.id}`}>
        <div className="flex min-w-0 items-center gap-3">
          <UserAvatar imageUrl={user.imageUrl} name={user.name} size="lg" />
          <div className="flex min-w-0 flex-col gap-1">
            <UserInfo size="default" name={user.name} />
            <span className="text-muted-foreground line-clamp-1 text-sm">
              {user.subscriberCount}{' '}
              {user.subscriberCount >= 1 ? 'subscribers' : 'subscriber'}
            </span>
          </div>
        </div>
      </Link>
      {userId === user.clerkId ? (
        <Button variant="secondary" className="rounded-full" asChild>
          <Link prefetch href={`/studio/videos/${videoId}`}>
            Edit Video
          </Link>
        </Button>
      ) : (
        <SubscriptionButton
          disabled={isPending || !isLoaded}
          isSubscribed={user.viewerSubcribed}
          size="default"
          onClick={onClick}
          className="flex-none"
        />
      )}
    </div>
  )
}
