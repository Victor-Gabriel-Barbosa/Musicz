"use client"

import Image from "next/image"
import type { DeezerPlaylist } from "@/lib/deezer"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { useMusic } from "@/lib/music-context"

interface PlaylistHeaderProps {
  playlist: DeezerPlaylist
}

export function PlaylistHeader({ playlist }: PlaylistHeaderProps) {
  const { playQueue } = useMusic()

  const handlePlayAll = () => {
    if (playlist.tracks?.data) {
      playQueue(playlist.tracks.data)
    }
  }

  return (
    <div className="relative bg-gradient-to-b from-primary/20 to-background p-6 md:p-8">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
        <div className="relative h-48 w-48 md:h-56 md:w-56 rounded-lg overflow-hidden shadow-2xl flex-shrink-0">
          <Image
            src={playlist.picture_xl || playlist.picture_big || "/placeholder.svg?height=300&width=300"}
            alt={playlist.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase">Playlist</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-2 text-balance">
              {playlist.title}
            </h1>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{playlist.user.name}</span>
            <span>•</span>
            <span>{playlist.nb_tracks} músicas</span>
          </div>

          <Button size="lg" onClick={handlePlayAll} className="rounded-full">
            <Play className="h-5 w-5 mr-2" />
            Reproduzir
          </Button>
        </div>
      </div>
    </div>
  )
}