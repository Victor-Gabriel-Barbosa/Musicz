import Link from "next/link"
import Image from "next/image"
import type { DeezerArtist } from "@/lib/deezer"
import { Card } from "@/components/ui/card"

interface ArtistGridProps {
  artists: DeezerArtist[]
}

export function ArtistGrid({ artists }: ArtistGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {artists.map((artist) => (
        <Link key={artist.id} href={`/artist/${artist.id}`}>
          <Card className="group overflow-hidden hover:bg-accent transition-colors p-4">
            <div className="relative aspect-square rounded-full overflow-hidden mb-4">
              <Image
                src={artist.picture_medium || "/placeholder.svg?height=200&width=200"}
                alt={artist.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-foreground truncate">{artist.name}</h3>
              <p className="text-sm text-muted-foreground">{artist.nb_fan?.toLocaleString()} fãs</p>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}