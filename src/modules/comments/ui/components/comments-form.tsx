import { useClerk, useUser } from '@clerk/nextjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { UserAvatar } from '@/components/user-avatar'
import { commentsInsertSchema } from '@/db/schema'
import { trpc } from '@/trpc/client'

interface CommentsSectionProps {
  videoId: string
  onSuccess?: () => void
}

const CommentsInsertForm = commentsInsertSchema.omit({ userId: true })

export const CommentsForm = ({ videoId, onSuccess }: CommentsSectionProps) => {
  const { user } = useUser()

  const clerk = useClerk()

  const utils = trpc.useUtils()

  const create = trpc.comments.create.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ videoId })
      form.reset()
      toast.success('Comment added')
      onSuccess?.()
    },
    onError: (error) => {
      toast.error('Something went wrong')

      if (error.data?.code === 'UNAUTHORIZED') {
        clerk.openSignIn()
      }
    },
  })

  const form = useForm<z.infer<typeof CommentsInsertForm>>({
    resolver: zodResolver(CommentsInsertForm),
    defaultValues: {
      videoId,
      value: '',
    },
  })

  const handleSubmit = (values: z.infer<typeof CommentsInsertForm>) => {
    create.mutateAsync(values)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="group flex gap-4"
      >
        <UserAvatar
          size="lg"
          imageUrl={user?.imageUrl || '/user-placeholder.svg'}
          name={user?.username || 'User'}
        />
        <div className="flex-1">
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Add a comment"
                    className="min-h-0 resize-none overflow-hidden bg-transparent"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-2 flex justify-end gap-2">
            <Button
              type="submit"
              size="sm"
              disabled={
                form.formState.isSubmitting ||
                !form.formState.isDirty ||
                !form.formState.isValid ||
                create.isPending
              }
            >
              Comment
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
