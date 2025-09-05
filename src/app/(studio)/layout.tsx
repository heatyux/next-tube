import type { PropsWithChildren } from 'react'

import { StudioLayout } from '@/modules/studio/ui/layouts/studio-layout'

const StudioRouteLayout = ({ children }: PropsWithChildren) => {
  return <StudioLayout>{children}</StudioLayout>
}

export default StudioRouteLayout
