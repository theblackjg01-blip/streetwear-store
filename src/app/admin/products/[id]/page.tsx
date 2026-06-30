import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminProductForm } from "./product-form"

export const dynamic = "force-dynamic"

export default async function AdminProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !user.email?.includes("admin")) redirect("/")

  const { data: product } = id === "new"
    ? { data: null }
    : await supabase.from("products").select("*").eq("id", id).single()

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-black tracking-tighter mb-10">
        {product ? "Edit Product" : "New Product"}
      </h1>
      <AdminProductForm product={product} />
    </div>
  )
}
