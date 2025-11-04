"use client"

import { Sidebar } from "@/components/sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { Player } from "@/components/player"
import { usePlaylist } from "@/lib/playlist-context"
import { useMusic } from "@/lib/music-context"
import { TrackList } from "@/components/track-list"
import { Button } from "@/components/ui/button"
import { Music, Play, ArrowLeft, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
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

export default function PlaylistPage() {
  const params = useParams()
  const router = useRouter()
  const { playlists, updatePlaylist, deletePlaylist } = usePlaylist()
  const { playQueue } = useMusic()
  const [editOpen, setEditOpen] = useState(false)
  const [editName, setEditName] = useState("")
  const [editDescription, setEditDescription] = useState("")

  const playlist = playlists.find((p) => p.id === params.id)

  if (!playlist) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto pb-32 lg:pb-24">
          <div className="p-6">
            <Link href="/library">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div className="text-center py-12">
              <p className="text-muted-foreground">Playlist não encontrada.</p>
            </div>
          </div>
        </main>
        <MobileNav />
        <Player />
      </div>
    )
  }

  const handlePlayAll = () => {
    if (playlist.tracks.length > 0) {
      playQueue(playlist.tracks)
    }
  }

  const handleEdit = () => {
    setEditName(playlist.name)
    setEditDescription(playlist.description || "")
    setEditOpen(true)
  }

  const handleSaveEdit = () => {
    updatePlaylist(playlist.id, {
      name: editName.trim(),
      description: editDescription.trim(),
    })
    setEditOpen(false)
  }

  const handleDelete = () => {
    deletePlaylist(playlist.id)
    router.push("/library")
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto pb-32 lg:pb-24">
        <div className="relative">
          {/* Header */}
          <div className="bg-gradient-to-b from-primary/20 to-background p-6 md:p-8">
            <Link href="/library">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div className="flex items-end gap-6">
              <div className="h-48 w-48 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
                {playlist.coverImage ? (
                  <Image
                    src={playlist.coverImage || "/placeholder.svg"}
                    alt={playlist.name}
                    width={192}
                    height={192}
                    className="object-cover"
                  />
                ) : (
                  <Music className="h-24 w-24 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground mb-2">PLAYLIST</p>
                <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 truncate">{playlist.name}</h1>
                {playlist.description && <p className="text-sm text-muted-foreground mb-2">{playlist.description}</p>}
                <p className="text-sm text-muted-foreground">{playlist.tracks.length} músicas</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 flex items-center gap-4">
            <Button
              size="lg"
              className="rounded-full h-14 w-14"
              onClick={handlePlayAll}
              disabled={playlist.tracks.length === 0}
            >
              <Play className="h-6 w-6 fill-current" />
            </Button>

            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleEdit}>
                  <Pencil className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editar Playlist</DialogTitle>
                  <DialogDescription>Altere o nome e descrição da playlist</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Nome</Label>
                    <Input
                      id="edit-name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-description">Descrição</Label>
                    <Input
                      id="edit-description"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleSaveEdit} disabled={!editName.trim()} className="w-full">
                    Salvar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir Playlist</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir a playlist "{playlist.name}"? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* Track List */}
          <div className="px-6 pb-6">
            {playlist.tracks.length > 0 ? (
              <TrackList tracks={playlist.tracks} />
            ) : (
              <div className="text-center py-12">
                <Music className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Esta playlist está vazia.</p>
                <p className="text-sm text-muted-foreground mt-2">Adicione músicas para começar a ouvir!</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <MobileNav />
      <Player />
    </div>
  )
}
