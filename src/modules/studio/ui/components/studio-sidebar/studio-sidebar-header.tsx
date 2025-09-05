'use client'

import { useUser } from '@clerk/nextjs'
import Link from 'next/link'

import {
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { UserAvatar } from '@/components/user-avatar'

export const StudioSidebarHeader = () => {
  const { user } = useUser()
  const { state } = useSidebar()

  if (!user) {
    return (
      <SidebarHeader className="flex items-center justify-center pb-4">
        <Skeleton className="size-[112px] rounded-full" />
        <div className="mt-2 flex flex-col items-center gap-y-1">
          <Skeleton className="h-4 w-[80px]" />
          <Skeleton className="h-4 w-[80px]" />
        </div>
      </SidebarHeader>
    )
  }

  if (state === 'collapsed') {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton tooltip="Your Profile">
          <Link href="/users/current">
            <UserAvatar
              imageUrl={user.imageUrl}
              name={user.fullName ?? 'user'}
              size="xs"
            />
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <SidebarHeader className="flex items-center justify-center pb-4">
      <Link href="/users/current">
        <UserAvatar
          imageUrl={user.imageUrl}
          name={user.fullName ?? 'user'}
          className="size-[112px] transition-opacity hover:opacity-80"
        />
      </Link>
      <div className="mt-2 flex flex-col items-center">
        <p className="text-sm font-medium">Your Profile</p>
        <p className="text-muted-foreground text-xs">{user.fullName}</p>
      </div>
    </SidebarHeader>
  )
}
