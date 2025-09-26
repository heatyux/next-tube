'use client'

import { Suspense, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  CopyCheckIcon,
  CopyIcon,
  Globe2Icon,
  ImagePlusIcon,
  Loader2Icon,
  LockIcon,
  MoreVerticalIcon,
  RotateCcwIcon,
  SparkleIcon,
  SparklesIcon,
  TrashIcon,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ErrorBoundary } from 'react-error-boundary'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { videoUpdateSchema } from '@/db/schema'
import { snakeCaseToTitle } from '@/lib/utils'
import { THUMBNAIL_FALLBACK } from '@/modules/videos/constants'
import { VideoPlayer } from '@/modules/videos/ui/components/video-player'
import { trpc } from '@/trpc/client'

import { ThumbnailUploadModal } from '../components/thumbnail-upload-modal'

interface FormSectionProps {
  videoId: string
}

export const FormSection = ({ videoId }: FormSectionProps) => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <FormSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  )
}

const FormSectionSuspense = ({ videoId }: FormSectionProps) => {
  const router = useRouter()

  const [thumbnailModalOpen, setThumbnailModalOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const utils = trpc.useUtils()
  const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId })
  // HACK: Ideally, the select part of the form should be on its own component to avoid long loading times
  const [categories] = trpc.category.getMany.useSuspenseQuery()

  const update = trpc.videos.update.useMutation({
    onSuccess: () => {
      utils.studio.getOne.invalidate({ id: videoId })
      utils.studio.getMany.invalidate()
      toast.success('Video updated successfully')

      setTimeout(() => {
        router.push('/studio')
      }, 1000)
    },
    onError: (error) => toast.error(error.message),
  })

  const remove = trpc.videos.remove.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate()
      toast.success('Video deleted successfully')

      setTimeout(() => {
        router.push('/studio')
      }, 1000)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const form = useForm<z.infer<typeof videoUpdateSchema>>({
    resolver: zodResolver(videoUpdateSchema),
    defaultValues: video,
  })

  const onSubmit = async (data: z.infer<typeof videoUpdateSchema>) => {
    await update.mutateAsync(data)
  }

  const fullUrl = `${process.env.NEXT_PUBLIC_APP_URL}/video/${videoId}`

  const onCopy = async () => {
    await navigator.clipboard.writeText(fullUrl)
    setIsCopied(true)

    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }

  const restoreThumbnail = trpc.videos.restoreThumbnail.useMutation({
    onSuccess: () => {
      utils.studio.getOne.invalidate({ id: videoId })
      utils.studio.getMany.invalidate()
      toast.success('Thumbnail restored successfully')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const generateTitle = trpc.videos.generateTitle.useMutation({
    onSuccess: () => {
      utils.studio.getOne.invalidate({ id: videoId })
      toast.success('Title generated')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const generateDescription = trpc.videos.generateDescription.useMutation({
    onSuccess: () => {
      utils.studio.getOne.invalidate({ id: videoId })
      toast.success('Description generated')
      setTimeout(() => {
        router.push('/studio')
      }, 1000)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Video Details</h1>
              <h3 className="text-muted-foreground text-xs">
                Manage your video details
              </h3>
            </div>
            <div className="flex items-center gap-x-2">
              <Button
                type="submit"
                disabled={
                  form.formState.isSubmitting ||
                  update.isPending ||
                  !form.formState.isValid ||
                  !form.formState.isDirty
                }
              >
                Save
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button type="button" variant="ghost" size="icon">
                    <MoreVerticalIcon className="size-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => remove.mutate({ id: videoId })}
                  >
                    <TrashIcon className="mr-2 size-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="space-y-8 lg:col-span-3">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <div className="flex items-center gap-x-2">
                        Title
                        <Button
                          type="button"
                          disabled={
                            generateTitle.isPending || !video.muxTrackId
                          }
                          variant="ghost"
                          size="icon"
                          className="size-6 rounded-full"
                          onClick={() => generateTitle.mutate({ id: videoId })}
                        >
                          {generateTitle.isPending ? (
                            <Loader2Icon className="size-3 animate-spin" />
                          ) : (
                            <SparkleIcon className="size-3" />
                          )}
                        </Button>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Add a title to your video"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <div className="flex items-center gap-x-2">
                        Description
                        <Button
                          type="button"
                          disabled={
                            generateDescription.isPending || !video.muxTrackId
                          }
                          variant="ghost"
                          size="icon"
                          className="size-6 rounded-full"
                          onClick={() =>
                            generateDescription.mutate({ id: videoId })
                          }
                        >
                          {generateDescription.isPending ? (
                            <Loader2Icon className="size-3 animate-spin" />
                          ) : (
                            <SparkleIcon className="size-3" />
                          )}
                        </Button>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value ?? ''}
                        rows={10}
                        placeholder="Add a description to your video"
                        className="field-sizing-fixed min-h-0 resize-none pr-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="thumbnailUrl"
                render={() => (
                  <FormItem>
                    <FormLabel>Thumbnail</FormLabel>
                    <FormControl>
                      <div className="group relative h-[84px] w-[153px] border border-dashed border-neutral-400 p-0.5">
                        <Image
                          src={video.thumbnailUrl ?? THUMBNAIL_FALLBACK}
                          alt="Thumbnail"
                          fill
                          className="object-cover"
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              type="button"
                              size="icon"
                              className="absolute top-1 right-1 size-7 rounded-full bg-black/50 opacity-100 duration-300 group-hover:opacity-100 hover:bg-black/50 md:opacity-0"
                            >
                              <MoreVerticalIcon className="text-white" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() => setThumbnailModalOpen(true)}
                            >
                              <ImagePlusIcon className="mr-1 size-5" />
                              Change
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <SparklesIcon className="mr-1 size-5" />
                              AI generated
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                restoreThumbnail.mutate({ id: videoId })
                              }
                            >
                              <RotateCcwIcon className="mr-1 size-5" />
                              Restore
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                disabled={categories.length === 0}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      defaultValue={field.value ?? undefined}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="w-full">
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-y-8 lg:col-span-2">
              <div className="relative flex h-fit flex-col gap-4 overflow-hidden rounded-xl bg-[#F9f9F9]">
                <div className="relative aspect-video overflow-hidden">
                  <VideoPlayer
                    playbackId={video.muxPlaybackId}
                    thumbnailUrl={video.thumbnailUrl}
                  />
                </div>
                <div className="flex flex-col gap-y-6 p-4">
                  <div className="flex items-center justify-between gap-y-2">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-muted-foreground text-xs">
                        Video Link
                      </p>
                      <div className="flex items-center gap-x-2">
                        <Link href={`/videos/${video.id}`}>
                          <p className="line-clamp-1 text-sm text-blue-500">
                            {fullUrl}
                          </p>
                        </Link>
                        <Button
                          type="button"
                          disabled={isCopied}
                          variant="ghost"
                          size="icon"
                          className="shrink-0"
                          onClick={onCopy}
                        >
                          {isCopied ? <CopyCheckIcon /> : <CopyIcon />}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-muted-foreground text-xs">
                        Video Status
                      </p>
                      <p className="text-sm">
                        {snakeCaseToTitle(video.muxStatus ?? 'Preparing')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-muted-foreground text-xs">
                        Subtitles Status
                      </p>
                      <p className="text-sm">
                        {snakeCaseToTitle(
                          video.muxTrackStatus ?? 'No Subtitles',
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <FormField
                control={form.control}
                name="visibility"
                disabled={categories.length === 0}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visibility</FormLabel>
                    <Select
                      defaultValue={field.value ?? undefined}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="public">
                          <div className="flex">
                            <Globe2Icon className="mr-2 size-4" />
                            Public
                          </div>
                        </SelectItem>
                        <SelectItem value="private">
                          <div className="flex">
                            <LockIcon className="mr-2 size-4" />
                            Private
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
      <ThumbnailUploadModal
        videoId={videoId}
        open={thumbnailModalOpen}
        onOpenChange={setThumbnailModalOpen}
      />
    </>
  )
}
