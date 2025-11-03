import { useMemo } from 'react'

import { ListVideoIcon, PlayIcon } from 'lucide-react'
import Image from 'next/image'

import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface PlaylistThumbnailProps {
  title: string
  videoCount: number
  imageUrl?: string
  className?: string
}

export const PlaylistThumbnailSkeleton = () => {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl">
      <Skeleton className="size-full" />
    </div>
  )
}

export const PlaylistThumbnail = ({
  title,
  videoCount,
  imageUrl,
  className,
}: PlaylistThumbnailProps) => {
  const compactVideoCount = useMemo(
    () => Intl.NumberFormat('en-US').format(videoCount),
    [videoCount],
  )

  return (
    <div className={cn('relative pt-3', className)}>
      {/* Stack Effect Layers */}
      <div className="relative">
        {/* Background Layers */}
        <div className="absolute -top-3 left-1/2 aspect-video w-[97%] -translate-x-1/2 overflow-hidden rounded-xl bg-black/20"></div>
        <div className="absolute -top-1.5 left-1/2 aspect-video w-[98.5%] -translate-x-1/2 overflow-hidden rounded-xl bg-black/25"></div>

        {/* Main Image */}
        <div className="relative aspect-video w-full overflow-hidden rounded-xl">
          <Image
            src={imageUrl ?? ''}
            alt={title}
            fill
            className="size-full object-cover"
            unoptimized={!!imageUrl}
          />
          {/* Hover Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
            <div className="flex items-center gap-x-2">
              <PlayIcon className="size-5 fill-white text-white" />
              <span className="font-medium text-white">Play All</span>
            </div>
          </div>
        </div>
      </div>

      {/* Video Count Indicator */}
      <div className="absolute right-2 bottom-2 flex items-center gap-x-1 rounded bg-black/80 px-1 py-0.5 text-xs font-medium text-white">
        <ListVideoIcon className="size-4" />
        <span>{compactVideoCount} videos</span>
      </div>
    </div>
  )
}
