import Link from 'next/link'

import { VideoGetManyOutput } from '../../types'
import { VideoInfo } from './video-info'
import { VideoThumbnail } from './video-thumbnail'

interface VideoGridCardProps {
  data: VideoGetManyOutput['items'][number]
  onRemove?: () => void
}

export const VideoGridCard = ({ data, onRemove }: VideoGridCardProps) => {
  return (
    <div className="group flex w-full flex-col gap-2">
      <Link href={`/videos/${data.id}`}>
        <VideoThumbnail
          imageUrl={data.thumbnailUrl}
          previewUrl={data.previewUrl}
          title={data.title}
          duration={data.duration}
        />
      </Link>
      <VideoInfo data={data} onRemove={onRemove} />
    </div>
  )
}
