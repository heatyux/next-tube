import { useClerk } from '@clerk/nextjs'
import { toast } from 'sonner'

import { trpc } from '@/trpc/client'

type UseSubscriptionProps = {
  userId: string
  isSubscribed: boolean
  fromVideoId?: string // optional, because maybe at the studio
}

export const useSubscription = ({
  userId,
  isSubscribed,
  fromVideoId,
}: UseSubscriptionProps) => {
  const clerk = useClerk()
  const utils = trpc.useUtils()

  const subsctibe = trpc.subscriptions.create.useMutation({
    onSuccess: () => {
      toast.success('Subscribed')

      // TODO:  Subscriptions getMany invalidation
      utils.videos.getManySubscribed.invalidate()
      utils.users.getOne.invalidate({ id: userId })

      if (fromVideoId) {
        utils.videos.getOne.invalidate({ id: fromVideoId })
      }
    },
    onError: (error) => {
      toast.error('Something went wrong')

      if (error.data?.code === 'UNAUTHORIZED') {
        clerk.openSignIn()
      }
    },
  })

  const unsubscribe = trpc.subscriptions.remove.useMutation({
    onSuccess: () => {
      toast.success('Unsubscribed')

      // TODO:  Subscriptions getMany invalidation
      utils.videos.getManySubscribed.invalidate()
      utils.users.getOne.invalidate({ id: userId })

      if (fromVideoId) {
        utils.videos.getOne.invalidate({ id: fromVideoId })
      }
    },
    onError: (error) => {
      toast.error('Something went wrong')

      if (error.data?.code === 'UNAUTHORIZED') {
        clerk.openSignIn()
      }
    },
  })

  const isPending = subsctibe.isPending || unsubscribe.isPending

  const onClick = () => {
    if (isSubscribed) {
      unsubscribe.mutate({ userId })
    } else {
      subsctibe.mutate({ userId })
    }
  }

  return {
    isPending,
    onClick,
  }
}
