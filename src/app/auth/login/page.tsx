import Link from "next/link"
import { AuthForm } from "@/components/auth/auth-form"

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tighter">Welcome Back</h1>
          <p className="text-zinc-500 text-sm mt-2">Sign in to your account</p>
        </div>
        <AuthForm mode="login" />
        <p className="mt-6 text-center text-sm text-zinc-500">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="text-white hover:underline font-bold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
