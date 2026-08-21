"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, Library, Brain, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { useMusic } from "@/lib/music-context"
import { Dock, DockIcon } from "@/components/ui/dock"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const navigation = [
  { name: "Início", href: "/", icon: Home },
  { name: "Buscar", href: "/search", icon: Search },
  { name: "Biblioteca", href: "/library", icon: Library },
  { name: "Quiz", href: "/quiz", icon: Brain },
]

export function MobileNav() {
  const pathname = usePathname()
  const { user } = useAuth()
  const { currentTrack } = useMusic()

  const isProfileActive = pathname === "/profile" || pathname === "/login"

  const getUserInitials = () => {
    if (user?.displayName) {
      return user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    }
    return user?.email?.[0].toUpperCase() || "U"
  }

  return (
    <div
      className={cn(
        "lg:hidden fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-300 pointer-events-none pb-safe",
        currentTrack ? "bottom-[88px]" : "bottom-4"
      )}
    >
      <TooltipProvider delayDuration={150}>
        <Dock
          direction="middle"
          className="pointer-events-auto shadow-2xl border border-border/70 bg-card/85 dark:bg-card/80 backdrop-blur-xl px-2.5 py-1.5 gap-1.5 sm:gap-2 rounded-full"
        >
          {navigation.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`)

            return (
              <DockIcon key={item.name}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      aria-label={item.name}
                      className={cn(
                        "relative flex h-full w-full items-center justify-center rounded-full transition-all duration-200",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 scale-105"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {isActive && (
                        <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-primary-foreground" />
                      )}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="top" sideOffset={8} className="text-xs font-medium">
                    <p>{item.name}</p>
                  </TooltipContent>
                </Tooltip>
              </DockIcon>
            )
          })}

          {/* User Profile */}
          <DockIcon>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={user ? "/profile" : "/login"}
                  aria-label={user ? "Perfil" : "Entrar"}
                  className={cn(
                    "relative flex h-full w-full items-center justify-center rounded-full transition-all duration-200",
                    isProfileActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 scale-105"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  )}
                >
                  {user ? (
                    <Avatar className="h-6 w-6 border border-border/40">
                      <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
                      <AvatarFallback className="text-[10px] bg-primary/20 text-foreground font-semibold">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                  {isProfileActive && (
                    <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-primary-foreground" />
                  )}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={8} className="text-xs font-medium">
                <p>{user ? "Perfil" : "Entrar"}</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>

          {/* Theme Toggle */}
          <DockIcon>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex h-full w-full items-center justify-center rounded-full hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors">
                  <ThemeToggle className="h-8 w-8 rounded-full" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={8} className="text-xs font-medium">
                <p>Alternar Tema</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
        </Dock>
      </TooltipProvider>
    </div>
  )
}