'use client'

import { Suspense, useEffect, useState } from 'react'

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
                  <TableCell>{video.title}</TableCell>
                  <TableCell>Visibility</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
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
