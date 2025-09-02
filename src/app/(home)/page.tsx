import { Suspense } from 'react'

import { ErrorBoundary } from 'react-error-boundary'

import { HydrateClient, trpc } from '@/trpc/server'

import { PageClient } from './client'

export default function HomePage() {
  void trpc.hello.prefetch({ text: 'ixe' })

  return (
    <HydrateClient>
      <Suspense fallback={<p>Loading...</p>}>
        <ErrorBoundary fallback={<div>Something went wrong.</div>}>
          <PageClient />
        </ErrorBoundary>
      </Suspense>
    </HydrateClient>
  )
}
