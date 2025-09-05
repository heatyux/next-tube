import { type VariantProps, cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

import { Avatar, AvatarImage } from './ui/avatar'

const AvatarVariants = cva('', {
  variants: {
    size: {
      default: 'size-9',
      xs: 'size-4',
      sm: 'size-6',
      lg: 'size-10',
      xl: 'size-[160px]',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

interface UserAvatarProps extends VariantProps<typeof AvatarVariants> {
  imageUrl: string
  name: string
  className?: string
  onClick?: () => void
}

export const UserAvatar = ({
  imageUrl,
  name,
  className,
  onClick,
  size,
}: UserAvatarProps) => {
  return (
    <Avatar
      className={cn(AvatarVariants({ size, className }))}
      onClick={onClick}
    >
      <AvatarImage src={imageUrl} alt={name} />
    </Avatar>
  )
}
