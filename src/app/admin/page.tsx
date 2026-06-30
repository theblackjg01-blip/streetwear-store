import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Package, ShoppingBag, TrendingUp } from "lucide-react"

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !user.email?.includes("admin")) redirect("/")

  const { count: productCount } = await supabase.from("products").select("*", { count: "exact", head: true })
  const { count: orderCount } = await supabase.from("orders").select("*", { count: "exact", head: true })

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-black tracking-tighter mb-10">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-zinc-900 border border-zinc-800 rounded p-6">
          <ShoppingBag className="w-8 h-8 text-white mb-3" />
          <p className="text-2xl font-black">{productCount || 0}</p>
          <p className="text-sm text-zinc-500 uppercase tracking-wider font-bold">Products</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded p-6">
          <Package className="w-8 h-8 text-white mb-3" />
          <p className="text-2xl font-black">{orderCount || 0}</p>
          <p className="text-sm text-zinc-500 uppercase tracking-wider font-bold">Orders</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded p-6">
          <TrendingUp className="w-8 h-8 text-white mb-3" />
          <p className="text-2xl font-black">$--</p>
          <p className="text-sm text-zinc-500 uppercase tracking-wider font-bold">Revenue</p>
        </div>
      </div>
      <div className="flex gap-4">
        <Link href="/admin/products" className="bg-white text-black font-bold uppercase tracking-wider px-6 py-3 text-sm hover:bg-zinc-200 transition-colors">
          Manage Products
        </Link>
        <Link href="/admin/orders" className="border-2 border-white text-white font-bold uppercase tracking-wider px-6 py-3 text-sm hover:bg-white hover:text-black transition-colors">
          View Orders
        </Link>
      </div>
    </div>
  )
}
