import { useEffect } from 'react'

import { useIntersectionObserver } from '@/hooks/use-intersection-observer'

import { Button } from './ui/button'

interface InfiniteScrollProps {
  isManual?: boolean
  hasNextPage: boolean
  isFetchingNextPage: boolean
  fetchNextPage: () => void
}

export const InfiniteScroll = ({
  isManual = false,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: InfiniteScrollProps) => {
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.5,
    rootMargin: '100px',
  })

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage && !isManual) {
      fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isIntersecting, isManual])

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="h-1" ref={targetRef} />
      {hasNextPage ? (
        <Button
          disabled={!hasNextPage || isFetchingNextPage}
          variant="secondary"
          onClick={fetchNextPage}
        >
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </Button>
      ) : (
        <p className="text-muted-foreground text-xs">
          You have reached the end of the list
        </p>
      )}
    </div>
  )
}
