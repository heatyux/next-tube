import { DEFAULT_LIMIT } from '@/constants'
import { VideosView } from '@/modules/playlists/ui/views/videos-view'
import { HydrateClient, trpc } from '@/trpc/server'

interface PlaylistIdPageProps {
  params: Promise<{
    playlistId: string
  }>
}

// This helps with the prefetching
export const dynamic = 'force-dynamic'

const PlaylistIdPage = async ({ params }: PlaylistIdPageProps) => {
  const { playlistId } = await params

  void trpc.playlists.getOne.prefetch({ playlistId })
  void trpc.playlists.getVideos.prefetchInfinite({
    playlistId,
    limit: DEFAULT_LIMIT,
  })

  return (
    <HydrateClient>
      <VideosView playlistId={playlistId} />
    </HydrateClient>
  )
}

export default PlaylistIdPage
