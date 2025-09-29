import { CommentsSection } from '../sections/comments-section'
import { SuggestionsSection } from '../sections/suggestions-section'
import { VideoSection } from '../sections/video-section'

interface VideoViewProps {
  videoId: string
}

export const VideoView = ({ videoId }: VideoViewProps) => {
  return (
    <div className="mx-auto mb-10 flex max-w-[1700px] flex-col px-4 py-2.5">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="min-w-0 flex-1">
          <VideoSection videoId={videoId} />
          <div className="mt-4 block xl:hidden">
            <SuggestionsSection />
          </div>
          <CommentsSection />
        </div>
        <div className="hidden shrink-1 xl:block xl:w-[380px] 2xl:w-[460px]">
          <SuggestionsSection />
        </div>
      </div>
    </div>
  )
}
