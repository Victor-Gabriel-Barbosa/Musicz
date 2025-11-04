import Link from "next/link"
import Image from "next/image"
import type { DeezerAlbum } from "@/lib/deezer"
import { Card } from "@/components/ui/card"

interface AlbumGridProps {
  albums: DeezerAlbum[]
}

export function AlbumGrid({ albums }: AlbumGridProps) {
  const validAlbums = albums.filter((album) => album && album.id && album.title && album.artist && album.artist.name)

  if (validAlbums.length === 0) return null

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {validAlbums.map((album) => (
        <Link key={album.id} href={`/album/${album.id}`}>
          <Card className="group overflow-hidden hover:bg-accent transition-colors p-4">
            <div className="relative aspect-square rounded-md overflow-hidden mb-4">
              <Image
                src={album.cover_medium || "/placeholder.svg?height=200&width=200"}
                alt={album.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <div>
              <h3 className="font-semibold text-foreground truncate mb-1">{album.title}</h3>
              <p className="text-sm text-muted-foreground truncate">{album.artist.name}</p>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}