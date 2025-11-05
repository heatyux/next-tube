import { useAuth } from '@clerk/nextjs'
import { Edit2Icon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

import { UsersGetOneOutput } from '../../types'

interface UserPageBannerProps {
  user: UsersGetOneOutput
}

export const UserPageBannerSkeleton = () => {
  return <Skeleton className="h-[15vh] max-h-[200px] w-full md:h-[25vh]" />
}

export const UserPageBanner = ({ user }: UserPageBannerProps) => {
  const { userId } = useAuth()

  return (
    <div className="group relative">
      {/* TODO: Add upload banner modal */}
      <div
        className={cn(
          'h-[15vh] max-h-[200px] w-full rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 md:h-[25vh]',
          user.bannerUrl ? 'bg-cover bg-center' : 'bg-gray-100',
        )}
        style={{
          backgroundImage: user.bannerUrl ? `url(${user.bannerUrl})` : '',
        }}
      >
        {user.clerkId === userId && (
          <Button
            type="button"
            size="icon"
            className="absolute top-4 right-4 rounded-full bg-black/50 opacity-100 transition-opacity duration-300 group-hover:opacity-100 hover:bg-black/50 md:opacity-0"
          >
            <Edit2Icon className="size-4 text-white" />
          </Button>
        )}
      </div>
    </div>
  )
}
