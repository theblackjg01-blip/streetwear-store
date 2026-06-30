"use client"

import Link from "next/link"
import { X, Minus, Plus, ShoppingBag } from "lucide-react"
import { useCartStore } from "@/lib/cart-store"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function CartContent() {
  const { items, removeItem, updateQuantity, getSubtotal } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-zinc-600" />
        <p className="text-zinc-500 font-bold uppercase tracking-wider mb-6">Your bag is empty</p>
        <Link href="/shop">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 space-y-4">
        {items.map((item) => (
          <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex gap-4 bg-zinc-900/50 p-4 rounded border border-zinc-800">
            <img
              src={item.product.images[0] || "/placeholder.svg"}
              alt={item.product.name}
              className="w-24 h-28 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-bold text-white">{item.product.name}</h3>
              <p className="text-sm text-zinc-400 mt-1">{item.size} / {item.color}</p>
              <p className="text-sm font-bold text-white mt-2">{formatPrice(item.product.price)}</p>
              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                  className="w-8 h-8 flex items-center justify-center border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-400 transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-bold text-white w-6 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-400 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-white">{formatPrice(item.product.price * item.quantity)}</p>
              <button
                onClick={() => removeItem(item.product.id, item.size, item.color)}
                className="text-zinc-600 hover:text-red-400 transition-colors mt-4"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded p-6 h-fit">
        <h3 className="font-bold text-lg uppercase tracking-wider mb-4">Order Summary</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-zinc-400">
            <span>Subtotal</span>
            <span className="text-white font-bold">{formatPrice(getSubtotal())}</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Shipping</span>
            <span className="text-white font-bold">Calculated at checkout</span>
          </div>
          <div className="border-t border-zinc-800 pt-3 flex justify-between">
            <span className="font-bold uppercase tracking-wider">Total</span>
            <span className="font-bold text-lg">{formatPrice(getSubtotal())}</span>
          </div>
        </div>
        <Link href="/checkout">
          <Button className="w-full mt-6">Checkout</Button>
        </Link>
        <Link href="/shop" className="block text-center mt-3">
          <Button variant="ghost" size="sm" className="w-full">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  )
}
