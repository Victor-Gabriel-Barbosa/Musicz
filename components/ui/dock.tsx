"use client"

import React, { useRef } from "react"
import { cva } from "class-variance-authority"
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
  type HTMLMotionProps,
} from "motion/react"
import { cn } from "@/lib/utils"

export interface DockProps extends Omit<HTMLMotionProps<"div">, "children"> {
  className?: string
  magnification?: number
  distance?: number
  direction?: "top" | "middle" | "bottom"
  children: React.ReactNode
}

export interface DockIconProps extends Omit<HTMLMotionProps<"div">, "children"> {
  size?: number
  magnification?: number
  distance?: number
  mouseX?: MotionValue<number>
  className?: string
  children?: React.ReactNode
  props?: Record<string, unknown>
}

const DEFAULT_MAGNIFICATION = 56
const DEFAULT_DISTANCE = 120
const DEFAULT_SIZE = 42

const dockVariants = cva(
  "supports-backdrop-blur:bg-card/75 supports-backdrop-blur:dark:bg-card/75 mx-auto flex h-[58px] w-max items-center justify-center gap-2 rounded-full border border-border/80 bg-card/85 p-2 shadow-2xl backdrop-blur-xl"
)

export const Dock = React.forwardRef<HTMLDivElement, DockProps>(
  (
    {
      className,
      children,
      magnification = DEFAULT_MAGNIFICATION,
      distance = DEFAULT_DISTANCE,
      direction = "middle",
      ...props
    },
    ref
  ) => {
    const mouseX = useMotionValue(Infinity)

    const renderChildren = () => {
      return React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            mouseX: mouseX,
            magnification: magnification,
            distance: distance,
          } as any)
        }
        return child
      })
    }

    return (
      <motion.div
        ref={ref}
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        onTouchMove={(e) => {
          if (e.touches.length > 0) {
            mouseX.set(e.touches[0].clientX)
          }
        }}
        onTouchEnd={() => mouseX.set(Infinity)}
        {...props}
        className={cn(dockVariants({ className }), {
          "items-start": direction === "top",
          "items-center": direction === "middle",
          "items-end": direction === "bottom",
        })}
      >
        {renderChildren()}
      </motion.div>
    )
  }
)

Dock.displayName = "Dock"

export const DockIcon = ({
  size = DEFAULT_SIZE,
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
  mouseX,
  className,
  children,
  ...props
}: DockIconProps) => {
  const ref = useRef<HTMLDivElement>(null)

  const defaultMouseX = useMotionValue(Infinity)
  const effectiveMouseX = mouseX ?? defaultMouseX

  const distanceCalc = useTransform(effectiveMouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - bounds.x - bounds.width / 2
  })

  const widthSync = useTransform(
    distanceCalc,
    [-distance, 0, distance],
    [size, magnification, size]
  )

  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  })

  return (
    <motion.div
      ref={ref}
      style={{ width, height: width }}
      className={cn(
        "flex aspect-square cursor-pointer items-center justify-center rounded-full transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}

DockIcon.displayName = "DockIcon"
