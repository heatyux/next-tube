import type { PropsWithChildren } from 'react'

import { SidebarProvider } from '@/components/ui/sidebar'

import { HomeNavbar } from '../components/home-navbar'

export const HomeLayout = ({ children }: PropsWithChildren) => {
  return (
    <SidebarProvider>
      <div className="h-full">
        <HomeNavbar />
        {children}
      </div>
    </SidebarProvider>
  )
}
