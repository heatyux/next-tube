import { useState } from 'react'

import { useAuth, useClerk } from '@clerk/nextjs'
import { formatDistanceToNow } from 'date-fns'
import {
  ChevronDownIcon,
  ChevronUpIcon,
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
import { CommentReplies } from './comment-replies'
import { CommentsForm } from './comments-form'

interface CommentItemProps {
  comment: CommentGetManyOutput['items'][number]
  variant?: 'comment' | 'reply'
}

export const CommentItem = ({
  comment,
  variant = 'comment',
}: CommentItemProps) => {
  const { userId } = useAuth()
  const clerk = useClerk()

  const utils = trpc.useUtils()

  const [isReplyOpen, setIsReplyOpen] = useState(false)
  const [isRepliesOpen, setIsRepliesOpen] = useState(false)

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

  const like = trpc.commentReactions.like.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ videoId: comment.videoId })
    },
    onError: (error) => {
      toast.error('Something went wrong')

      if (error.data?.code === 'UNAUTHORIZED') {
        clerk.openSignIn()
      }
    },
  })

  const dislike = trpc.commentReactions.dislike.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ videoId: comment.videoId })
    },
    onError: (error) => {
      toast.error('Something went wrong')

      if (error.data?.code === 'UNAUTHORIZED') {
        clerk.openSignIn()
      }
    },
  })

  const isPending = like.isPending || dislike.isPending || remove.isPending

  return (
    <div>
      <div className="flex gap-4">
        <Link prefetch href={`/users/${comment.userId}`}>
          <UserAvatar
            size={variant === 'comment' ? 'lg' : 'sm'}
            imageUrl={comment.user.imageUrl ?? '/user-placeholder.svg'}
            name={comment.user.name}
          />
        </Link>
        <div className="min-w-0 flex-1">
          <Link prefetch href={`/users/${comment.userId}`}>
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
                className="size-8 rounded-full disabled:cursor-not-allowed"
                disabled={isPending}
                onClick={() => like.mutate({ commentId: comment.id })}
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
                className="size-8 rounded-full disabled:cursor-not-allowed"
                disabled={isPending}
                onClick={() => dislike.mutate({ commentId: comment.id })}
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
            {variant === 'comment' && (
              <Button
                variant="ghost"
                size="sm"
                className="ml-4 h-8"
                onClick={() => setIsReplyOpen(true)}
              >
                Reply
              </Button>
            )}
          </div>
        </div>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8 rounded-full">
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {variant === 'comment' && (
              <DropdownMenuItem onClick={() => setIsReplyOpen(true)}>
                <MessageSquareIcon className="size-4" />
                Reply
              </DropdownMenuItem>
            )}
            {userId === comment.user.clerkId && (
              <DropdownMenuItem
                className="disabled:cursor-not-allowed"
                disabled={isPending}
                onClick={() => remove.mutate({ id: comment.id })}
              >
                <Trash2Icon className="size-4" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {isReplyOpen && variant === 'comment' && (
        <div className="mt-4 pl-14">
          <CommentsForm
            videoId={comment.videoId}
            parentId={comment.id}
            variant="reply"
            onCancel={() => setIsReplyOpen(false)}
            onSuccess={() => {
              setIsReplyOpen(false)
              setIsRepliesOpen(true)
            }}
          />
        </div>
      )}
      {comment.replyCount > 0 && variant === 'comment' && (
        <div className="pl-14">
          <Button
            variant="tertiary"
            size="sm"
            onClick={() => setIsRepliesOpen((current) => !current)}
          >
            {isRepliesOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            {comment.replyCount} replies
          </Button>
        </div>
      )}
      {comment.replyCount > 0 && variant === 'comment' && isRepliesOpen && (
        <CommentReplies parentId={comment.id} videoId={comment.videoId} />
      )}
    </div>
  )
}
