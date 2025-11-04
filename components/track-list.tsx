"use client"

import type { DeezerTrack } from "@/lib/deezer"
import { useMusic } from "@/lib/music-context"
import { usePlaylist } from "@/lib/playlist-context"
import { formatDuration } from "@/lib/deezer"
import { Play, Pause, Heart, MoreVertical } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AddToPlaylistDialog } from "@/components/add-to-playlist-dialog"

interface TrackListProps {
  tracks: DeezerTrack[]
  showAlbumColumn?: boolean
}

export function TrackList({ tracks, showAlbumColumn = true }: TrackListProps) {
  const { currentTrack, isPlaying, playQueue, togglePlay } = useMusic()
  const { toggleLikeTrack, isTrackLiked } = usePlaylist()

  const validTracks = tracks.filter(
    (track) =>
      track &&
      track.id &&
      track.title &&
      track.artist &&
      track.artist.name &&
      track.album &&
      track.album.title &&
      track.duration,
  )

  if (validTracks.length === 0) {
    return null
  }

  const handlePlayTrack = (track: DeezerTrack, index: number) => {
    if (currentTrack?.id === track.id) {
      togglePlay()
    } else {
      playQueue(validTracks, index)
    }
  }

  return (
    <div className="space-y-1">
      {/* Header - hidden on mobile */}
      <div className="hidden md:grid md:grid-cols-[auto_1fr_1fr_auto_auto] gap-4 px-4 py-2 text-sm text-muted-foreground border-b border-border">
        <div className="w-12">#</div>
        <div>Título</div>
        {showAlbumColumn && <div>Álbum</div>}
        <div className="w-16 text-right">Duração</div>
        <div className="w-20"></div>
      </div>

      {/* Track rows */}
      {validTracks.map((track, index) => {
        const isCurrentTrack = currentTrack?.id === track.id
        const isCurrentlyPlaying = isCurrentTrack && isPlaying
        const liked = isTrackLiked(track.id)

        return (
          <div
            key={`${track.id}-${index}`}
            className={`grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_1fr_1fr_auto_auto] gap-4 px-4 py-3 rounded-md hover:bg-accent transition-colors group ${
              isCurrentTrack ? "bg-accent" : ""
            }`}
          >
            {/* Play button / Number */}
            <div className="w-12 flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handlePlayTrack(track, index)}
              >
                {isCurrentlyPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <span className="text-sm group-hover:hidden text-muted-foreground">{index + 1}</span>
            </div>

            {/* Title and Artist */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative h-10 w-10 rounded overflow-hidden flex-shrink-0">
                <Image
                  src={track.album.cover_medium || "/placeholder.svg?height=40&width=40"}
                  alt={track.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-medium truncate ${isCurrentTrack ? "text-primary" : "text-foreground"}`}>
                  {track.title}
                </p>
                <Link
                  href={`/artist/${track.artist.id}`}
                  className="text-sm hover:text-foreground hover:underline truncate block text-muted-foreground"
                >
                  {track.artist.name}
                </Link>
              </div>
            </div>

            {/* Album - hidden on mobile */}
            {showAlbumColumn && (
              <div className="hidden md:flex items-center min-w-0">
                <Link
                  href={`/album/${track.album.id}`}
                  className="text-sm text-muted-foreground hover:text-foreground hover:underline truncate"
                >
                  {track.album.title}
                </Link>
              </div>
            )}

            {/* Duration */}
            <div className="flex items-center justify-end w-16">
              <span className="text-sm text-muted-foreground">{formatDuration(track.duration)}</span>
            </div>

            <div className="flex items-center justify-end gap-1 w-20">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => toggleLikeTrack(track)}
              >
                <Heart className={`h-4 w-4 ${liked ? "fill-primary text-primary" : ""}`} />
              </Button>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <AddToPlaylistDialog track={track}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </AddToPlaylistDialog>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
