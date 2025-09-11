import Image from 'next/image'

interface VideoThumbnailProps {
  imageUrl?: string | null
  previewUrl?: string | null
  title: string
}

export const VideoThumbnail = ({
  imageUrl,
  previewUrl,
  title,
}: VideoThumbnailProps) => {
  return (
    <div className="group relative">
      {/* Thumbnail Wrapper */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl">
        <Image
          src={imageUrl ?? '/placeholder.svg'}
          alt={title}
          fill
          className="size-full object-cover opacity-100 transition-opacity duration-300 group-hover:opacity-0"
        />
        <Image
          src={previewUrl ?? '/placeholder.svg'}
          alt={title}
          fill
          className="size-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      </div>

      {/* Video Duration Box */}
      {/* TODO: Add video dutaion box */}
    </div>
  )
}
