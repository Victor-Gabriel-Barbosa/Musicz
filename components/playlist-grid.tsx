import Link from "next/link"
import Image from "next/image"
import type { DeezerPlaylist } from "@/lib/deezer"
import { Card } from "@/components/ui/card"

interface PlaylistGridProps {
  playlists: DeezerPlaylist[]
}

export function PlaylistGrid({ playlists }: PlaylistGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {playlists.map((playlist) => (
        <Link key={playlist.id} href={`/playlist/${playlist.id}`}>
          <Card className="group overflow-hidden hover:bg-accent transition-colors p-4">
            <div className="relative aspect-square rounded-md overflow-hidden mb-4">
              <Image
                src={playlist.picture_medium || "/placeholder.svg?height=200&width=200"}
                alt={playlist.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <div>
              <h3 className="font-semibold text-foreground truncate mb-1">{playlist.title}</h3>
              <p className="text-sm text-muted-foreground">
                {playlist.nb_tracks} músicas • {playlist.user.name}
              </p>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}