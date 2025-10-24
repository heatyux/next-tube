'use client'

import { DEFAULT_LIMIT } from '@/constants'
import { trpc } from '@/trpc/client'

import { VideoGridCard } from '../components/video-grid-card'
import { VideoRowCard } from '../components/video-row-card'

interface SuggestionsSectionProps {
  videoId: string
}

export const SuggestionsSection = ({ videoId }: SuggestionsSectionProps) => {
  const [suggestions] = trpc.suggestions.getMany.useSuspenseInfiniteQuery(
    {
      videoId,
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  )

  return (
    <>
      <div className="hidden space-y-3 md:block">
        {suggestions.pages.flatMap((page) =>
          page.items.map((video) => (
            <VideoRowCard key={video.id} data={video} size="compact" />
          )),
        )}
      </div>
      <div className="block space-y-10 md:hidden">
        {suggestions.pages.flatMap((page) =>
          page.items.map((video) => (
            <VideoGridCard key={video.id} data={video} />
          )),
        )}
      </div>
    </>
  )
}
