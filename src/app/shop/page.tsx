import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { ProductGrid } from "@/components/product/product-grid"
import { ShopFilters } from "./shop-filters"
import type { Product } from "@/types"

export const dynamic = "force-dynamic"

async function getProducts(searchParams: { [key: string]: string | undefined }): Promise<Product[]> {
  const supabase = await createClient()
  let query = supabase.from("products").select("*").eq("is_active", true)

  if (searchParams.category) {
    query = query.eq("category", searchParams.category)
  }
  if (searchParams.sort === "price_asc") {
    query = query.order("price", { ascending: true })
  } else if (searchParams.sort === "price_desc") {
    query = query.order("price", { ascending: false })
  } else {
    query = query.order("created_at", { ascending: false })
  }

  const { data } = await query
  return data || []
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams
  const products = await getProducts(params)
  const supabase = await createClient()
  const { data: categories } = await supabase.from("categories").select("*")

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter">Shop</h1>
        <p className="text-zinc-500 text-sm mt-1">
          {products.length} {products.length === 1 ? "product" : "products"} found
        </p>
      </div>

      <Suspense fallback={<div className="text-zinc-500 text-center py-20">Loading...</div>}>
        <ShopFilters categories={categories || []} currentCategory={params.category || ""} currentSort={params.sort || ""} />
        <ProductGrid products={products} />
      </Suspense>
    </div>
  )
}
