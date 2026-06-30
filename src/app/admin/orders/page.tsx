import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminOrders } from "./admin-orders"

export default async function AdminOrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !user.email?.includes("admin")) redirect("/")

  const { data: orders } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .order("created_at", { ascending: false })

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-black tracking-tighter mb-10">Orders</h1>
      <AdminOrders orders={orders || []} />
    </div>
  )
}
