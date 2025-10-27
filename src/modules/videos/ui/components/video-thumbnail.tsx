import Image from 'next/image'

import { Skeleton } from '@/components/ui/skeleton'
import { formatDuration } from '@/lib/utils'

import { THUMBNAIL_FALLBACK } from '../../constants'

interface VideoThumbnailProps {
  imageUrl?: string | null
  previewUrl?: string | null
  title: string
  duration: number
}

export const VideoThumbnailSkeleton = () => {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl">
      <Skeleton className="size-full" />
    </div>
  )
}

export const VideoThumbnail = ({
  imageUrl,
  previewUrl,
  title,
  duration,
}: VideoThumbnailProps) => {
  return (
    <div className="group relative">
      {/* Thumbnail Wrapper */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl">
        <Image
          src={imageUrl ?? THUMBNAIL_FALLBACK}
          alt={title}
          fill
          unoptimized
          className="size-full object-cover opacity-100 transition-opacity duration-300 group-hover:opacity-0"
        />
        <Image
          src={previewUrl ?? THUMBNAIL_FALLBACK}
          alt={title}
          fill
          unoptimized={!!previewUrl}
          className="size-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      </div>

      {/* Video Duration Box */}
      <div className="absolute right-2 bottom-2 rounded bg-black/80 px-1 py-0.5 text-xs font-medium text-white">
        {formatDuration(duration)}
      </div>
    </div>
  )
}
