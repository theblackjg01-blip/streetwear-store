"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import toast from "react-hot-toast"
import type { Profile } from "@/types"

interface AccountFormProps {
  profile: Profile | null
  email: string
}

export function AccountForm({ profile, email }: AccountFormProps) {
  const [name, setName] = useState(profile?.full_name || "")
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: name })
      .eq("id", profile?.id)
    setLoading(false)
    if (error) toast.error(error.message)
    else toast.success("Profile updated!")
  }

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <Input label="Email" value={email} disabled />
      <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} id="name" />
      <Button type="submit" loading={loading}>Save Changes</Button>
    </form>
  )
}
