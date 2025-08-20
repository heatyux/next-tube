import type { PropsWithChildren } from 'react'

import { HomeLayout } from '@/modules/home/ui/layout/home-layout'

const HomeRouteLayout = ({ children }: PropsWithChildren) => {
  return <HomeLayout>{children}</HomeLayout>
}

export default HomeRouteLayout
