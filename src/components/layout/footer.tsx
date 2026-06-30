import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-black mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-white mb-4">Shop</h4>
            <div className="space-y-2">
              <Link href="/shop" className="block text-sm text-zinc-500 hover:text-white transition-colors">All Products</Link>
              <Link href="/shop?category=Tops" className="block text-sm text-zinc-500 hover:text-white transition-colors">Tops</Link>
              <Link href="/shop?category=Bottoms" className="block text-sm text-zinc-500 hover:text-white transition-colors">Bottoms</Link>
              <Link href="/shop?category=Outerwear" className="block text-sm text-zinc-500 hover:text-white transition-colors">Outerwear</Link>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-white mb-4">Support</h4>
            <div className="space-y-2">
              <span className="block text-sm text-zinc-500">Shipping</span>
              <span className="block text-sm text-zinc-500">Returns</span>
              <span className="block text-sm text-zinc-500">FAQ</span>
              <span className="block text-sm text-zinc-500">Contact</span>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-white mb-4">Account</h4>
            <div className="space-y-2">
              <Link href="/auth/login" className="block text-sm text-zinc-500 hover:text-white transition-colors">Sign In</Link>
              <Link href="/account" className="block text-sm text-zinc-500 hover:text-white transition-colors">My Account</Link>
              <Link href="/account/orders" className="block text-sm text-zinc-500 hover:text-white transition-colors">Orders</Link>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-white mb-4">Follow Us</h4>
            <div className="space-y-2">
              <span className="block text-sm text-zinc-500 cursor-pointer hover:text-white transition-colors">Instagram</span>
              <span className="block text-sm text-zinc-500 cursor-pointer hover:text-white transition-colors">Twitter / X</span>
              <span className="block text-sm text-zinc-500 cursor-pointer hover:text-white transition-colors">TikTok</span>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-zinc-800 text-center">
          <p className="text-sm text-zinc-600 font-bold tracking-wider uppercase">
            &copy; {new Date().getFullYear()} STREETWEAR. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
