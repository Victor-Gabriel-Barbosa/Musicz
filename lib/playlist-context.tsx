"use client"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { DeezerTrack } from "./deezer"

export interface Playlist {
  id: string
  name: string
  description?: string
  tracks: DeezerTrack[]
  createdAt: number
  coverImage?: string
}

interface PlaylistContextType {
  playlists: Playlist[]
  likedTracks: DeezerTrack[]
  createPlaylist: (name: string, description?: string) => Playlist
  deletePlaylist: (id: string) => void
  addTrackToPlaylist: (playlistId: string, track: DeezerTrack) => void
  removeTrackFromPlaylist: (playlistId: string, trackId: number) => void
  toggleLikeTrack: (track: DeezerTrack) => void
  isTrackLiked: (trackId: number) => boolean
  updatePlaylist: (id: string, updates: Partial<Playlist>) => void
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined)

const STORAGE_KEY = "music-playlists"
const LIKED_TRACKS_KEY = "liked-tracks"

export function PlaylistProvider({ children }: { children: ReactNode }) {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [likedTracks, setLikedTracks] = useState<DeezerTrack[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    const storedLiked = localStorage.getItem(LIKED_TRACKS_KEY)

    if (stored) {
      try {
        setPlaylists(JSON.parse(stored))
      } catch (e) {
        console.error("Failed to parse playlists:", e)
      }
    }

    if (storedLiked) {
      try {
        setLikedTracks(JSON.parse(storedLiked))
      } catch (e) {
        console.error("Failed to parse liked tracks:", e)
      }
    }
  }, [])

  // Save to localStorage whenever playlists change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists))
  }, [playlists])

  // Save to localStorage whenever liked tracks change
  useEffect(() => {
    localStorage.setItem(LIKED_TRACKS_KEY, JSON.stringify(likedTracks))
  }, [likedTracks])

  const createPlaylist = (name: string, description?: string): Playlist => {
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      description,
      tracks: [],
      createdAt: Date.now(),
    }
    setPlaylists((prev) => [...prev, newPlaylist])
    return newPlaylist
  }

  const deletePlaylist = (id: string) => {
    setPlaylists((prev) => prev.filter((p) => p.id !== id))
  }

  const addTrackToPlaylist = (playlistId: string, track: DeezerTrack) => {
    setPlaylists((prev) =>
      prev.map((playlist) => {
        if (playlist.id === playlistId) {
          // Check if track already exists
          const trackExists = playlist.tracks.some((t) => t.id === track.id)
          if (trackExists) return playlist

          return {
            ...playlist,
            tracks: [...playlist.tracks, track],
            coverImage: playlist.tracks.length === 0 ? track.album.cover_medium : playlist.coverImage,
          }
        }
        return playlist
      }),
    )
  }

  const removeTrackFromPlaylist = (playlistId: string, trackId: number) => {
    setPlaylists((prev) =>
      prev.map((playlist) => {
        if (playlist.id === playlistId) {
          return {
            ...playlist,
            tracks: playlist.tracks.filter((t) => t.id !== trackId),
          }
        }
        return playlist
      }),
    )
  }

  const toggleLikeTrack = (track: DeezerTrack) => {
    setLikedTracks((prev) => {
      const isLiked = prev.some((t) => t.id === track.id)
      if (isLiked) {
        return prev.filter((t) => t.id !== track.id)
      } else {
        return [...prev, track]
      }
    })
  }

  const isTrackLiked = (trackId: number): boolean => {
    return likedTracks.some((t) => t.id === trackId)
  }

  const updatePlaylist = (id: string, updates: Partial<Playlist>) => {
    setPlaylists((prev) =>
      prev.map((playlist) => {
        if (playlist.id === id) {
          return { ...playlist, ...updates }
        }
        return playlist
      }),
    )
  }

  return (
    <PlaylistContext.Provider
      value={{
        playlists,
        likedTracks,
        createPlaylist,
        deletePlaylist,
        addTrackToPlaylist,
        removeTrackFromPlaylist,
        toggleLikeTrack,
        isTrackLiked,
        updatePlaylist,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  )
}

export function usePlaylist() {
  const context = useContext(PlaylistContext)
  if (!context) {
    throw new Error("usePlaylist must be used within PlaylistProvider")
  }
  return context
}
