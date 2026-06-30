"use client"

import { useState } from "react"
import { useCartStore } from "@/lib/cart-store"
import { formatPrice, cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { SizeSelector } from "@/components/product/size-selector"
import { ColorSelector } from "@/components/product/color-selector"
import toast from "react-hot-toast"
import type { Product } from "@/types"

interface ProductDetailProps {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "")
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "")
  const [selectedImage, setSelectedImage] = useState(0)
  const addItem = useCartStore((s) => s.addItem)

  const stock = product.stock_by_variant?.[selectedSize]?.[selectedColor]
  const isOutOfStock = stock !== undefined && stock <= 0

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select a size and color")
      return
    }
    if (isOutOfStock) {
      toast.error("This variant is out of stock")
      return
    }
    addItem(product, selectedSize, selectedColor)
    toast.success("Added to cart!")
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 md:gap-12">
      <div className="space-y-3">
        <div className="aspect-[4/5] bg-zinc-900 overflow-hidden">
          <img
            src={product.images[selectedImage] || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        {product.images.length > 1 && (
          <div className="flex gap-2">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={cn(
                  "w-16 h-20 bg-zinc-900 overflow-hidden border-2 transition-colors",
                  selectedImage === i ? "border-white" : "border-transparent hover:border-zinc-600"
                )}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-6">
        {product.is_new_drop && (
          <span className="inline-block bg-white text-black text-xs font-bold px-3 py-1 uppercase tracking-wider">
            New Drop
          </span>
        )}
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter">{product.name}</h1>
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
          {product.compare_at_price && (
            <span className="text-lg text-zinc-500 line-through">{formatPrice(product.compare_at_price)}</span>
          )}
        </div>

        {product.description && (
          <p className="text-zinc-400 text-sm leading-relaxed">{product.description}</p>
        )}

        <SizeSelector sizes={product.sizes} selected={selectedSize} onSelect={setSelectedSize} />
        <ColorSelector colors={product.colors} selected={selectedColor} onSelect={setSelectedColor} />

        {stock !== undefined && (
          <p className={cn("text-xs font-bold uppercase tracking-wider", isOutOfStock ? "text-red-400" : "text-zinc-500")}>
            {isOutOfStock ? "Out of stock" : `${stock} in stock`}
          </p>
        )}

        <Button onClick={handleAddToCart} disabled={isOutOfStock} className="w-full" size="lg">
          {isOutOfStock ? "Out of Stock" : "Add to Bag"}
        </Button>
      </div>
    </div>
  )
}
