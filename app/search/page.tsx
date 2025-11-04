"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { Player } from "@/components/player"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SearchIcon } from "lucide-react"
import { searchTracks, searchAlbums, searchArtists, searchPlaylists } from "@/lib/deezer"
import type { DeezerTrack, DeezerAlbum, DeezerArtist, DeezerPlaylist } from "@/lib/deezer"
import { TrackList } from "@/components/track-list"
import { AlbumGrid } from "@/components/album-grid"
import { ArtistGrid } from "@/components/artist-grid"
import { PlaylistGrid } from "@/components/playlist-grid"
import { useDebounce } from "@/hooks/use-debounce"

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [tracks, setTracks] = useState<DeezerTrack[]>([])
  const [albums, setAlbums] = useState<DeezerAlbum[]>([])
  const [artists, setArtists] = useState<DeezerArtist[]>([])
  const [playlists, setPlaylists] = useState<DeezerPlaylist[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const debouncedQuery = useDebounce(query, 500)

  useEffect(() => {
    if (debouncedQuery.trim()) performSearch(debouncedQuery)
    else {
      setTracks([])
      setAlbums([])
      setArtists([])
      setPlaylists([])
    }
  }, [debouncedQuery])

  async function performSearch(searchQuery: string) {
    setIsLoading(true)
    try {
      const [tracksData, albumsData, artistsData, playlistsData] = await Promise.all([
        searchTracks(searchQuery),
        searchAlbums(searchQuery),
        searchArtists(searchQuery),
        searchPlaylists(searchQuery),
      ])
      setTracks(tracksData)
      setAlbums(albumsData)
      setArtists(artistsData)
      setPlaylists(playlistsData)
    } catch (error) {
      console.error("[v0] Search error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const hasResults = tracks.length > 0 || albums.length > 0 || artists.length > 0 || playlists.length > 0

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto pb-32 lg:pb-24">
        <div className="p-4 md:p-6 space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 md:mb-6">Buscar</h1>
            <div className="relative max-w-2xl">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar músicas, álbuns, artistas ou playlists..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          )}

          {!isLoading && hasResults && (
            <Tabs defaultValue="tracks" className="w-full">
              <TabsList className="w-full md:w-auto">
                <TabsTrigger value="tracks" className="flex-1 md:flex-none">
                  Músicas ({tracks.length})
                </TabsTrigger>
                <TabsTrigger value="albums" className="flex-1 md:flex-none">
                  Álbuns ({albums.length})
                </TabsTrigger>
                <TabsTrigger value="artists" className="flex-1 md:flex-none">
                  Artistas ({artists.length})
                </TabsTrigger>
                <TabsTrigger value="playlists" className="flex-1 md:flex-none">
                  Playlists ({playlists.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="tracks" className="mt-6">
                {tracks.length > 0 ? (
                  <TrackList tracks={tracks} />
                ) : (
                  <p className="text-muted-foreground text-center py-12">Nenhuma música encontrada</p>
                )}
              </TabsContent>

              <TabsContent value="albums" className="mt-6">
                {albums.length > 0 ? (
                  <AlbumGrid albums={albums} />
                ) : (
                  <p className="text-muted-foreground text-center py-12">Nenhum álbum encontrado</p>
                )}
              </TabsContent>

              <TabsContent value="artists" className="mt-6">
                {artists.length > 0 ? (
                  <ArtistGrid artists={artists} />
                ) : (
                  <p className="text-muted-foreground text-center py-12">Nenhum artista encontrado</p>
                )}
              </TabsContent>

              <TabsContent value="playlists" className="mt-6">
                {playlists.length > 0 ? (
                  <PlaylistGrid playlists={playlists} />
                ) : (
                  <p className="text-muted-foreground text-center py-12">Nenhuma playlist encontrada</p>
                )}
              </TabsContent>
            </Tabs>
          )}

          {!isLoading && !hasResults && query.trim() && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum resultado encontrado para "{query}"</p>
            </div>
          )}

          {!query.trim() && !isLoading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Digite algo para começar a buscar</p>
            </div>
          )}
        </div>
      </main>

      <MobileNav />
      <Player />
    </div>
  )
}