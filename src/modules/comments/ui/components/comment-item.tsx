import { useAuth, useClerk } from '@clerk/nextjs'
import { formatDistanceToNow } from 'date-fns'
import {
  MessageSquareIcon,
  MoreVerticalIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  Trash2Icon,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { UserAvatar } from '@/components/user-avatar'
import { cn } from '@/lib/utils'
import { trpc } from '@/trpc/client'

import { CommentGetManyOutput } from '../../types'

interface CommentItemProps {
  comment: CommentGetManyOutput['items'][number]
}

export const CommentItem = ({ comment }: CommentItemProps) => {
  const { userId } = useAuth()
  const clerk = useClerk()

  const utils = trpc.useUtils()

  const remove = trpc.comments.remove.useMutation({
    onSuccess: () => {
      toast.success('Comment deleted')

      utils.comments.getMany.invalidate({ videoId: comment.videoId })
    },
    onError: (error) => {
      toast.error('Something went wrong')

      if (error.data?.code === 'UNAUTHORIZED') {
        clerk.openSignIn()
      }
    },
  })

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
          <div className="mt-1 flex items-center gap-2">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-full"
              >
                <ThumbsUpIcon
                  className={cn(
                    comment.viewerReaction === 'like' && 'fill-black',
                  )}
                />
              </Button>
              <span className="text-muted-foreground text-xs">
                {comment.likeCount}
              </span>
            </div>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-full"
              >
                <ThumbsDownIcon
                  className={cn(
                    comment.viewerReaction === 'dislike' && 'fill-black',
                  )}
                />
              </Button>
              <span className="text-muted-foreground text-xs">
                {comment.dislikeCount}
              </span>
            </div>
          </div>
        </div>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8 rounded-full">
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <MessageSquareIcon className="size-4" />
              Reply
            </DropdownMenuItem>
            {userId === comment.user.clerkId && (
              <DropdownMenuItem
                onClick={() => remove.mutate({ id: comment.id })}
              >
                <Trash2Icon className="size-4" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
