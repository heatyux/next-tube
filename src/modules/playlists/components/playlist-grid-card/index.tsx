import Link from 'next/link'

import { PlaylistGetManyOutput } from '../../types'

interface PlaylistGridCardProps {
  data: PlaylistGetManyOutput['items'][number]
}
export const PlaylistGridCard = ({ data }: PlaylistGridCardProps) => {
  return (
    <Link href={`/playlists/${data.id}`}>
      <div className="group flex w-full flex-col gap-2">{data.name}</div>
    </Link>
  )
}
