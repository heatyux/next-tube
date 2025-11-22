'use client'

import { Suspense } from 'react'

import Link from 'next/link'
import { ErrorBoundary } from 'react-error-boundary'
import { toast } from 'sonner'

import { InfiniteScroll } from '@/components/infinite-scroll'
import { DEFAULT_LIMIT } from '@/constants'
import { trpc } from '@/trpc/client'

import {
  SubscriptionItem,
  SubscriptionItemSkeleton,
} from '../components/subscription-item'

export const SubscriptionsSection = () => {
  return (
    <Suspense fallback={<SubscriptionsSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <SubscriptionsSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  )
}

const SubscriptionsSectionSkeleton = () => {
  return (
    <div className="flec-col flex gap-4">
      <div className="hidden flex-1 flex-col gap-4 md:flex">
        {Array.from({ length: 10 }).map((_, index) => (
          <SubscriptionItemSkeleton key={index} />
        ))}
      </div>
    </div>
  )
}

const SubscriptionsSectionSuspense = () => {
  const utils = trpc.useUtils()

  const [subscriptions, query] =
    trpc.subscriptions.getMany.useSuspenseInfiniteQuery(
      {
        limit: DEFAULT_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    )

  const unsubscribe = trpc.subscriptions.remove.useMutation({
    onSuccess: (data) => {
      toast.success('Unsubscribed')
      utils.videos.getManySubscribed.invalidate()
      utils.users.getOne.invalidate({ id: data.creatorId })
      utils.subscriptions.getMany.invalidate()
    },
    onError: () => {
      toast.error('Something went wrong')
    },
  })

  return (
    <>
      <div className="flec-col flex gap-4">
        {subscriptions.pages
          .flatMap((page) => page.items)
          .map((subscription) => (
            <Link
              key={subscription.creatorId}
              href={`/users/${subscription.user.id}`}
              className="flex-1"
            >
              <SubscriptionItem
                name={subscription.user.name}
                imageUrl={subscription.user.imageUrl}
                subscriberCount={subscription.user.subscriberCount}
                disabled={unsubscribe.isPending}
                onUnsubscribe={() =>
                  unsubscribe.mutate({ userId: subscription.creatorId })
                }
              />
            </Link>
          ))}
      </div>
      <InfiniteScroll
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </>
  )
}
