import { VideoGetOneOutput } from '../../types'
import { VideoOwner } from './video-owner'
import { VideoReactions } from './video-reactions'

interface VideoTopRowProps {
  video: VideoGetOneOutput
}

export const VideoTopRow = ({ video }: VideoTopRowProps) => {
  return (
    <div className="mt-4 flex flex-col gap-4">
      <h1 className="truncate text-xl font-semibold">{video.title}</h1>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <VideoOwner user={video.user} videoId={video.id} />
        <div className="-mb-2 flex gap-2 overflow-x-auto pb-2 sm:min-w-[calc(50%-6px)] sm:justify-end sm:overflow-visible">
          <VideoReactions />
        </div>
      </div>
    </div>
  )
}
