import { LikedVideosSection } from '../sections/liked-videos-section'

export const LikedView = () => {
  return (
    <div className="mx-auto mb-10 flex max-w-screen-md flex-col gap-y-6 px-4 pt-2.5">
      <div>
        <h1 className="text-2xl font-bold">Liked Videos</h1>
        <h6 className="text-muted-foreground text-xs">
          Videos you really enjoyed watching
        </h6>
      </div>
      <LikedVideosSection />
    </div>
  )
}
