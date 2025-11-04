"use client"

import { Sidebar } from "@/components/sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { Player } from "@/components/player"
import { usePlaylist } from "@/lib/playlist-context"
import { useMusic } from "@/lib/music-context"
import { TrackList } from "@/components/track-list"
import { Button } from "@/components/ui/button"
import { Heart, Play } from "lucide-react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function LikedTracksPage() {
  const { likedTracks } = usePlaylist()
  const { playQueue } = useMusic()

  const handlePlayAll = () => {
    if (likedTracks.length > 0) playQueue(likedTracks)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto pb-32 lg:pb-24">
        <div className="relative">
          {/* Header */}
          <div className="bg-gradient-to-b from-primary/20 to-background p-6 md:p-8">
            <Link href="/library">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div className="flex items-end gap-6">
              <div className="h-48 w-48 rounded-lg bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center flex-shrink-0">
                <Heart className="h-24 w-24 text-white fill-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground mb-2">PLAYLIST</p>
                <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 truncate">Músicas Curtidas</h1>
                <p className="text-sm text-muted-foreground">{likedTracks.length} músicas</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 flex items-center gap-4">
            <Button
              size="lg"
              className="rounded-full h-14 w-14"
              onClick={handlePlayAll}
              disabled={likedTracks.length === 0}
            >
              <Play className="h-6 w-6 fill-current" />
            </Button>
          </div>

          {/* Track List */}
          <div className="px-6 pb-6">
            {likedTracks.length > 0 ? (
              <TrackList tracks={likedTracks} />
            ) : (
              <div className="text-center py-12">
                <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Você ainda não curtiu nenhuma música.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Explore e curta suas músicas favoritas para vê-las aqui!
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <MobileNav />
      <Player />
    </div>
  )
}