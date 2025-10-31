'use client'

import { useAuth, useClerk } from '@clerk/nextjs'
import {
  FlameIcon,
  HomeIcon,
  type LucideIcon,
  PlaySquareIcon,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

type Item = {
  title: string
  url: string
  icon: LucideIcon
  auth?: boolean
}

const items: Item[] = [
  {
    title: 'Home',
    url: '/',
    icon: HomeIcon,
  },
  {
    title: 'Subscriptions',
    url: '/feed/subscriptions',
    icon: PlaySquareIcon,
    auth: true,
  },
  {
    title: 'Trending',
    url: '/feed/trending',
    icon: FlameIcon,
  },
]

export const MainSection = () => {
  const pathname = usePathname()

  const clerk = useClerk()
  const { isSignedIn } = useAuth()

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                isActive={pathname == item.url}
                onClick={(e) => {
                  if (!isSignedIn && item.auth) {
                    e.preventDefault()

                    return clerk.openSignIn()
                  }
                }}
                asChild
              >
                <Link href={item.url} className="flex items-center gap-4">
                  <item.icon />
                  <span className="text-sm">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
