"use client"

import { useState, useEffect } from "react"
import { getPlaylist } from "@/lib/deezer"
import { Sidebar } from "@/components/sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { Player } from "@/components/player"
import { PlaylistHeader } from "@/components/playlist-header"
import { TrackList } from "@/components/track-list"
import { useParams, useRouter } from "next/navigation"
import type { DeezerPlaylist } from "@/lib/deezer"

export default function PlaylistPage() {
  const params = useParams()
  const router = useRouter()
  const [playlist, setPlaylist] = useState<DeezerPlaylist | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchPlaylistData() {
      if (!params?.id) return

      try {
        setIsLoading(true)
        const playlistId = Number(params.id)
        
        if (isNaN(playlistId)) {
          console.error("Invalid playlist ID:", params.id)
          setError(true)
          return
        }

        const playlistData = await getPlaylist(playlistId)

        if (!playlistData) {
          setError(true)
          return
        }

        setPlaylist(playlistData)
      } catch (err) {
        console.error("[v0] Error loading playlist:", err)
        setError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlaylistData()
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

  if (!playlist) {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto pb-32 lg:pb-24">
        <PlaylistHeader playlist={playlist} />

        <div className="p-6">
          <TrackList tracks={playlist.tracks?.data || []} />
        </div>
      </main>

      <MobileNav />
      <Player />
    </div>
  )
}
