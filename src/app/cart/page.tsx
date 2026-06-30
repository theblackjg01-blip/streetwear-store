import { redirect } from "next/navigation"
import { CartContent } from "./cart-content"

export default function CartPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-10">Shopping Bag</h1>
      <CartContent />
    </div>
  )
}
