import { PlaylistsView } from '@/modules/playlists/ui/views/playlists-view'
import { HydrateClient } from '@/trpc/server'

export const dynamic = 'force-dynamic'

export default async function PlaylistsPage() {
  return (
    <HydrateClient>
      <PlaylistsView />
    </HydrateClient>
  )
}
