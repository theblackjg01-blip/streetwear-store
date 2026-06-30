import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProductDetail } from "./product-detail"
import { ProductGrid } from "@/components/product/product-grid"
import type { Product } from "@/types"

export const dynamic = "force-dynamic"

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!product) notFound()

  const { data: related } = await supabase
    .from("products")
    .select("*")
    .eq("category", product.category)
    .neq("id", product.id)
    .eq("is_active", true)
    .limit(4)

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <ProductDetail product={product} />

      {related && related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-black tracking-tighter mb-8">You May Also Like</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  )
}
