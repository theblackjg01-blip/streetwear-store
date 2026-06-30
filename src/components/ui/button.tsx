"use client"

import { forwardRef, type ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center font-bold uppercase tracking-wider transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",

          variant === "primary" &&
            "bg-white text-black hover:bg-gray-200 active:scale-[0.98]",
          variant === "secondary" &&
            "bg-zinc-800 text-white hover:bg-zinc-700 active:scale-[0.98]",
          variant === "outline" &&
            "border-2 border-white text-white hover:bg-white hover:text-black active:scale-[0.98]",
          variant === "ghost" &&
            "text-white hover:bg-white/10 active:scale-[0.98]",

          size === "sm" && "px-4 py-2 text-xs",
          size === "md" && "px-6 py-3 text-sm",
          size === "lg" && "px-8 py-4 text-base",

          loading && "animate-pulse",
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button }
