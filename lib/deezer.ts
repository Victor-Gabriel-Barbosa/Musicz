// Deezer API client

function getBaseUrl() {
  // Client-side pode usar URLs relativas
  if (typeof window !== "undefined") return ""

  // Server-side precisa de URLs absolutas
  // Verifica o URL de implantação do Vercel
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`

  // Fallback to localhost for local development
  return "http://localhost:3000"
}

const API_ROUTE = "/api/deezer"

export interface DeezerTrack {
  id: number
  title: string
  duration: number
  preview: string
  artist: {
    id: number
    name: string
    picture_medium: string
  }
  album: {
    id: number
    title: string
    cover_medium: string
    cover_big: string
    cover_xl: string
  }
}

export interface DeezerAlbum {
  id: number
  title: string
  cover_medium: string
  cover_big: string
  cover_xl: string
  release_date: string
  artist: {
    id: number
    name: string
    picture_medium: string
  }
  tracks?: {
    data: DeezerTrack[]
  }
}

export interface DeezerArtist {
  id: number
  name: string
  picture_medium: string
  picture_big: string
  picture_xl: string
  nb_fan: number
}

export interface DeezerPlaylist {
  id: number
  title: string
  picture_medium: string
  picture_big: string
  picture_xl: string
  nb_tracks: number
  user: {
    name: string
  }
  tracks?: {
    data: DeezerTrack[]
  }
}

async function fetchDeezer(endpoint: string) {
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}${API_ROUTE}?endpoint=${encodeURIComponent(endpoint)}`

  try {
    const response = await fetch(url, {
      cache: "no-store",
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Unknown error" }))
      throw new Error(error.error || "Failed to fetch from Deezer API")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("fetchDeezer error:", error)
    throw error
  }
}

export async function searchTracks(query: string): Promise<DeezerTrack[]> {
  const data = await fetchDeezer(`/search?q=${encodeURIComponent(query)}`)
  return data.data || []
}

export async function searchAlbums(query: string): Promise<DeezerAlbum[]> {
  const data = await fetchDeezer(`/search/album?q=${encodeURIComponent(query)}`)
  return data.data || []
}

export async function searchArtists(query: string): Promise<DeezerArtist[]> {
  const data = await fetchDeezer(`/search/artist?q=${encodeURIComponent(query)}`)
  return data.data || []
}

export async function searchPlaylists(query: string): Promise<DeezerPlaylist[]> {
  const data = await fetchDeezer(`/search/playlist?q=${encodeURIComponent(query)}`)
  return data.data || []
}

export async function getAlbum(id: number): Promise<DeezerAlbum> {
  return fetchDeezer(`/album/${id}`)
}

export async function getArtist(id: number): Promise<DeezerArtist> {
  return fetchDeezer(`/artist/${id}`)
}

export async function getArtistTopTracks(id: number): Promise<DeezerTrack[]> {
  const data = await fetchDeezer(`/artist/${id}/top?limit=10`)
  return data.data || []
}

export async function getArtistAlbums(id: number): Promise<DeezerAlbum[]> {
  const data = await fetchDeezer(`/artist/${id}/albums`)
  return data.data || []
}

export async function getPlaylist(id: number): Promise<DeezerPlaylist> {
  return fetchDeezer(`/playlist/${id}`)
}

export async function getChartTracks(): Promise<DeezerTrack[]> {
  const data = await fetchDeezer("/chart/0/tracks?limit=20")
  return data.data || []
}

export async function getChartAlbums(): Promise<DeezerAlbum[]> {
  const data = await fetchDeezer("/chart/0/albums?limit=20")
  return data.data || []
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}