"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import toast from "react-hot-toast"
import type { Product } from "@/types"

interface AdminProductFormProps {
  product: Product | null
}

export function AdminProductForm({ product }: AdminProductFormProps) {
  const [form, setForm] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    compare_at_price: product?.compare_at_price?.toString() || "",
    category: product?.category || "Tops",
    is_active: product?.is_active ?? true,
    is_new_drop: product?.is_new_drop ?? false,
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      ...form,
      price: parseFloat(form.price),
      compare_at_price: form.compare_at_price ? parseFloat(form.compare_at_price) : null,
      images: product?.images || [],
      sizes: product?.sizes || ["S", "M", "L", "XL"],
      colors: product?.colors || ["Black", "White"],
      stock_by_variant: product?.stock_by_variant || {},
    }

    if (product) {
      const { error } = await supabase.from("products").update(payload).eq("id", product.id)
      if (error) toast.error(error.message)
      else toast.success("Product updated!")
    } else {
      const { error } = await supabase.from("products").insert(payload)
      if (error) toast.error(error.message)
      else toast.success("Product created!")
    }

    setLoading(false)
    router.push("/admin/products")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Name" id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      <Input label="Slug" id="slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-zinc-300 mb-1">Description</label>
        <textarea
          id="description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/50 h-32"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Price ($)" id="price" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
        <Input label="Compare at Price ($)" id="compare_at_price" type="number" step="0.01" value={form.compare_at_price} onChange={(e) => setForm({ ...form, compare_at_price: e.target.value })} />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-zinc-300 mb-1">Category</label>
        <select id="category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50">
          <option>Tops</option>
          <option>Bottoms</option>
          <option>Outerwear</option>
          <option>Accessories</option>
          <option>Footwear</option>
        </select>
      </div>
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="accent-white" />
          <span className="text-sm text-zinc-300">Active</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.is_new_drop} onChange={(e) => setForm({ ...form, is_new_drop: e.target.checked })} className="accent-white" />
          <span className="text-sm text-zinc-300">New Drop</span>
        </label>
      </div>
      <Button type="submit" loading={loading}>{product ? "Update Product" : "Create Product"}</Button>
    </form>
  )
}
