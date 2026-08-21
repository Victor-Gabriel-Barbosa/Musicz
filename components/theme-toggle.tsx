"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { AnimatedThemeToggler, type TransitionVariant } from "@/components/ui/animated-theme-toggler"
import { cn } from "@/lib/utils"

interface ThemeToggleProps extends React.ComponentPropsWithoutRef<"button"> {
  variant?: TransitionVariant
  duration?: number
  fromCenter?: boolean
  className?: string
  iconClassName?: string
}

export function ThemeToggle({
  variant = "circle",
  duration = 450,
  fromCenter = false,
  className,
  iconClassName,
  children,
  ...props
}: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button
        type="button"
        className={cn(
          "inline-flex items-center justify-center h-9 w-9 rounded-md opacity-50 cursor-pointer",
          className,
        )}
        disabled
        aria-label="Alternar tema"
        {...props}
      >
        <span className={cn("inline-block h-4 w-4", iconClassName)} />
        {children}
      </button>
    )
  }

  const currentTheme = resolvedTheme === "dark" ? "dark" : "light"

  return (
    <AnimatedThemeToggler
      theme={currentTheme}
      onThemeChange={(newTheme) => setTheme(newTheme)}
      variant={variant}
      duration={duration}
      fromCenter={fromCenter}
      className={className}
      iconClassName={iconClassName}
      {...props}
    >
      {children}
    </AnimatedThemeToggler>
  )
}
