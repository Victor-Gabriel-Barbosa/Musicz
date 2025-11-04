"use client"

import Image from "next/image"
import type { DeezerArtist } from "@/lib/deezer"

interface ArtistHeaderProps {
  artist: DeezerArtist
}

export function ArtistHeader({ artist }: ArtistHeaderProps) {
  return (
    <div className="relative bg-linear-to-b from-primary/20 to-background p-6 md:p-8">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
        <div className="relative h-48 w-48 md:h-56 md:w-56 rounded-full overflow-hidden shadow-2xl flex-shrink-0">
          <Image
            src={artist.picture_xl || artist.picture_big || "/placeholder.svg?height=300&width=300"}
            alt={artist.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase">Artista</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-2 text-balance">
              {artist.name}
            </h1>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">{artist.nb_fan?.toLocaleString()} fãs</span>
          </div>
        </div>
      </div>
    </div>
  )
}