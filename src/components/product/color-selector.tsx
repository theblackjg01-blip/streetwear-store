"use client"

import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface ColorSelectorProps {
  colors: string[]
  selected: string
  onSelect: (color: string) => void
}

const colorMap: Record<string, string> = {
  Black: "bg-black",
  White: "bg-white",
  Olive: "bg-green-800",
  Khaki: "bg-yellow-700",
  Grey: "bg-gray-500",
  Red: "bg-red-600",
  Navy: "bg-blue-900",
  "Army Green": "bg-green-700",
  Orange: "bg-orange-500",
  "Black/White": "bg-gradient-to-r from-black to-white",
  "All Black": "bg-black",
  "White/Cream": "bg-yellow-100",
}

export function ColorSelector({ colors, selected, onSelect }: ColorSelectorProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
        Color: <span className="text-white">{selected}</span>
      </p>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => onSelect(color)}
            className={cn(
              "w-8 h-8 rounded-full border-2 transition-all duration-200 flex items-center justify-center",
              selected === color ? "border-white scale-110" : "border-zinc-700 hover:border-zinc-400"
            )}
            title={color}
          >
            <span className={cn("w-5 h-5 rounded-full", colorMap[color] || "bg-zinc-500")}>
              {selected === color && (
                <Check className={cn("w-5 h-5", color === "White" || color === "White/Cream" ? "text-black" : "text-white")} />
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
