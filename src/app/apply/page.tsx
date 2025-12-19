"use client"

export const dynamic = "force-dynamic";

import * as React from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { ArrowRight, CheckCircle, AlertCircle, Shield, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

function ConfirmLoanContent() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const amount = Number(searchParams.get('amount')) || 15000
    const tenure = Number(searchParams.get('tenure')) || 12

    const MONTHLY_RATE = 0.16 // 16% per month
    const monthlyRate = MONTHLY_RATE

    const emi = React.useMemo(() => {
        if (amount === 0) return 0
        return (amount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1)
    }, [amount, tenure, monthlyRate])

    const totalPayment = emi * tenure
    const totalInterest = totalPayment - amount

    function handleConfirm() {
        router.push(`/dashboard?amount=${amount}&tenure=${tenure}`)
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-md space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <Link href="/" className="inline-flex items-center gap-2 mb-4">
                        <div className="h-8 w-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">M</span>
                        </div>
                        <span className="font-semibold text-lg text-white">Mslice</span>
                    </Link>
                    <h1 className="text-xl sm:text-2xl font-bold text-white">Confirm Your Loan</h1>
                    <p className="text-sm text-zinc-400">Review details before confirming</p>
                </div>

                {/* Loan Summary Card */}
                <Card className="bg-[#111111] border-zinc-800">
                    <CardContent className="p-5 sm:p-6 space-y-6">
                        {/* Badge */}
                        <div className="flex items-center justify-between">
                            <Badge className="bg-emerald-500/20 text-emerald-400 border-0">Personal Loan</Badge>
                            <span className="text-xs text-zinc-400">16% APR Fixed</span>
                        </div>

                        {/* Amount */}
                        <div className="text-center py-4 bg-zinc-900 rounded-xl">
                            <p className="text-sm text-zinc-400 mb-1">Loan Amount</p>
                            <p className="text-3xl sm:text-4xl font-bold text-white">₹{amount.toLocaleString()}</p>
                        </div>

                        <Separator className="bg-zinc-800" />

                        {/* Breakdown */}
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-400">Repayment Period</span>
                                <span className="font-medium text-white">{tenure} months</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-400">Monthly EMI</span>
                                <span className="font-medium text-emerald-400">₹{Math.round(emi).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-400">Total Interest (16%)</span>
                                <span className="font-medium text-white">₹{Math.round(totalInterest).toLocaleString()}</span>
                            </div>
                            <Separator className="bg-zinc-800" />
                            <div className="flex justify-between">
                                <span className="font-medium text-zinc-300">Total Repayment</span>
                                <span className="font-bold text-white">₹{Math.round(totalPayment).toLocaleString()}</span>
                            </div>
                        </div>

                        <Separator className="bg-zinc-800" />

                        {/* Important Info */}
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 text-sm">
                                <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                <span className="text-zinc-400">Zero processing fee</span>
                            </div>
                            <div className="flex items-start gap-3 text-sm">
                                <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                <span className="text-zinc-400">No prepayment charges</span>
                            </div>
                            <div className="flex items-start gap-3 text-sm">
                                <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                <span className="text-zinc-400">
                                    <strong className="text-white">₹300</strong> late payment fee per missed EMI
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* CTAs */}
                <div className="space-y-3">
                    <Button
                        className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-medium"
                        onClick={handleConfirm}
                    >
                        Confirm & Get Loan <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full h-12 border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white"
                        onClick={() => router.push('/')}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Change Amount
                    </Button>
                </div>

                <p className="text-xs text-center text-zinc-500">
                    By confirming, you agree to our Terms of Service.
                </p>

                {/* Trust */}
                <div className="flex items-center justify-center gap-4 text-xs text-zinc-500">
                    <div className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        <span>256-bit SSL</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        <span>Instant Approval</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function ApplyPage() {
    return (
        <React.Suspense fallback={
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="animate-pulse text-white">Loading...</div>
            </div>
        }>
            <ConfirmLoanContent />
        </React.Suspense>
    )
}
