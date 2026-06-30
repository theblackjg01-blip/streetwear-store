import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { formatPrice } from "@/lib/utils"
import Link from "next/link"
import { Package, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

const statusColors: Record<string, string> = {
  pending: "text-yellow-400",
  paid: "text-green-400",
  shipped: "text-blue-400",
  cancelled: "text-red-400",
}

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login?redirect=/account/orders")

  const { data: orders } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center gap-4 mb-10">
        <Link href="/account">
          <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button>
        </Link>
        <h1 className="text-4xl font-black tracking-tighter">My Orders</h1>
      </div>

      {!orders || orders.length === 0 ? (
        <div className="text-center py-20">
          <Package className="w-16 h-16 mx-auto mb-4 text-zinc-600" />
          <p className="text-zinc-500 font-bold uppercase tracking-wider mb-6">No orders yet</p>
          <Link href="/shop"><Button>Start Shopping</Button></Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-zinc-900/50 border border-zinc-800 rounded p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-zinc-500 font-mono">{order.id.slice(0, 8)}...</span>
                <span className={`text-xs font-bold uppercase tracking-wider ${statusColors[order.status] || "text-zinc-500"}`}>
                  {order.status}
                </span>
              </div>
              <p className="text-sm text-zinc-400">{new Date(order.created_at).toLocaleDateString()}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="font-bold">{formatPrice(order.total)}</span>
                <span className="text-xs text-zinc-500">{order.items?.length || 0} items</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
