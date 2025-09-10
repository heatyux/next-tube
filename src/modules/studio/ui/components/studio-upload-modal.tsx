'use client'

import { Loader2Icon, PlusIcon } from 'lucide-react'
import { toast } from 'sonner'

import { ResponsiveModal } from '@/components/responsive-modal'
import { Button } from '@/components/ui/button'
import { trpc } from '@/trpc/client'

export const StudioUploadModal = () => {
  const utils = trpc.useUtils()
  const create = trpc.videos.create.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate()
      toast.success('Video created successfully')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return (
    <>
      <Button
        disabled={create.isPending}
        variant="secondary"
        onClick={() => create.mutate()}
      >
        {create.isPending ? (
          <Loader2Icon className="text-muted-foreground size-5 animate-spin" />
        ) : (
          <PlusIcon className="mr-2" />
        )}
        <span>Create</span>
      </Button>
      <ResponsiveModal
        title="Upload a video"
        open={!!create.data}
        onOpenChange={() => create.reset()}
      >
        <p>This will be an upload</p>
      </ResponsiveModal>
    </>
  )
}
