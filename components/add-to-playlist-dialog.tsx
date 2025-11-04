"use client"

import type React from "react"

import { useState } from "react"
import { usePlaylist } from "@/lib/playlist-context"
import type { DeezerTrack } from "@/lib/deezer"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Check, ListMusic } from "lucide-react"

interface AddToPlaylistDialogProps {
  track: DeezerTrack
  children?: React.ReactNode
}

export function AddToPlaylistDialog({ track, children }: AddToPlaylistDialogProps) {
  const { playlists, createPlaylist, addTrackToPlaylist } = usePlaylist()
  const [open, setOpen] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newPlaylistName, setNewPlaylistName] = useState("")
  const [addedToPlaylists, setAddedToPlaylists] = useState<Set<string>>(new Set())

  const handleCreateAndAdd = () => {
    if (newPlaylistName.trim()) {
      const newPlaylist = createPlaylist(newPlaylistName.trim())
      addTrackToPlaylist(newPlaylist.id, track)
      setAddedToPlaylists(new Set([...addedToPlaylists, newPlaylist.id]))
      setNewPlaylistName("")
      setShowCreateForm(false)
    }
  }

  const handleAddToPlaylist = (playlistId: string) => {
    addTrackToPlaylist(playlistId, track)
    setAddedToPlaylists(new Set([...addedToPlaylists, playlistId]))
    setTimeout(() => {
      setAddedToPlaylists((prev) => {
        const next = new Set(prev)
        next.delete(playlistId)
        return next
      })
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar à Playlist</DialogTitle>
          <DialogDescription>Escolha uma playlist ou crie uma nova</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!showCreateForm ? (
            <>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => setShowCreateForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Nova Playlist
              </Button>

              {playlists.length > 0 ? (
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-2">
                    {playlists.map((playlist) => {
                      const isAdded = addedToPlaylists.has(playlist.id)
                      const trackExists = playlist.tracks.some((t) => t.id === track.id)

                      return (
                        <Button
                          key={playlist.id}
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => !trackExists && handleAddToPlaylist(playlist.id)}
                          disabled={trackExists}
                        >
                          <ListMusic className="h-4 w-4 mr-2" />
                          <span className="flex-1 text-left truncate">{playlist.name}</span>
                          {isAdded && <Check className="h-4 w-4 text-primary" />}
                          {trackExists && <span className="text-xs text-muted-foreground">Já adicionada</span>}
                        </Button>
                      )
                    })}
                  </div>
                </ScrollArea>
              ) : (
                <p className="text-center text-sm text-muted-foreground py-8">
                  Você ainda não tem playlists. Crie uma para começar!
                </p>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="playlist-name">Nome da Playlist</Label>
                <Input
                  id="playlist-name"
                  placeholder="Minha Playlist"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateAndAdd()}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowCreateForm(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={handleCreateAndAdd} disabled={!newPlaylistName.trim()} className="flex-1">
                  Criar e Adicionar
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}