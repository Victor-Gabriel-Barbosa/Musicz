import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { MusicProvider } from "@/lib/music-context"
import { PlaylistProvider } from "@/lib/playlist-context"
import { AuthProvider } from "@/lib/auth-context"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Musicz - Seu App de Música",
  description: "Descubra e ouça suas músicas favoritas",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`font-sans antialiased`}>
        <AuthProvider>
          <MusicProvider>
            <PlaylistProvider>{children}</PlaylistProvider>
          </MusicProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
