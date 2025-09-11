import MuxUploader from '@mux/mux-uploader-react'

interface StudioUploaderProps {
  endpoint: string
}

export const StudioUploader = ({ endpoint }: StudioUploaderProps) => {
  return (
    <div>
      <MuxUploader endpoint={endpoint} />
    </div>
  )
}
