import Link from 'next/link'

import { THUMBNAIL_FALLBACK } from '@/modules/videos/constants'

import { PlaylistGetManyOutput } from '../../types'
import { PlaylistThumbnail } from './playlist-thumbnail'

interface PlaylistGridCardProps {
  data: PlaylistGetManyOutput['items'][number]
}
export const PlaylistGridCard = ({ data }: PlaylistGridCardProps) => {
  return (
    <Link href={`/playlists/${data.id}`}>
      <div className="group flex w-full flex-col gap-2">
        <PlaylistThumbnail
          title={data.name}
          videoCount={data.playlistVideoCount}
          imageUrl={THUMBNAIL_FALLBACK}
        />
      </div>
    </Link>
  )
}
