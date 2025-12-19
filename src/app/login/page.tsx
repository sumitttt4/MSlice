"use client"

export const dynamic = "force-dynamic";

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Loader2, Mail, Lock, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/utils/supabase/client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

function LoginForm() {
    const [isLoading, setIsLoading] = React.useState(false)
    const [isSignUp, setIsSignUp] = React.useState(false)
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")

    const searchParams = useSearchParams()
    const router = useRouter()
    const supabase = createClient()

    // Capture context
    const amount = searchParams.get('amount')
    const tenure = searchParams.get('tenure')

    const redirectPath = amount && tenure
        ? `/dashboard?amount=${amount}&tenure=${tenure}`
        : `/dashboard`

    async function handleGoogleLogin() {
        setIsLoading(true)
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(redirectPath)}`,
            },
        })

        if (error) {
            console.error(error)
            toast.error("Auth Failed", { description: error.message })
            setIsLoading(false)
        }
    }

    async function handleEmailAuth(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)

        if (isSignUp) {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(redirectPath)}`,
                }
            })
            if (error) {
                toast.error("Sign Up Failed", { description: error.message })
                setIsLoading(false)
            } else {
                toast.success("Success!", { description: "Check your email for confirmation." })
                setIsLoading(false)
            }
        } else {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password
            })
            if (error) {
                toast.error("Login Failed", { description: error.message })
                setIsLoading(false)
            } else {
                toast.success("Welcome back!", { description: "Redirecting..." })
                router.push(redirectPath)
            }
        }
    }

    return (
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                    {isSignUp ? "Create an account" : "Welcome back"}
                </h1>
                <p className="text-sm text-muted-foreground">
                    {isSignUp ? "Enter your email below to create your account" : "Enter your email below to sign in to your vault"}
                </p>
                {amount && (
                    <div className="mt-2 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-500 text-xs font-semibold">
                        Application for ₹{Number(amount).toLocaleString()} pending
                    </div>
                )}
            </div>

            <div className="grid gap-6">
                <form onSubmit={handleEmailAuth}>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    placeholder="name@example.com"
                                    type="email"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                    autoCorrect="off"
                                    disabled={isLoading}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                {!isSignUp && <Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link>}
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    placeholder="••••••••"
                                    type="password"
                                    autoComplete={isSignUp ? "new-password" : "current-password"}
                                    disabled={isLoading}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>
                        <Button disabled={isLoading} className="bg-primary text-primary-foreground hover:bg-primary/90">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isSignUp ? "Sign Up with Email" : "Sign In with Email"}
                        </Button>
                    </div>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                </div>

                <Button variant="outline" type="button" disabled={isLoading} onClick={handleGoogleLogin} className="w-full">
                    {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                    )}
                    Google
                </Button>
            </div>

            <div className="px-8 text-center text-sm text-muted-foreground">
                <span className="cursor-pointer hover:text-brand underline underline-offset-4" onClick={() => setIsSignUp(!isSignUp)}>
                    {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                </span>
                <p className="mt-4 text-xs">
                    By clicking continue, you agree to our{" "}
                    <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                        Privacy Policy
                    </Link>
                    .
                </p>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <Link
                href="/"
                className={cn(
                    "absolute left-4 top-4 z-20 flex items-center text-lg font-bold tracking-tight md:left-8 md:top-8",
                    "text-foreground lg:text-white"
                )}
            >
                <div className="relative mr-2 h-6 w-6 rounded bg-primary p-1 flex items-center justify-center">
                    <Image src="/logo.png" alt="Mslice Logo" fill className="object-contain invert brightness-0" />
                </div>
                Mslice
            </Link>

            <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
                <div className="absolute inset-0 bg-[#020617]">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none mix-blend-overlay" />
                    {/* Abstract Gradient Blob */}
                    <div className="absolute -top-[20%] -left-[20%] w-[70%] h-[70%] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
                    <div className="absolute bottom-[20%] right-[20%] w-[50%] h-[50%] rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none" />
                </div>
                <div className="relative z-20 flex items-center text-lg font-medium">
                    {/* Logo placeholder if needed specifically for this section, but usually top-left absolute handles it */}
                </div>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            &ldquo;This platform has completely transformed how we manage our credit operations. The security and ease of use are unmatched.&rdquo;
                        </p>
                        <footer className="text-sm text-muted-foreground">Sofia Davis, CEO at TechCorp</footer>
                    </blockquote>
                </div>
            </div>
            <div className="lg:p-8 flex items-center justify-center p-4">
                <React.Suspense fallback={<div className="flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-emerald-500" /></div>}>
                    <LoginForm />
                </React.Suspense>
            </div>
        </div>
    )
}
