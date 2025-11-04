"use client"

import type React from "react"

import { createContext, useContext, useState, useRef, type ReactNode } from "react"
import type { DeezerTrack } from "./deezer"

interface MusicContextType {
  currentTrack: DeezerTrack | null
  isPlaying: boolean
  queue: DeezerTrack[]
  currentTime: number
  duration: number
  volume: number
  playTrack: (track: DeezerTrack) => void
  playQueue: (tracks: DeezerTrack[], startIndex?: number) => void
  togglePlay: () => void
  nextTrack: () => void
  previousTrack: () => void
  seekTo: (time: number) => void
  setVolume: (volume: number) => void
  audioRef: React.RefObject<HTMLAudioElement | null>
}

const MusicContext = createContext<MusicContextType | undefined>(undefined)

export function MusicProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<DeezerTrack | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [queue, setQueue] = useState<DeezerTrack[]>([])
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(0.7)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const playTrack = (track: DeezerTrack) => {
    setCurrentTrack(track)
    setQueue([track])
    setIsPlaying(true)
  }

  const playQueue = (tracks: DeezerTrack[], startIndex = 0) => {
    if (tracks.length === 0) return
    setQueue(tracks)
    setCurrentTrack(tracks[startIndex])
    setIsPlaying(true)
  }

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) audioRef.current.pause()
    else audioRef.current.play()
    
    setIsPlaying(!isPlaying)
  }

  const nextTrack = () => {
    if (queue.length === 0) return
    const currentIndex = queue.findIndex((t) => t.id === currentTrack?.id)
    const nextIndex = (currentIndex + 1) % queue.length
    setCurrentTrack(queue[nextIndex])
    setIsPlaying(true)
  }

  const previousTrack = () => {
    if (queue.length === 0) return
    const currentIndex = queue.findIndex((t) => t.id === currentTrack?.id)
    const prevIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1
    setCurrentTrack(queue[prevIndex])
    setIsPlaying(true)
  }

  const seekTo = (time: number) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = time
    setCurrentTime(time)
  }

  const setVolume = (vol: number) => {
    if (!audioRef.current) return
    audioRef.current.volume = vol
    setVolumeState(vol)
  }

  return (
    <MusicContext.Provider
      value={{
        currentTrack,
        isPlaying,
        queue,
        currentTime,
        duration,
        volume,
        playTrack,
        playQueue,
        togglePlay,
        nextTrack,
        previousTrack,
        seekTo,
        setVolume,
        audioRef,
      }}
    >
      {children}
      <audio
        ref={audioRef}
        src={currentTrack?.preview}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={nextTrack}
        autoPlay={isPlaying}
      />
    </MusicContext.Provider>
  )
}

export function useMusic() {
  const context = useContext(MusicContext)
  if (!context) throw new Error("useMusic must be used within MusicProvider")
  return context
}