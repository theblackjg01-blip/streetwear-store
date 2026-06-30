import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProductGrid } from "@/components/product/product-grid"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default async function AdminProductsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !user.email?.includes("admin")) redirect("/")

  const { data: products } = await supabase.from("products").select("*").order("created_at", { ascending: false })

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-black tracking-tighter">Products</h1>
        <Link href="/admin/products/new"><Button>+ New Product</Button></Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-500 uppercase tracking-wider text-xs">
              <th className="text-left py-3 px-2 font-bold">Name</th>
              <th className="text-left py-3 px-2 font-bold">Price</th>
              <th className="text-left py-3 px-2 font-bold">Category</th>
              <th className="text-left py-3 px-2 font-bold">Status</th>
              <th className="text-left py-3 px-2 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((p) => (
              <tr key={p.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/50">
                <td className="py-3 px-2 font-bold text-white">{p.name}</td>
                <td className="py-3 px-2 text-zinc-400">${p.price}</td>
                <td className="py-3 px-2 text-zinc-400">{p.category}</td>
                <td className="py-3 px-2">
                  <span className={`text-xs font-bold uppercase ${p.is_active ? "text-green-400" : "text-red-400"}`}>
                    {p.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="py-3 px-2">
                  <Link href={`/admin/products/${p.id}`} className="text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
