"use client"
import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react"
import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  onSnapshot,
  getDoc,
  getDocs,
} from "firebase/firestore"
import { db } from "./firebase"
import { useAuth } from "./auth-context"
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
  isLoading: boolean
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined)

const STORAGE_KEY = "music-playlists"
const LIKED_TRACKS_KEY = "liked-tracks"

// Helper para remover propriedades indefinidas antes de salvar no Firestore
function sanitizeForFirestore<T extends Record<string, any>>(obj: T): Record<string, any> {
  const cleaned: Record<string, any> = {}
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (value !== null && typeof value === "object" && !Array.isArray(value)) {
        cleaned[key] = sanitizeForFirestore(value)
      } else if (Array.isArray(value)) {
        cleaned[key] = value.map((item) =>
          typeof item === "object" && item !== null ? sanitizeForFirestore(item) : item
        )
      } else {
        cleaned[key] = value
      }
    }
  }
  return cleaned
}

export function PlaylistProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth()
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [likedTracks, setLikedTracks] = useState<DeezerTrack[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const isInitialSyncDone = useRef(false)

  // Carregamento inicial do armazenamento local (para visitantes ou renderização inicial)
  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const storedLiked = localStorage.getItem(LIKED_TRACKS_KEY)

      if (stored) {
        setPlaylists(JSON.parse(stored))
      }
      if (storedLiked) {
        setLikedTracks(JSON.parse(storedLiked))
      }
    } catch (e) {
      console.error("[Musicz] Error loading initial localStorage:", e)
    } finally {
      if (!user) {
        setIsLoading(false)
      }
    }
  }, [])

  // Sincronização do Firestore em tempo real quando o usuário está autenticado
  useEffect(() => {
    if (authLoading) return

    if (!user) {
      // Usuário desconectado: restaurar do armazenamento local
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        const storedLiked = localStorage.getItem(LIKED_TRACKS_KEY)
        setPlaylists(stored ? JSON.parse(stored) : [])
        setLikedTracks(storedLiked ? JSON.parse(storedLiked) : [])
      } catch (e) {
        console.error("[Musicz] Error reading localStorage after logout:", e)
      }
      setIsLoading(false)
      isInitialSyncDone.current = false
      return
    }

    setIsLoading(true)
    const userId = user.uid

    // Migração automática de dados de convidado no primeiro login
    const migrateLocalDataIfNeeded = async () => {
      if (isInitialSyncDone.current) return
      isInitialSyncDone.current = true

      try {
        const storedPlaylistsStr = localStorage.getItem(STORAGE_KEY)
        const storedLikedStr = localStorage.getItem(LIKED_TRACKS_KEY)
        const localPlaylists: Playlist[] = storedPlaylistsStr ? JSON.parse(storedPlaylistsStr) : []
        const localLiked: DeezerTrack[] = storedLikedStr ? JSON.parse(storedLikedStr) : []

        // Verifica o documento do usuário no Firestore
        const userDocRef = doc(db, "users", userId)
        const userDocSnap = await getDoc(userDocRef)

        if (userDocSnap.exists()) {
          const data = userDocSnap.data()
          const remoteLiked: DeezerTrack[] = Array.isArray(data.likedTracks) ? data.likedTracks : []

          // Mescla faixas favoritas locais no remoto se não estiverem presentes
          if (localLiked.length > 0) {
            const mergedLiked = [...remoteLiked]
            let changed = false
            for (const track of localLiked) {
              if (!mergedLiked.some((t) => t.id === track.id)) {
                mergedLiked.push(track)
                changed = true
              }
            }
            if (changed) {
              await setDoc(userDocRef, { likedTracks: mergedLiked }, { merge: true })
            }
          }
        } else if (localLiked.length > 0) {
          // Se ainda não houver um documento, crie um com as faixas favoritas locais
          await setDoc(userDocRef, { likedTracks: localLiked }, { merge: true })
        }

        // Migra playlists locais
        if (localPlaylists.length > 0) {
          const playlistsColRef = collection(db, "users", userId, "playlists")
          const existingPlaylistsSnap = await getDocs(playlistsColRef)
          const existingIds = new Set(existingPlaylistsSnap.docs.map((d) => d.id))

          for (const playlist of localPlaylists) {
            if (!existingIds.has(playlist.id)) {
              const playlistDocRef = doc(db, "users", userId, "playlists", playlist.id)
              await setDoc(playlistDocRef, sanitizeForFirestore(playlist))
            }
          }
        }
      } catch (err) {
        console.error("[Musicz] Error during local to Firestore migration:", err)
      }
    }

    migrateLocalDataIfNeeded()

    // Ouvinte do Firestore: Faixas favoritas de users/{userId}
    const userDocRef = doc(db, "users", userId)
    const unsubUser = onSnapshot(
      userDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data()
          if (Array.isArray(data.likedTracks)) {
            setLikedTracks(data.likedTracks)
            localStorage.setItem(LIKED_TRACKS_KEY, JSON.stringify(data.likedTracks))
          }
        }
      },
      (error) => {
        console.error("[Musicz] Error listening to user liked tracks in Firestore:", error)
      }
    )

    // Ouvinte do Firestore: Playlists de users/{userId}/playlists
    const playlistsColRef = collection(db, "users", userId, "playlists")
    const unsubPlaylists = onSnapshot(
      playlistsColRef,
      (querySnap) => {
        const fetchedPlaylists: Playlist[] = []
        querySnap.forEach((docItem) => {
          const data = docItem.data()
          fetchedPlaylists.push({
            id: docItem.id,
            name: data.name || "",
            description: data.description || undefined,
            tracks: Array.isArray(data.tracks) ? data.tracks : [],
            createdAt: data.createdAt || Date.now(),
            coverImage: data.coverImage || undefined,
          })
        })

        // Ordena playlists por data de criação (mais antigas primeiro ou mais recentes primeiro)
        fetchedPlaylists.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0))
        setPlaylists(fetchedPlaylists)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fetchedPlaylists))
        setIsLoading(false)
      },
      (error) => {
        console.error("[Musicz] Error listening to playlists in Firestore:", error)
        setIsLoading(false)
      }
    )

    return () => {
      unsubUser()
      unsubPlaylists()
    }
  }, [user, authLoading])

  // Salva no localStorage sempre que o estado muda (para fallback offline e de convidado)
  useEffect(() => {
    if (!user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists))
    }
  }, [playlists, user])

  useEffect(() => {
    if (!user) {
      localStorage.setItem(LIKED_TRACKS_KEY, JSON.stringify(likedTracks))
    }
  }, [likedTracks, user])

  const createPlaylist = (name: string, description?: string): Playlist => {
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      description: description || undefined,
      tracks: [],
      createdAt: Date.now(),
    }

    setPlaylists((prev) => [...prev, newPlaylist])

    if (user) {
      const playlistDocRef = doc(db, "users", user.uid, "playlists", newPlaylist.id)
      setDoc(playlistDocRef, sanitizeForFirestore(newPlaylist)).catch((err) => {
        console.error("[Musicz] Error creating playlist in Firestore:", err)
      })
    }

    return newPlaylist
  }

  const deletePlaylist = (id: string) => {
    setPlaylists((prev) => prev.filter((p) => p.id !== id))

    if (user) {
      const playlistDocRef = doc(db, "users", user.uid, "playlists", id)
      deleteDoc(playlistDocRef).catch((err) => {
        console.error("[Musicz] Error deleting playlist in Firestore:", err)
      })
    }
  }

  const addTrackToPlaylist = (playlistId: string, track: DeezerTrack) => {
    setPlaylists((prev) => {
      const target = prev.find((p) => p.id === playlistId)
      if (!target) return prev

      const trackExists = target.tracks.some((t) => t.id === track.id)
      if (trackExists) return prev

      const updatedTracks = [...target.tracks, track]
      const updatedCover = target.tracks.length === 0 ? track.album.cover_medium : target.coverImage

      const updatedPlaylist: Playlist = {
        ...target,
        tracks: updatedTracks,
        coverImage: updatedCover,
      }

      if (user) {
        const playlistDocRef = doc(db, "users", user.uid, "playlists", playlistId)
        setDoc(playlistDocRef, sanitizeForFirestore(updatedPlaylist), { merge: true }).catch((err) => {
          console.error("[Musicz] Error adding track to playlist in Firestore:", err)
        })
      }

      return prev.map((p) => (p.id === playlistId ? updatedPlaylist : p))
    })
  }

  const removeTrackFromPlaylist = (playlistId: string, trackId: number) => {
    setPlaylists((prev) => {
      const target = prev.find((p) => p.id === playlistId)
      if (!target) return prev

      const updatedTracks = target.tracks.filter((t) => t.id !== trackId)
      const updatedPlaylist: Playlist = {
        ...target,
        tracks: updatedTracks,
      }

      if (user) {
        const playlistDocRef = doc(db, "users", user.uid, "playlists", playlistId)
        setDoc(playlistDocRef, sanitizeForFirestore(updatedPlaylist), { merge: true }).catch((err) => {
          console.error("[Musicz] Error removing track from playlist in Firestore:", err)
        })
      }

      return prev.map((p) => (p.id === playlistId ? updatedPlaylist : p))
    })
  }

  const toggleLikeTrack = (track: DeezerTrack) => {
    setLikedTracks((prev) => {
      const isLiked = prev.some((t) => t.id === track.id)
      const nextLiked = isLiked ? prev.filter((t) => t.id !== track.id) : [...prev, track]

      if (user) {
        const userDocRef = doc(db, "users", user.uid)
        setDoc(userDocRef, { likedTracks: nextLiked }, { merge: true }).catch((err) => {
          console.error("[Musicz] Error updating liked tracks in Firestore:", err)
        })
      }

      return nextLiked
    })
  }

  const isTrackLiked = (trackId: number): boolean => {
    return likedTracks.some((t) => t.id === trackId)
  }

  const updatePlaylist = (id: string, updates: Partial<Playlist>) => {
    setPlaylists((prev) => {
      const target = prev.find((p) => p.id === id)
      if (!target) return prev

      const updatedPlaylist: Playlist = { ...target, ...updates }

      if (user) {
        const playlistDocRef = doc(db, "users", user.uid, "playlists", id)
        setDoc(playlistDocRef, sanitizeForFirestore(updates), { merge: true }).catch((err) => {
          console.error("[Musicz] Error updating playlist in Firestore:", err)
        })
      }

      return prev.map((p) => (p.id === id ? updatedPlaylist : p))
    })
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
        isLoading,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  )
}

export function usePlaylist() {
  const context = useContext(PlaylistContext)
  if (!context) throw new Error("usePlaylist must be used within PlaylistProvider")
  return context
}