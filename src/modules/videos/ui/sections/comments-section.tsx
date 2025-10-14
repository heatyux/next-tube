'use client'

import { Suspense } from 'react'

import { ErrorBoundary } from 'react-error-boundary'

import { trpc } from '@/trpc/client'

interface CommentsSectionProps {
  videoId: string
}

export const CommentsSection = ({ videoId }: CommentsSectionProps) => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <CommentsSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  )
}

const CommentsSectionSuspense = ({ videoId }: CommentsSectionProps) => {
  const [comments] = trpc.comments.getMany.useSuspenseQuery({ videoId })

  return <>{JSON.stringify(comments)}</>
}
