import { useAuth, useClerk } from '@clerk/nextjs'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { UserAvatar } from '@/components/user-avatar'
import { cn } from '@/lib/utils'
import { useSubscription } from '@/modules/subscriptions/hooks/use-subscription'
import { SubscriptionButton } from '@/modules/subscriptions/ui/components/subscription-button'

import { UsersGetOneOutput } from '../../types'

interface UserPageInfoProps {
  user: UsersGetOneOutput
}

export const UserPageInfoSkeleton = () => {
  return (
    <div className="py-6">
      {/* Mobile Layout */}
      <div className="flex flex-col md:hidden">
        <div className="flex items-center gap-6">
          <Skeleton className="size-[60px] rounded-full" />
          <div className="min-w-0 flex-1">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="mt-1 h-6 w-48" />
          </div>
        </div>
        <Skeleton className="mt-3 h-10 w-full rounded-full" />
      </div>

      {/* Desktop Layout */}
      <div className="hidden items-start gap-4 md:flex">
        <Skeleton className="size-[160px] rounded-full" />
        <div className="min-w-0 flex-1">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="mt-4 h-5 w-48" />
          <Skeleton className="mt-3 h-10 w-32" />
        </div>
      </div>
    </div>
  )
}

export const UserPageInfo = ({ user }: UserPageInfoProps) => {
  const clerk = useClerk()
  const { userId, isLoaded } = useAuth()

  const { isPending, onClick } = useSubscription({
    userId: user.id,
    isSubscribed: user.viewerSubscribed,
  })

  return (
    <div className="py-6">
      {/* Mobile Layout */}
      <div className="flex flex-col md:hidden">
        <div className="flex items-center gap-3">
          <UserAvatar
            imageUrl={user.imageUrl}
            name={user.name}
            size="lg"
            className="size-[60px]"
            onClick={() => {
              if (userId === user.clerkId) {
                clerk.openUserProfile()
              }
            }}
          />
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold">{user.name}</h1>
            <div className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
              <span>{user.subscrberCount} subscriptions</span>
              <span>&bull;</span>
              <span>{user.videoCount} videos</span>
            </div>
          </div>
        </div>

        {userId === user.clerkId ? (
          <Button
            variant="secondary"
            className="mt-3 w-full rounded-full"
            asChild
          >
            <Link href="/studio">Go to studio</Link>
          </Button>
        ) : (
          <SubscriptionButton
            disabled={isPending || !isLoaded}
            size="default"
            isSubscribed={user.viewerSubscribed}
            onClick={onClick}
            className="mt-3 w-full"
          />
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden items-start gap-4 md:flex">
        <UserAvatar
          imageUrl={user.imageUrl}
          name={user.name}
          size="xl"
          className={cn(
            userId === user.clerkId
              ? 'cursor-pointer transition-opacity duration-300 hover:opacity-80'
              : '',
          )}
          onClick={() => {
            if (userId === user.clerkId) {
              clerk.openUserProfile()
            }
          }}
        />

        <div className="min-w-0 flex-1">
          <h1 className="text-4xl font-bold capitalize">{user.name}</h1>
          <div className="text-muted-foreground mt-3 flex items-center gap-1 text-sm">
            <span>{user.subscrberCount} subscriptions</span>
            <span>&bull;</span>
            <span>{user.videoCount} videos</span>
          </div>
        </div>

        {userId === user.clerkId ? (
          <Button variant="secondary" className="mt-3 rounded-full" asChild>
            <Link href="/studio">Go to studio</Link>
          </Button>
        ) : (
          <SubscriptionButton
            disabled={isPending || isLoaded}
            size="default"
            isSubscribed={user.viewerSubscribed}
            onClick={onClick}
          />
        )}
      </div>
    </div>
  )
}
