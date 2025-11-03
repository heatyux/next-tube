import { Skeleton } from '@/components/ui/skeleton'

import { PlaylistGetManyOutput } from '../../types'

interface PlaylistInfoProps {
  data: PlaylistGetManyOutput['items'][number]
}

export const PlaylistInfoSkeleton = () => {
  return (
    <div className="flex gap-3">
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-5 w-[90%]" />
        <Skeleton className="h-5 w-[70%]" />
        <Skeleton className="h-5 w-[50%]" />
      </div>
    </div>
  )
}

export const PlaylistInfo = ({ data }: PlaylistInfoProps) => {
  return (
    <div className="flex gap-3">
      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-1 text-sm font-medium break-words lg:line-clamp-2">
          {data.name}
        </h3>
        <p className="text-muted-foreground text-sm">Playlist</p>
        <p className="text-muted-foreground hover:text-primary text-sm font-semibold">
          View full playlist
        </p>
      </div>
    </div>
  )
}
