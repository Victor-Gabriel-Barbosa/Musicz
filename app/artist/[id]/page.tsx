"use client"

import { useState, useEffect } from "react"
import { getArtist, getArtistTopTracks, getArtistAlbums } from "@/lib/deezer"
import { Sidebar } from "@/components/sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { Player } from "@/components/player"
import { ArtistHeader } from "@/components/artist-header"
import { TrackList } from "@/components/track-list"
import { AlbumGrid } from "@/components/album-grid"
import { useParams, useRouter } from "next/navigation"
import type { DeezerArtist, DeezerTrack, DeezerAlbum } from "@/lib/deezer"

export default function ArtistPage() {
  const params = useParams()
  const router = useRouter()
  const [artist, setArtist] = useState<DeezerArtist | null>(null)
  const [topTracks, setTopTracks] = useState<DeezerTrack[]>([])
  const [albums, setAlbums] = useState<DeezerAlbum[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchArtistData() {
      // Garante que temos o ID antes de fazer as requisições
      if (!params?.id) return

      try {
        setIsLoading(true)
        const artistId = Number(params.id)
        
        // Valida se é um número válido
        if (isNaN(artistId)) {
          console.error("Invalid artist ID:", params.id)
          setError(true)
          return
        }

        console.log("Fetching artist data for ID:", artistId)
        
        const [artistData, topTracksData, albumsData] = await Promise.all([
          getArtist(artistId),
          getArtistTopTracks(artistId),
          getArtistAlbums(artistId),
        ])

        if (!artistData) {
          setError(true)
          return
        }

        setArtist(artistData)
        setTopTracks(topTracksData)
        setAlbums(albumsData)
      } catch (err) {
        console.error("[v0] Error loading artist:", err)
        setError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchArtistData()
  }, [params?.id])

  // Redireciona para 404 se houver erro
  useEffect(() => {
    if (error) {
      router.push('/404')
    }
  }, [error, router])

  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto pb-32 lg:pb-24">
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        </main>
        <MobileNav />
        <Player />
      </div>
    )
  }

  if (!artist) {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto pb-32 lg:pb-24">
        <ArtistHeader artist={artist} />

        <div className="p-6 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Músicas Populares</h2>
            {topTracks.length > 0 ? (
              <TrackList tracks={topTracks} />
            ) : (
              <p className="text-muted-foreground">Nenhuma música disponível</p>
            )}
          </section>

          {albums.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Álbuns</h2>
              <AlbumGrid albums={albums} />
            </section>
          )}
        </div>
      </main>

      <MobileNav />
      <Player />
    </div>
  )
}
