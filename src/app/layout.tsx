import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Toaster } from "react-hot-toast"
import { createClient } from "@/lib/supabase/server"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "STREETWEAR | Urban Clothing Store",
  description: "Premium streetwear and urban fashion. New drops every season.",
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans bg-zinc-950 text-white antialiased">
        <Navbar user={user ? { id: user.id, email: user.email } : null} />
        <main className="min-h-screen pt-16">{children}</main>
        <Footer />
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "#18181b",
              color: "#fff",
              border: "1px solid #3f3f46",
              fontSize: "14px",
              fontWeight: 600,
            },
          }}
        />
      </body>
    </html>
  )
}
