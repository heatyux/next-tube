import { VideoView } from '@/modules/studio/ui/views/video-view'
import { HydrateClient, trpc } from '@/trpc/server'

interface VideoIdPageProps {
  params: Promise<{
    videoId: string
  }>
}

export const dynamic = 'force-dynamic'

const VideoIdPage = async ({ params }: VideoIdPageProps) => {
  const { videoId } = await params

  void trpc.studio.getOne.prefetch({ id: videoId })
  void trpc.category.getMany.prefetch()

  return (
    <HydrateClient>
      <VideoView videoId={videoId} />
    </HydrateClient>
  )
}

export default VideoIdPage
