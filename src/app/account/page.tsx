import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AccountForm } from "./account-form"

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login?redirect=/account")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-black tracking-tighter mb-10">My Account</h1>
      <AccountForm profile={profile} email={user.email || ""} />
    </div>
  )
}
