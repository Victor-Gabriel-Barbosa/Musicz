"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, Library, Brain, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"

const navigation = [
  { name: "Início", href: "/", icon: Home },
  { name: "Buscar", href: "/search", icon: Search },
  { name: "Biblioteca", href: "/library", icon: Library },
  { name: "Quiz", href: "/quiz", icon: Brain },
]

export function MobileNav() {
  const pathname = usePathname()
  const { user } = useAuth()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40 pb-safe">
      <div className="flex items-center justify-around px-2 py-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors min-w-0",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs font-medium truncate">{item.name}</span>
            </Link>
          )
        })}
        <Link
          href={user ? "/profile" : "/login"}
          className={cn(
            "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors min-w-0",
            pathname === "/profile" || pathname === "/login"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <User className="h-6 w-6" />
          <span className="text-xs font-medium truncate">Perfil</span>
        </Link>
      </div>
    </nav>
  )
}
