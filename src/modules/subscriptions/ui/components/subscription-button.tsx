import { ComponentProps } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SubscriptionButtonProps {
  disabled: boolean
  isSubscribed: boolean
  size: ComponentProps<typeof Button>['size']
  onClick: ComponentProps<typeof Button>['onClick']
  className?: string
}

export const SubscriptionButton = ({
  disabled,
  isSubscribed,
  size,
  className,
  onClick,
}: SubscriptionButtonProps) => {
  return (
    <Button
      variant={isSubscribed ? 'secondary' : 'default'}
      size={size}
      disabled={disabled}
      className={cn('rounded-full', className)}
      onClick={onClick}
    >
      {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
    </Button>
  )
}
