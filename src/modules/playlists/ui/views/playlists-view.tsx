'use client'

import { useState } from 'react'

import { PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { PlaylistCreateModal } from '../../components/playlist-create-modal'

export const PlaylistsView = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mx-auto mb-10 flex max-w-[2400px] flex-col gap-y-6 px-4 pt-2.5">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">Playlists</h1>
          <h6 className="text-muted-foreground text-xs">
            Collections you have created
          </h6>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => setIsOpen(true)}
        >
          <PlusIcon />
        </Button>
      </div>
      <PlaylistCreateModal open={isOpen} onOpenChange={setIsOpen} />
    </div>
  )
}
