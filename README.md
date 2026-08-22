# Musicz 🎵

Uma aplicação web de streaming de música construída com Next.js e TypeScript, utilizando a API do Deezer como catálogo musical e o Firebase para autenticação e sincronização de dados na nuvem.

![Next.js](https://img.shields.io/badge/Next.js-16.3.2-black)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4)
![Firebase](https://img.shields.io/badge/Firebase-Latest-orange)
![License](https://img.shields.io/badge/License-MIT-green)

## 🌐 Demo

Acesse o projeto: https://musicz-delta.vercel.app/

## 📸 Preview

<video src="https://github.com/user-attachments/assets/1b7811c1-33ce-41b7-ad7c-2916f231cf84" controls></video>

## 🎯 Sobre

Musicz é uma aplicação de streaming que permite descobrir, ouvir e gerenciar músicas usando o catálogo público da Deezer. Ela oferece playlists personalizadas, sistema de curtidas, um quiz musical interativo, tema claro/escuro e funciona como PWA (instalável no celular ou desktop).

> ℹ️ Como usa a API pública da Deezer, o player reproduz as **prévias de 30 segundos** de cada faixa (é o que a API disponibiliza sem uma parceria comercial), não as músicas completas.

## ✨ Funcionalidades

- 🎵 **Player** com fila de reprodução, play/pause, faixa anterior/próxima, busca no tempo (seek) e controle de volume
- 🔍 **Busca** por músicas, álbuns, artistas e playlists, com debounce
- 📚 **Biblioteca pessoal**: criação, edição e exclusão de playlists, página dedicada às músicas curtidas e modal para adicionar faixas a uma playlist
- 🎮 **Quiz musical**: 10 rodadas geradas a partir do chart da Deezer — o usuário ouve a prévia e adivinha a música ou o artista, acumulando pontuação
- 👤 **Autenticação** com email/senha e login com Google (Firebase Auth), com rotas protegidas
- ☁️ **Sincronização em nuvem**: playlists e curtidas são salvas em tempo real no Firestore para usuários logados, com fallback em `localStorage` para quem navega sem conta
- 🌗 **Tema claro/escuro** com alternância animada
- 📱 **Interface responsiva**: barra lateral no desktop e navegação inferior no mobile
- 📲 **PWA**: pode ser instalada como aplicativo

## 🛠️ Tecnologias

**Frontend**
- [Next.js](https://nextjs.org/) `^16.3.2` (App Router) - Framework React
- [React](https://react.dev/) `19.2.0` - Biblioteca de UI
- [TypeScript](https://www.typescriptlang.org/) `^5` - Tipagem estática
- [Tailwind CSS](https://tailwindcss.com/) `^4` - Estilização
- [shadcn/ui](https://ui.shadcn.com/) (estilo *new york*) + [Radix UI](https://www.radix-ui.com/) - Componentes acessíveis
- [Lucide React](https://lucide.dev/) - Ícones
- [next-themes](https://github.com/pacocoursey/next-themes) - Tema claro/escuro

**Dados e Autenticação**
- [Firebase Authentication](https://firebase.google.com/docs/auth) - Login por email/senha e Google
- [Firebase Firestore](https://firebase.google.com/docs/firestore) - Armazenamento em nuvem de playlists e curtidas
- [Deezer API](https://developers.deezer.com/api) - Catálogo musical (consumida via proxy interno)

**Outros**
- [Vercel Analytics](https://vercel.com/docs/analytics) - Métricas de uso
- Fontes [Geist / Geist Mono](https://vercel.com/font)

## 🚀 Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/Victor-Gabriel-Barbosa/Musicz.git
cd Musicz
```

2. **Instale as dependências**

O projeto tem lockfile tanto para npm quanto para pnpm:
```bash
npm install
# ou
pnpm install
```

3. **Configure as variáveis de ambiente**

Copie o `.env.example` para `.env` e preencha com as credenciais do seu projeto Firebase:
```env
# Firebase (obrigatório)
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
```
No [console do Firebase](https://console.firebase.google.com/), habilite os provedores de autenticação **Email/Senha** e **Google**, e crie um banco **Firestore**.

> O `.env.example` também lista variáveis do Upstash Vector (`UPSTASH_VECTOR_REST_URL`, `UPSTASH_VECTOR_REST_TOKEN`, `UPSTASH_VECTOR_REST_READONLY_TOKEN`). Elas ainda não são consumidas pelo código atual e podem ser ignoradas por enquanto.

4. **Execute o projeto**
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📜 Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção |
| `npm run start` | Inicia o servidor com o build de produção |
| `npm run lint` | Executa o linter (ESLint) |

## 📁 Estrutura Principal

```
musicz/
├── app/                                    # Páginas e rotas (App Router)
│   ├── album/[id]/                         # Página de álbum
│   ├── artist/[id]/                        # Página de artista
│   ├── playlist/[id]/                      # Playlist pública da Deezer
│   ├── library/                            # Biblioteca do usuário
│   │   ├── liked/                          # Músicas curtidas
│   │   └── playlist/[id]/                  # Detalhe de playlist salva pelo usuário
│   ├── login/                              # Login e cadastro
│   ├── profile/                            # Perfil do usuário
│   ├── quiz/                               # Quiz musical
│   ├── search/                             # Busca
│   └── api/deezer/                         # Proxy para a API do Deezer
├── components/                             # Componentes React
│   ├── ui/                                 # Componentes base (shadcn/Radix UI)
│   ├── player.tsx                          # Player de música
│   ├── sidebar.tsx                         # Navegação (desktop)
│   ├── mobile-nav.tsx                      # Navegação (mobile)
│   ├── track-list.tsx                      # Lista de músicas
│   ├── protected-route.tsx                 # Wrapper de rotas autenticadas
│   ├── add-to-playlist-dialog.tsx          # Modal de adicionar à playlist
│   └── theme-provider.tsx/theme-toggle.tsx # Tema claro/escuro
├── hooks/                                  # Hooks compartilhados (debounce, mobile, toast)
├── lib/                                    # Lógica e contextos
│   ├── auth-context.tsx                    # Autenticação (Firebase Auth)
│   ├── music-context.tsx                   # Player e fila de reprodução
│   ├── playlist-context.tsx                # Playlists e curtidas (Firestore + localStorage)
│   ├── firebase.ts                         # Inicialização do Firebase
│   └── deezer.ts                           # Cliente da API do Deezer
└── public/                                 # Ícones e assets estáticos (PWA)
```

## 🗺️ Rotas principais

| Rota | Descrição |
| --- | --- |
| `/` | Início — destaques do chart da Deezer |
| `/search` | Busca de músicas, álbuns, artistas e playlists |
| `/album/[id]` | Detalhes de um álbum |
| `/artist/[id]` | Detalhes de um artista |
| `/playlist/[id]` | Playlist pública da Deezer |
| `/library` | Biblioteca do usuário (playlists e curtidas) |
| `/library/liked` | Músicas curtidas |
| `/library/playlist/[id]` | Detalhes de uma playlist salva pelo usuário |
| `/quiz` | Quiz musical |
| `/login` | Login e cadastro |
| `/profile` | Perfil do usuário |

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

## 🎨 Uso dos Contextos e Hooks

```typescript
// Reproduzir música
import { useMusic } from '@/lib/music-context'

const { playTrack, playQueue, nextTrack, previousTrack } = useMusic()
playTrack(track)

// Gerenciar playlists e curtidas
import { usePlaylist } from '@/lib/playlist-context'

const { createPlaylist, addTrackToPlaylist, toggleLikeTrack } = usePlaylist()
const playlist = createPlaylist("Minha Playlist")
addTrackToPlaylist(playlist.id, track)

// Autenticação
import { useAuth } from '@/lib/auth-context'

const { user, signIn, signInWithGoogle, logout } = useAuth()
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
