"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get("session_id")
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")

  useEffect(() => {
    if (!sessionId) {
      setStatus("error")
      return
    }
    setStatus("success")
  }, [sessionId])

  if (status === "loading") {
    return (
      <div className="text-center py-20">
        <p className="text-zinc-500 font-bold uppercase tracking-wider">Confirming your order...</p>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="text-center py-20">
        <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
        <h1 className="text-3xl font-black tracking-tighter mb-3">Order Error</h1>
        <p className="text-zinc-500 mb-8">Something went wrong. Please contact support.</p>
        <Link href="/shop"><Button>Continue Shopping</Button></Link>
      </div>
    )
  }

  return (
    <div className="text-center py-20 max-w-lg mx-auto">
      <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-400" />
      <h1 className="text-4xl font-black tracking-tighter mb-3">Order Confirmed!</h1>
      <p className="text-zinc-400 mb-2">Thank you for your purchase.</p>
      <p className="text-zinc-600 text-sm mb-8">
        You&apos;ll receive a confirmation email shortly with your order details.
      </p>
      <div className="flex gap-3 justify-center">
        <Link href="/account/orders"><Button variant="outline">View Orders</Button></Link>
        <Link href="/shop"><Button>Continue Shopping</Button></Link>
      </div>
    </div>
  )
}

export default function OrderConfirmationPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <Suspense fallback={<div className="text-center py-20 text-zinc-500">Loading...</div>}>
        <ConfirmationContent />
      </Suspense>
    </div>
  )
}
