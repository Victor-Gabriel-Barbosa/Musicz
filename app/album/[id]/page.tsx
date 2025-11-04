"use client"

import { useState, useEffect } from "react"
import { getAlbum } from "@/lib/deezer"
import { Sidebar } from "@/components/sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { Player } from "@/components/player"
import { AlbumHeader } from "@/components/album-header"
import { TrackList } from "@/components/track-list"
import { useParams, useRouter } from "next/navigation"
import type { DeezerAlbum } from "@/lib/deezer"

export default function AlbumPage() {
  const params = useParams()
  const router = useRouter()
  const [album, setAlbum] = useState<DeezerAlbum | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchAlbumData() {
      if (!params?.id) return

      try {
        setIsLoading(true)
        const albumId = Number(params.id)
        
        if (isNaN(albumId)) {
          console.error("Invalid album ID:", params.id)
          setError(true)
          return
        }

        const albumData = await getAlbum(albumId)

        if (!albumData) {
          setError(true)
          return
        }

        setAlbum(albumData)
      } catch (err) {
        console.error("[v0] Error loading album:", err)
        setError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAlbumData()
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

  if (!album) {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto pb-32 lg:pb-24">
        <AlbumHeader album={album} />

        <div className="p-6">
          <TrackList tracks={album.tracks?.data || []} showAlbumColumn={false} />
        </div>
      </main>

      <MobileNav />
      <Player />
    </div>
  )
}
