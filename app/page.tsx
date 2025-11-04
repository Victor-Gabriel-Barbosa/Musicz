"use client"

import { useState, useEffect } from "react"
import { getChartTracks, getChartAlbums } from "@/lib/deezer"
import { Sidebar } from "@/components/sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { Player } from "@/components/player"
import { TrackList } from "@/components/track-list"
import { AlbumGrid } from "@/components/album-grid"
import { AlertCircle } from "lucide-react"
import type { DeezerTrack, DeezerAlbum } from "@/lib/deezer"

export default function HomePage() {
  const [topTracks, setTopTracks] = useState<DeezerTrack[]>([])
  const [topAlbums, setTopAlbums] = useState<DeezerAlbum[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        const [tracks, albums] = await Promise.all([
          getChartTracks(),
          getChartAlbums()
        ])
        setTopTracks(tracks)
        setTopAlbums(albums)
        setError(null)
      } catch (err) {
        console.error("HomePage: Failed to fetch chart data:", err)
        const errorMessage = err instanceof Error ? err.message : "Unknown error"
        setError(`Não foi possível carregar os dados: ${errorMessage}`)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto pb-32 lg:pb-24">
        <div className="p-4 md:p-6 space-y-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Bem-vindo de volta
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Descubra as músicas mais populares do momento
            </p>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {!error && !isLoading && topTracks.length > 0 && (
            <section>
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                Top Músicas
              </h2>
              <TrackList tracks={topTracks} />
            </section>
          )}

          {!error && !isLoading && topAlbums.length > 0 && (
            <section>
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                Álbuns Populares
              </h2>
              <AlbumGrid albums={topAlbums} />
            </section>
          )}
        </div>
      </main>

      <MobileNav />
      <Player />
    </div>
  )
}