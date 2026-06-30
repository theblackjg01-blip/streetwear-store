"use client"

import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import type { Product } from "@/types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] bg-zinc-900 overflow-hidden mb-3">
        <img
          src={product.images[0] || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.is_new_drop && (
          <span className="absolute top-3 left-3 bg-white text-black text-xs font-bold px-3 py-1 uppercase tracking-wider">
            New Drop
          </span>
        )}
        {product.compare_at_price && (
          <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-3 py-1 uppercase tracking-wider">
            Sale
          </span>
        )}
      </div>
      <h3 className="font-bold text-sm uppercase tracking-wider text-white group-hover:text-zinc-300 transition-colors">
        {product.name}
      </h3>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-white font-bold">{formatPrice(product.price)}</span>
        {product.compare_at_price && (
          <span className="text-zinc-500 line-through text-sm">{formatPrice(product.compare_at_price)}</span>
        )}
      </div>
    </Link>
  )
}
