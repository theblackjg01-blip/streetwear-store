import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { ProductGrid } from "@/components/product/product-grid"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(8)

  return (
    <>
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center bg-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-black to-zinc-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800/30 via-transparent to-transparent" />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <p className="text-sm md:text-base font-bold uppercase tracking-[0.3em] text-zinc-400 mb-4">
            Seasonal Collection 2026
          </p>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none mb-6">
            NEW DROP
            <br />
            OUT NOW
          </h1>
          <p className="text-zinc-400 mb-8 text-sm md:text-base max-w-md mx-auto">
            Heavyweight fabrics, bold silhouettes. The latest streetwear essentials are here.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/shop"
              className="inline-block bg-white text-black font-bold uppercase tracking-wider px-8 py-4 text-sm hover:bg-zinc-200 transition-colors"
            >
              Shop Collection
            </Link>
            <Link
              href="/shop?category=Tops"
              className="inline-block border-2 border-white text-white font-bold uppercase tracking-wider px-8 py-4 text-sm hover:bg-white hover:text-black transition-colors"
            >
              View Tops
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter">New Arrivals</h2>
            <p className="text-zinc-500 text-sm mt-1">The latest drops straight from the vault</p>
          </div>
          <Link
            href="/shop"
            className="text-sm font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
          >
            View All &rarr;
          </Link>
        </div>
        {products && products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <p className="text-zinc-600 text-center py-20 font-bold uppercase tracking-wider">
            No products yet — add some in the admin panel
          </p>
        )}
      </section>

      <section className="bg-zinc-900 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500 mb-4">About</p>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-6 max-w-2xl mx-auto">
            Built for the streets. Made for the culture.
          </h2>
          <p className="text-zinc-400 max-w-lg mx-auto text-sm leading-relaxed">
            Premium streetwear crafted with heavyweight fabrics and bold design. Every piece is built to last — from the block to the booth.
          </p>
        </div>
      </section>
    </>
  )
}
