"use client"

import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import type { Category } from "@/types"

interface ShopFiltersProps {
  categories: Category[]
  currentCategory: string
  currentSort: string
}

export function ShopFilters({ categories, currentCategory, currentSort }: ShopFiltersProps) {
  const router = useRouter()

  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams()
    if (value) params.set(key, value)
    const category = key === "category" ? value : currentCategory
    if (category) params.set("category", category)
    const sort = key === "sort" ? value : currentSort
    if (sort) params.set("sort", sort)
    router.push(`/shop${params.toString() ? `?${params.toString()}` : ""}`)
  }

  return (
    <div className="flex flex-wrap items-center gap-4 mb-8 pb-4 border-b border-zinc-800">
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => updateQuery("category", "")}
          className={cn(
            "px-4 py-2 text-xs font-bold uppercase tracking-wider border transition-colors",
            !currentCategory
              ? "bg-white text-black border-white"
              : "bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-400"
          )}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => updateQuery("category", cat.name)}
            className={cn(
              "px-4 py-2 text-xs font-bold uppercase tracking-wider border transition-colors",
              currentCategory === cat.name
                ? "bg-white text-black border-white"
                : "bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-400"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <select
        value={currentSort}
        onChange={(e) => updateQuery("sort", e.target.value)}
        className="ml-auto bg-zinc-800 border border-zinc-700 text-white text-xs font-bold uppercase tracking-wider px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-white/50"
      >
        <option value="">Newest</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
      </select>
    </div>
  )
}
