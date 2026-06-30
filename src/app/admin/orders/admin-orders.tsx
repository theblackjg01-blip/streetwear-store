"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { formatPrice } from "@/lib/utils"
import type { Order } from "@/types"
import toast from "react-hot-toast"

interface AdminOrdersProps {
  orders: Order[]
}

const statusColors: Record<string, string> = {
  pending: "text-yellow-400",
  paid: "text-green-400",
  shipped: "text-blue-400",
  cancelled: "text-red-400",
}

export function AdminOrders({ orders }: AdminOrdersProps) {
  const router = useRouter()
  const supabase = createClient()

  const updateStatus = async (orderId: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId)
    if (error) toast.error(error.message)
    else {
      toast.success("Order updated!")
      router.refresh()
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-800 text-zinc-500 uppercase tracking-wider text-xs">
            <th className="text-left py-3 px-2 font-bold">Order</th>
            <th className="text-left py-3 px-2 font-bold">Date</th>
            <th className="text-left py-3 px-2 font-bold">Total</th>
            <th className="text-left py-3 px-2 font-bold">Status</th>
            <th className="text-left py-3 px-2 font-bold">Items</th>
            <th className="text-left py-3 px-2 font-bold">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/50">
              <td className="py-3 px-2 font-mono text-xs text-zinc-400">{order.id.slice(0, 8)}...</td>
              <td className="py-3 px-2 text-zinc-400">{new Date(order.created_at).toLocaleDateString()}</td>
              <td className="py-3 px-2 font-bold text-white">{formatPrice(order.total)}</td>
              <td className="py-3 px-2">
                <span className={`text-xs font-bold uppercase ${statusColors[order.status] || "text-zinc-500"}`}>
                  {order.status}
                </span>
              </td>
              <td className="py-3 px-2 text-zinc-400">{order.items?.length || 0}</td>
              <td className="py-3 px-2">
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className="bg-zinc-800 border border-zinc-700 text-white text-xs px-2 py-1 rounded"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="shipped">Shipped</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
