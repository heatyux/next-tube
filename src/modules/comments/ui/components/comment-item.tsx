import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

import { UserAvatar } from '@/components/user-avatar'

import { CommentGetManyOutput } from '../../types'

interface CommentItemProps {
  comment: CommentGetManyOutput['items'][number]
}

export const CommentItem = ({ comment }: CommentItemProps) => {
  return (
    <div>
      <div className="flex gap-4">
        <Link href={`/users/${comment.userId}`}>
          <UserAvatar
            imageUrl={comment.user.imageUrl ?? '/user-placeholder.svg'}
            name={comment.user.name}
          />
        </Link>
        <div className="min-w-0 flex-1">
          <Link href={`/users/${comment.userId}`}>
            <div className="mb-0.5 flex items-center gap-2">
              <span className="pb-0.5 text-sm font-medium">
                {comment.user.name}
              </span>
              <span className="text-muted-foreground text-xs">
                {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
              </span>
            </div>
          </Link>
          <p className="text-sm">{comment.value}</p>
        </div>
      </div>
    </div>
  )
}
