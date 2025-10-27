import { useMemo } from 'react'

import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

import { Skeleton } from '@/components/ui/skeleton'
import { UserAvatar } from '@/components/user-avatar'
import { UserInfo } from '@/modules/users/ui/components/user-info'

import { VideoGetManyOutput } from '../../types'
import { VideoMenu } from './video-menu'

interface VideoInfoProps {
  data: VideoGetManyOutput['items'][number]
  onRemove?: () => void
}

export const VideoInfoSkeleton = () => {
  return (
    <div className="flex gap-3">
      <Skeleton className="size-10 shrink-0 rounded-full" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-5 w-[90%]" />
        <Skeleton className="h-5 w-[70%]" />
      </div>
    </div>
  )
}

export const VideoInfo = ({ data, onRemove }: VideoInfoProps) => {
  const compactViews = useMemo(
    () => Intl.NumberFormat('en-US').format(data.viewCount),
    [data.viewCount],
  )

  const compactDate = useMemo(
    () => formatDistanceToNow(data.createdAt, { addSuffix: true }),
    [data.createdAt],
  )

  return (
    <div className="flex gap-3">
      <Link href={`/users/${data.user.id}`}>
        <UserAvatar imageUrl={data.user.imageUrl} name={data.user.name} />
      </Link>
      <div className="min-w-0 flex-1">
        <Link href={`/videos/${data.id}`}>
          <h3 className="line-clamp-1 text-base font-medium break-words lg:line-clamp-2">
            {data.title}
          </h3>
        </Link>
        <Link href={`/users/${data.user.id}`}>
          <UserInfo name={data.user.name} />
        </Link>
        <Link href={`/videos/${data.id}`}>
          <p className="line-clamp-1 text-xs text-gray-600">
            {compactViews} • {compactDate}
          </p>
        </Link>
      </div>
      <div className="shrink-0">
        <VideoMenu videoId={data.id} onRemove={onRemove} />
      </div>
    </div>
  )
}
