'use client'

import { Suspense } from 'react'

import { Loader2Icon } from 'lucide-react'
import { ErrorBoundary } from 'react-error-boundary'

import { InfiniteScroll } from '@/components/infinite-scroll'
import { DEFAULT_LIMIT } from '@/constants'
import { CommentItem } from '@/modules/comments/ui/components/comment-item'
import { CommentsForm } from '@/modules/comments/ui/components/comments-form'
import { trpc } from '@/trpc/client'

interface CommentsSectionProps {
  videoId: string
}

export const CommentsSection = ({ videoId }: CommentsSectionProps) => {
  return (
    <Suspense fallback={<CommentsSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <CommentsSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  )
}

const CommentsSectionSkeleton = () => {
  return (
    <div className="mt-6 flex items-center justify-center">
      <Loader2Icon className="text-muted-foreground animete-spin size-7" />
    </div>
  )
}

const CommentsSectionSuspense = ({ videoId }: CommentsSectionProps) => {
  const [comments, query] = trpc.comments.getMany.useSuspenseInfiniteQuery(
    { videoId, limit: DEFAULT_LIMIT },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  )

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-6">
        <h1 className="text-xl font-bold">
          {comments.pages[0].totalCount} Comments
        </h1>
        <CommentsForm videoId={videoId} />
      </div>
      <div className="mt-2 flex flex-col gap-4">
        {comments.pages
          .flatMap((page) => page.items)
          .map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        <InfiniteScroll
          isManual
          fetchNextPage={query.fetchNextPage}
          hasNextPage={query.hasNextPage}
          isFetchingNextPage={query.isFetchingNextPage}
        />
      </div>
    </div>
  )
}
