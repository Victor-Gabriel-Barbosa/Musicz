# Musicz 🎵

Uma aplicação web moderna de streaming de música construída com Next.js, utilizando a API do Deezer e Firebase para autenticação.

![Next.js](https://img.shields.io/badge/Next.js-16.0.0-black)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Firebase](https://img.shields.io/badge/Firebase-Latest-orange)

## 🌐 Demo
Acesse o projeto: https://musicz-d.vercel.app/

## 🎯 Sobre

Musicz é uma aplicação de streaming que permite descobrir, ouvir e gerenciar músicas. Utiliza a API do Deezer para o catálogo musical e oferece recursos como playlists personalizadas, sistema de curtidas e quiz musical interativo.

## ✨ Funcionalidades

- 🎵 Player de áudio com controles completos
- 🔍 Busca por músicas, álbuns, artistas e playlists
- 📚 Biblioteca pessoal com playlists e músicas curtidas
- 🎮 Quiz musical interativo
- 👤 Autenticação com email/senha e Google
- 📱 Interface totalmente responsiva

## 🛠️ Tecnologias

- **Next.js 16** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Firebase** - Autenticação
- **Deezer API** - Catálogo musical
- **Radix UI** - Componentes acessíveis

## 🚀 Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/musicz.git
cd musicz
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env`:

```env
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
```

4. **Execute o projeto**
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📁 Estrutura Principal

```
musicz/
├── app/                    # Páginas e rotas
│   ├── album/[id]/        # Página de álbum
│   ├── artist/[id]/       # Página de artista
│   ├── library/           # Biblioteca do usuário
│   ├── quiz/              # Quiz musical
│   └── api/deezer/        # Proxy para API
├── components/            # Componentes React
│   ├── ui/               # Componentes base
│   ├── player.tsx        # Player de música
│   ├── sidebar.tsx       # Navegação
│   └── track-list.tsx    # Lista de músicas
└── lib/                  # Lógica e contextos
    ├── auth-context.tsx  # Autenticação
    ├── music-context.tsx # Player
    └── deezer.ts         # Cliente API
```

## 🔌 API Deezer

A aplicação usa um proxy Next.js para a API do Deezer:

```typescript
// Buscar músicas
GET /api/deezer?endpoint=/search?q=eminem

// Obter álbum
GET /api/deezer?endpoint=/album/123456

// Top tracks de artista
GET /api/deezer?endpoint=/artist/123456/top
```

## 🎨 Uso dos Contextos

```typescript
// Reproduzir música
import { useMusic } from '@/lib/music-context'

const { playTrack } = useMusic()
playTrack(track)

// Gerenciar playlists
import { usePlaylist } from '@/lib/playlist-context'

const { createPlaylist, addTrackToPlaylist } = usePlaylist()
const playlist = createPlaylist("Minha Playlist")
addTrackToPlaylist(playlist.id, track)
```

## 🚀 Deploy

### Vercel

1. Conecte seu repositório no [Vercel](https://vercel.com)
2. Configure as variáveis de ambiente
3. Deploy automático!

## 📝 Licença

MIT License - Victor Gabriel

---

⭐ Dê uma estrela se este projeto foi útil!
