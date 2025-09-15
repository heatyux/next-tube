'use client'

import { Loader2Icon, PlusIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { ResponsiveModal } from '@/components/responsive-modal'
import { Button } from '@/components/ui/button'
import { trpc } from '@/trpc/client'

import { StudioUploader } from './studio-uploader'

export const StudioUploadModal = () => {
  const router = useRouter()

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

  const onSuccess = () => {
    if (!create.data?.video.id) {
      return
    }

    create.reset()
    router.push(`/studio/videos/${create.data.video.id}`)
  }

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
        open={!!create.data?.url}
        onOpenChange={() => create.reset()}
      >
        {create.data?.url ? (
          <StudioUploader endpoint={create.data.url} onSuccess={onSuccess} />
        ) : (
          <Loader2Icon className="text-muted-foreground size-5 animate-spin" />
        )}
      </ResponsiveModal>
    </>
  )
}
