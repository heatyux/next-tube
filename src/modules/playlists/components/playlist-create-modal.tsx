'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

import { ResponsiveModal } from '@/components/responsive-modal'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { trpc } from '@/trpc/client'

interface PlaylistCreateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const formSchema = z.object({
  name: z.string(),
})

export const PlaylistCreateModal = ({
  open,
  onOpenChange,
}: PlaylistCreateModalProps) => {
  const utils = trpc.useUtils()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  })

  const create = trpc.playlists.create.useMutation({
    onSuccess: () => {
      utils.playlists.getMany.invalidate()
      toast.success('Playlist created')
      form.reset()
      onOpenChange(false)
    },
    onError: () => {
      toast.error('Something went wrong')
    },
  })

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    create.mutateAsync(values)
  }

  return (
    <ResponsiveModal
      title="Create a playlist"
      open={open}
      onOpenChange={onOpenChange}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Playlist</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Playlist name"
                      className="resize-none"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={
                  form.formState.isSubmitting ||
                  create.isPending ||
                  !form.formState.isValid ||
                  !form.formState.isDirty
                }
              >
                Create
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </ResponsiveModal>
  )
}
