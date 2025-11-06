'use client'

import { Suspense } from 'react'

import { ErrorBoundary } from 'react-error-boundary'

import { trpc } from '@/trpc/client'

import { UserPageBanner } from '../components/user-page-banner'
import { UserPageInfo } from '../components/user-page-info'

interface UserSectionProps {
  userId: string
}

export const UserSection = ({ userId }: UserSectionProps) => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <UserSectionSuspense userId={userId} />
      </ErrorBoundary>
    </Suspense>
  )
}

const UserSectionSuspense = ({ userId }: UserSectionProps) => {
  const [user] = trpc.users.getOne.useSuspenseQuery({ id: userId })

  return (
    <div>
      <UserPageBanner user={user} />
      <UserPageInfo user={user} />
    </div>
  )
}
