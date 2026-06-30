import Link from "next/link"
import { AuthForm } from "@/components/auth/auth-form"

export default function RegisterPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tighter">Create Account</h1>
          <p className="text-zinc-500 text-sm mt-2">Join the streetwear community</p>
        </div>
        <AuthForm mode="register" />
        <p className="mt-6 text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-white hover:underline font-bold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
