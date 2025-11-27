import Link from 'next/link'

import { THUMBNAIL_FALLBACK } from '@/modules/videos/constants'

import { PlaylistGetManyOutput } from '../../types'
import { PlaylistInfo, PlaylistInfoSkeleton } from './playlist-info'
import {
  PlaylistThumbnail,
  PlaylistThumbnailSkeleton,
} from './playlist-thumbnail'

interface PlaylistGridCardProps {
  data: PlaylistGetManyOutput['items'][number]
}

export const PlaylistGridCardSkeleton = () => {
  return (
    <div className="flex w-full flex-col gap-2">
      <PlaylistThumbnailSkeleton />
      <PlaylistInfoSkeleton />
    </div>
  )
}

export const PlaylistGridCard = ({ data }: PlaylistGridCardProps) => {
  return (
    <Link prefetch href={`/playlists/${data.id}`}>
      <div className="group flex w-full flex-col gap-2">
        <PlaylistThumbnail
          title={data.name}
          videoCount={data.playlistVideoCount}
          imageUrl={data.thumbnailUrl ?? THUMBNAIL_FALLBACK}
        />
        <PlaylistInfo data={data} />
      </div>
    </Link>
  )
}
