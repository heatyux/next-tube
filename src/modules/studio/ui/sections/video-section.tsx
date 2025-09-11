'use client'

import { Suspense, useEffect, useState } from 'react'

import { format } from 'date-fns'
import { Globe2Icon, LockIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ErrorBoundary } from 'react-error-boundary'

import { InfiniteScroll } from '@/components/infinite-scroll'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DEFAULT_LIMIT } from '@/constants'
import { snakeCaseToTitle } from '@/lib/utils'
import { VideoThumbnail } from '@/modules/videos/server/ui/components/video-thumbnail'
import { trpc } from '@/trpc/client'

export const VideosSection = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <VideosSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  )
}

const VideosSectionSuspense = () => {
  const router = useRouter()

  const [videos, query] = trpc.studio.getMany.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  )

  return (
    <div className="h-[200px]">
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[510px] pl-6">Video</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="text-right">Comments</TableHead>
              <TableHead className="pr-6 text-right">Likes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.pages
              .flatMap((page) => page.items)
              .map((video) => (
                <TableRow
                  key={video.id}
                  onClick={() => router.push(`/studio/videos/${video.id}`)}
                  className="cursor-pointer"
                >
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <div className="relative aspect-video w-36 shrink-0">
                        <VideoThumbnail
                          imageUrl={video.thumbnailUrl}
                          previewUrl={video.previewUrl}
                          title={video.title}
                          duration={video.duration ?? 0}
                        />
                      </div>
                      <div className="flex flex-col gap-y-1 overflow-hidden">
                        <span className="line-clamp-1 text-sm">
                          {video.title}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {video.description ?? 'No description'}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {video.visibility === 'private' ? (
                        <LockIcon className="mr-2 size-4" />
                      ) : (
                        <Globe2Icon className="mr-2 size-4" />
                      )}
                      <span>{snakeCaseToTitle(video.visibility)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {snakeCaseToTitle(video.muxStatus ?? 'error')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="truncate text-sm">
                      {format(new Date(video.createdAt), 'd MMM yyyy')}
                    </div>
                  </TableCell>
                  <TableCell>Views</TableCell>
                  <TableCell>Comments</TableCell>
                  <TableCell>Likes</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      <InfiniteScroll
        isManual
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </div>
  )
}
