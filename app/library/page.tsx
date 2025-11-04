"use client"

import { Sidebar } from "@/components/sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { Player } from "@/components/player"
import { usePlaylist } from "@/lib/playlist-context"
import { useMusic } from "@/lib/music-context"
import { Music, Heart, Clock, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function LibraryPage() {
  const { playlists, likedTracks, createPlaylist, deletePlaylist } = usePlaylist()
  const { playQueue } = useMusic()
  const [open, setOpen] = useState(false)
  const [newPlaylistName, setNewPlaylistName] = useState("")
  const [newPlaylistDescription, setNewPlaylistDescription] = useState("")

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim(), newPlaylistDescription.trim())
      setNewPlaylistName("")
      setNewPlaylistDescription("")
      setOpen(false)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto pb-32 lg:pb-24">
        <div className="p-6 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Sua Biblioteca</h1>
              <p className="text-muted-foreground">Suas músicas, álbuns e playlists favoritas</p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Playlist
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Nova Playlist</DialogTitle>
                  <DialogDescription>Dê um nome e descrição para sua playlist</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      placeholder="Minha Playlist"
                      value={newPlaylistName}
                      onChange={(e) => setNewPlaylistName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleCreatePlaylist()}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição (opcional)</Label>
                    <Input
                      id="description"
                      placeholder="Descrição da playlist"
                      value={newPlaylistDescription}
                      onChange={(e) => setNewPlaylistDescription(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleCreatePlaylist} disabled={!newPlaylistName.trim()} className="w-full">
                    Criar Playlist
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/library/liked">
              <div className="bg-card border border-border rounded-lg p-6 hover:bg-accent transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Músicas Curtidas</h3>
                    <p className="text-sm text-muted-foreground">{likedTracks.length} músicas</p>
                  </div>
                </div>
              </div>
            </Link>

            <div className="bg-card border border-border rounded-lg p-6 hover:bg-accent transition-colors cursor-pointer opacity-50">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Tocadas Recentemente</h3>
                  <p className="text-sm text-muted-foreground">Em breve</p>
                </div>
              </div>
            </div>
          </div>

          {playlists.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Suas Playlists</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {playlists.map((playlist) => (
                  <div key={playlist.id} className="group relative">
                    <Link href={`/library/playlist/${playlist.id}`}>
                      <div className="bg-card border border-border rounded-lg p-4 hover:bg-accent transition-colors cursor-pointer">
                        <div className="aspect-square rounded-md bg-muted mb-4 overflow-hidden relative">
                          {playlist.coverImage ? (
                            <Image
                              src={playlist.coverImage || "/placeholder.svg"}
                              alt={playlist.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Music className="h-12 w-12 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <h3 className="font-semibold text-foreground truncate">{playlist.name}</h3>
                        <p className="text-sm text-muted-foreground">{playlist.tracks.length} músicas</p>
                      </div>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir Playlist</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir a playlist "{playlist.name}"? Esta ação não pode ser
                            desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deletePlaylist(playlist.id)}>Excluir</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))}
              </div>
            </div>
          )}

          {playlists.length === 0 && likedTracks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Sua biblioteca está vazia. Comece a explorar músicas para adicionar suas favoritas aqui!
              </p>
            </div>
          )}
        </div>
      </main>

      <MobileNav />
      <Player />
    </div>
  )
}