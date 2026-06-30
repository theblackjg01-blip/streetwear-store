"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/account`,
    })
    if (error) setError(error.message)
    else setSent(true)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-black tracking-tighter text-center mb-2">Reset Password</h1>
        <p className="text-zinc-500 text-sm text-center mb-8">
          Enter your email and we&apos;ll send you a reset link
        </p>
        {sent ? (
          <p className="text-green-400 text-center font-bold">Check your email for the reset link!</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <Button type="submit" className="w-full">Send Reset Link</Button>
          </form>
        )}
      </div>
    </div>
  )
}
