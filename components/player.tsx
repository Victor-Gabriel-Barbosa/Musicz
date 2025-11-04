"use client"

import { useMusic } from "@/lib/music-context"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react"
import { formatDuration } from "@/lib/deezer"
import Image from "next/image"
import { useState } from "react"

export function Player() {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    nextTrack,
    previousTrack,
    currentTime,
    duration,
    seekTo,
    volume,
    setVolume,
  } = useMusic()

  const [showVolume, setShowVolume] = useState(false)

  if (!currentTrack) {
    return null
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 px-4 py-3">
      <div className="flex items-center gap-4 max-w-screen-2xl mx-auto">
        {/* Track Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative h-14 w-14 rounded-md overflow-hidden flex-shrink-0">
            <Image
              src={currentTrack.album.cover_medium || "/placeholder.svg"}
              alt={currentTrack.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground truncate">{currentTrack.title}</p>
            <p className="text-xs text-muted-foreground truncate">{currentTrack.artist.name}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-2 flex-1 max-w-2xl">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={previousTrack} className="h-8 w-8">
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button variant="default" size="icon" onClick={togglePlay} className="h-10 w-10 rounded-full">
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={nextTrack} className="h-8 w-8">
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          <div className="hidden md:flex items-center gap-2 w-full">
            <span className="text-xs text-muted-foreground w-10 text-right">
              {formatDuration(Math.floor(currentTime))}
            </span>
            <Slider
              value={[progress]}
              max={100}
              step={0.1}
              onValueChange={([value]) => {
                const newTime = (value / 100) * duration
                seekTo(newTime)
              }}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-10">{formatDuration(Math.floor(duration))}</span>
          </div>
        </div>

        {/* Volume */}
        <div className="hidden lg:flex items-center gap-2 flex-1 justify-end">
          <Button variant="ghost" size="icon" onClick={() => setShowVolume(!showVolume)} className="h-8 w-8">
            {volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          {showVolume && (
            <Slider
              value={[volume * 100]}
              max={100}
              step={1}
              onValueChange={([value]) => setVolume(value / 100)}
              className="w-24"
            />
          )}
        </div>
      </div>
    </div>
  )
}
