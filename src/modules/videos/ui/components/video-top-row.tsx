import { useMemo } from 'react'

import { format, formatDistanceToNow } from 'date-fns'

import { Skeleton } from '@/components/ui/skeleton'

import { VideoGetOneOutput } from '../../types'
import { VideoDescription } from './video-desctiption'
import { VideoMenu } from './video-menu'
import { VideoOwner } from './video-owner'
import { VideoReactions } from './video-reactions'

interface VideoTopRowProps {
  video: VideoGetOneOutput
}

export const VideoTopRowSkeleton = () => {
  return (
    <div className="mt-4 flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-4/5 md:w-2/5" />
      </div>
      <div className="flex w-full items-center justify-between">
        <div className="flex w-[70%] items-center gap-3">
          <Skeleton className="size-10 shrink-0 rounded-full" />
          <div className="flex w-full flex-col gap-2">
            <Skeleton className="h-5 w-4/5 md:w-2/6" />
            <Skeleton className="h-5 w-3/5 md:w-1/6" />
          </div>
        </div>
        <Skeleton className="h-9 w-2/6 rounded-full md:w-1/6" />
      </div>
      <div className="h-[120px] w-full"></div>
    </div>
  )
}

export const VideoTopRow = ({ video }: VideoTopRowProps) => {
  const compactViews = useMemo(() => {
    return Intl.NumberFormat('en-US', {
      notation: 'compact',
    }).format(video.videoViews)
  }, [video.videoViews])

  const expandedViews = useMemo(() => {
    return Intl.NumberFormat('en-US', {
      notation: 'standard',
    }).format(video.videoViews)
  }, [video.videoViews])

  const compactDate = useMemo(() => {
    return formatDistanceToNow(video.createdAt, { addSuffix: true })
  }, [video.createdAt])

  const expandedDate = useMemo(() => {
    return format(video.createdAt, 'do MMM yyyy')
  }, [video.createdAt])

  return (
    <div className="mt-4 flex flex-col gap-4">
      <h1 className="truncate text-xl font-semibold">{video.title}</h1>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <VideoOwner user={video.user} videoId={video.id} />
        <div className="-mb-2 flex gap-2 overflow-x-auto pb-2 sm:min-w-[calc(50%-6px)] sm:justify-end sm:overflow-visible">
          <VideoReactions
            videoId={video.id}
            likes={video.likeCount}
            dislikes={video.dislikeCount}
            viewerReaction={video.viewerReaction}
          />
          <VideoMenu videoId={video.id} variant="secondary" />
        </div>
      </div>
      <VideoDescription
        description={video.description}
        compactViews={compactViews}
        expandedViews={expandedViews}
        compactDate={compactDate}
        expandedDate={expandedDate}
      />
    </div>
  )
}
