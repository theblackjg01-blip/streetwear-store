"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/lib/cart-store"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ShoppingBag, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import toast from "react-hot-toast"

export default function CheckoutPage() {
  const { items, getSubtotal } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  const handleCheckout = async () => {
    if (!user) {
      router.push("/auth/login?redirect=/checkout")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.product.id,
            name: i.product.name,
            price: i.product.price,
            quantity: i.quantity,
            size: i.size,
            color: i.color,
            image: i.product.images[0],
          })),
        }),
      })

      const { url, error } = await res.json()
      if (error) throw new Error(error)
      if (url) window.location.href = url
    } catch (err: any) {
      toast.error(err.message || "Checkout failed")
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-zinc-600" />
        <p className="text-zinc-500 font-bold uppercase tracking-wider mb-6">Your bag is empty</p>
        <Link href="/shop"><Button>Continue Shopping</Button></Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-black tracking-tighter mb-10">Checkout</h1>

      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex gap-4 bg-zinc-900/50 p-4 rounded border border-zinc-800">
            <img src={item.product.images[0] || "/placeholder.svg"} alt={item.product.name} className="w-16 h-20 object-cover rounded" />
            <div className="flex-1">
              <p className="font-bold text-sm">{item.product.name}</p>
              <p className="text-xs text-zinc-500">{item.size} / {item.color} x{item.quantity}</p>
            </div>
            <p className="font-bold">{formatPrice(item.product.price * item.quantity)}</p>
          </div>
        ))}
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded p-6 mb-8">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-zinc-400">
            <span>Subtotal</span>
            <span className="text-white font-bold">{formatPrice(getSubtotal())}</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Shipping</span>
            <span className="text-white font-bold">Calculated at checkout</span>
          </div>
          <div className="border-t border-zinc-800 pt-2 flex justify-between">
            <span className="font-bold">Total</span>
            <span className="font-bold text-lg">{formatPrice(getSubtotal())}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Link href="/cart">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Cart
          </Button>
        </Link>
        <Button onClick={handleCheckout} disabled={loading} className="flex-1">
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          {user ? "Pay with Stripe" : "Sign in to checkout"}
        </Button>
      </div>

      {!user && (
        <p className="text-center text-zinc-500 text-sm mt-4">
          You&apos;ll be prompted to sign in before checkout
        </p>
      )}
    </div>
  )
}
