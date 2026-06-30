"use client"

import { cn } from "@/lib/utils"

interface SizeSelectorProps {
  sizes: string[]
  selected: string
  onSelect: (size: string) => void
}

export function SizeSelector({ sizes, selected, onSelect }: SizeSelectorProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Size</p>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onSelect(size)}
            className={cn(
              "px-4 py-2 text-sm font-bold border transition-all duration-200",
              selected === size
                ? "bg-white text-black border-white"
                : "bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-400"
            )}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  )
}
