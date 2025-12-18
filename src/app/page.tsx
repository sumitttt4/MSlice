"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import {
    ArrowRight,
    ShieldCheck,
    Smartphone,
    CreditCard,
    Clock,
    CheckCircle2,
    Menu,
    X,
    AlertCircle,
    User,
    Lock
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"

export default function LandingPage() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false)

    // Calculator State
    const [loanAmount, setLoanAmount] = React.useState([50000])
    const [tenure, setTenure] = React.useState([12])

    const INTEREST_RATE = 0.16
    const monthlyRate = INTEREST_RATE / 12
    const emi = React.useMemo(() => {
        const p = loanAmount[0]
        const n = tenure[0]
        if (p === 0) return 0
        return (p * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
    }, [loanAmount, tenure])

    const totalRepayment = emi * tenure[0]

    return (
        <div className="min-h-screen w-full bg-[#020617] relative selection:bg-emerald-500/20 text-slate-50 font-sans overflow-x-hidden">
            {/* Emerald Radial Glow Background - User Requested */}
            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(circle 800px at 50% 400px, rgba(16,185,129,0.25), transparent)`,
                }}
            />

            <div className="relative z-10">
                {/* Navigation */}
                <nav className="fixed top-0 left-0 right-0 z-50 bg-[#020617]/80 backdrop-blur-md border-b border-white/10">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="flex items-center justify-between h-16">
                            {/* Logo */}
                            <Link href="/" className="flex items-center gap-2">
                                <div className="relative h-8 w-8">
                                    <Image src="/logo.png" alt="Mslice Logo" fill className="object-contain" />
                                </div>
                                <span className="text-xl font-bold tracking-tight text-white">Mslice</span>
                            </Link>

                            {/* Desktop Nav */}
                            <div className="hidden md:flex items-center gap-8">
                                <Link href="#how-it-works" className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">How it Works</Link>
                                <Link href="#rates" className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">Rates</Link>
                                <Link href="#security" className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">Security</Link>
                            </div>

                            {/* Auth Buttons */}
                            <div className="hidden md:flex items-center gap-4">
                                <Link href="/login">
                                    <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/10">Log in</Button>
                                </Link>
                                <Link href="/login">
                                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white border-0">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Button>
                                </Link>
                            </div>

                            {/* Mobile Menu Toggle */}
                            <button className="md:hidden p-2 text-slate-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Nav */}
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="md:hidden bg-[#020617] border-b border-white/10 px-4 py-8 space-y-4"
                        >
                            <Link href="#how-it-works" className="block text-sm font-medium text-slate-300" onClick={() => setIsMenuOpen(false)}>How it Works</Link>
                            <Link href="#rates" className="block text-sm font-medium text-slate-300" onClick={() => setIsMenuOpen(false)}>Rates</Link>
                            <Link href="#security" className="block text-sm font-medium text-slate-300" onClick={() => setIsMenuOpen(false)}>Security</Link>
                            <div className="pt-4 flex flex-col gap-2">
                                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                                    <Button variant="outline" className="w-full border-white/10 text-slate-300 hover:bg-white/10 hover:text-white">Log in</Button>
                                </Link>
                                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Get Started</Button>
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </nav>

                {/* Hero Section */}
                <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
                    <div className="container mx-auto px-4 md:px-6 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                            {/* Hero Copy */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                                className="space-y-6 text-center lg:text-left"
                            >
                                <Badge variant="secondary" className="px-4 py-1.5 text-sm rounded-full border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                                    🚀 New: Instant approvals live
                                </Badge>
                                <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight leading-tight text-white">
                                    Loans Sliced to <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">Perfection.</span>
                                </h1>
                                <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
                                    Simple <span className="text-emerald-400 font-semibold">16% annual interest</span>. No hidden surprises. Manage your EMIs with bank-grade precision.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                                    <Link href="/login">
                                        <Button size="lg" className="h-12 px-8 text-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-900/20 border-0">
                                            Check Your Rate
                                        </Button>
                                    </Link>
                                    <Link href="#how-it-works">
                                        <Button size="lg" variant="outline" className="h-12 px-8 text-lg border-white/10 bg-white/5 hover:bg-white/10 text-white">
                                            How it Works
                                        </Button>
                                    </Link>
                                </div>
                                <div className="pt-6 flex items-center justify-center lg:justify-start gap-6 text-sm text-slate-400 font-medium">
                                    <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-500" /> Bank-grade Security</span>
                                    <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Zero hidden fees</span>
                                </div>
                            </motion.div>

                            {/* Calculator Interaction */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="relative"
                            >
                                <Card className="relative border-white/10 shadow-2xl backdrop-blur-md bg-[#0f172a]/60">
                                    <CardHeader className="border-b border-white/5 pb-6">
                                        <CardTitle className="text-white">Transparency Calculator</CardTitle>
                                        <CardDescription className="text-slate-400">See exactly what you pay before you sign up.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-8 pt-6">
                                        {/* Amount */}
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <label className="text-sm font-medium text-slate-300">Loan Amount</label>
                                                <span className="text-lg font-bold text-emerald-400">₹{loanAmount[0].toLocaleString()}</span>
                                            </div>
                                            <Slider
                                                value={loanAmount}
                                                onValueChange={setLoanAmount}
                                                min={1000}
                                                max={100000}
                                                step={1000}
                                                className="py-2"
                                            />
                                            <div className="flex justify-between text-xs text-slate-500">
                                                <span>₹1k</span>
                                                <span>₹100k</span>
                                            </div>
                                        </div>

                                        {/* Tenure */}
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <label className="text-sm font-medium text-slate-300">Tenure</label>
                                                <span className="text-lg font-bold text-emerald-400">{tenure[0]} Months</span>
                                            </div>
                                            <Slider
                                                value={tenure}
                                                onValueChange={setTenure}
                                                min={1}
                                                max={24}
                                                step={1}
                                                className="py-2"
                                            />
                                        </div>

                                        {/* Results */}
                                        <div className="bg-[#020617]/50 rounded-lg p-5 space-y-3 border border-white/5">
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-400 text-sm">Monthly EMI</span>
                                                <span className="text-2xl font-bold text-white">₹{Math.round(emi).toLocaleString()}</span>
                                            </div>
                                            <div className="h-px bg-white/5 w-full my-2" />
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-400">Interest Rate</span>
                                                <span className="font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">16% Fixed p.a.</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-400">Total Payback</span>
                                                <span className="text-slate-200">₹{Math.round(totalRepayment).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="pt-2 pb-6">
                                        <Link href="/login" className="w-full">
                                            <Button className="w-full h-12 text-base font-semibold bg-white text-emerald-950 hover:bg-slate-200 border-0 shadow-lg">
                                                Apply for ₹{loanAmount[0].toLocaleString()}
                                            </Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Transparency Grid */}
                <section id="rates" className="py-24 border-y border-white/5 bg-white/[0.02]">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                            <h2 className="text-3xl font-bold tracking-tight text-white">Radical Transparency</h2>
                            <p className="text-slate-400 text-lg leading-relaxed">We believe clear terms build better relationships. Here is everything you need to know.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Card 1 */}
                            <Card className="border-white/10 bg-[#0f172a]/40 hover:bg-[#0f172a]/60 transition-colors">
                                <CardHeader>
                                    <div className="mb-4 h-12 w-12 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                        <CreditCard className="h-6 w-6" />
                                    </div>
                                    <CardTitle className="text-xl text-white">16% Fixed Interest</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-slate-400 leading-relaxed">
                                        No variable rates. No market fluctuations. You lock in a rate of 16% per annum when you sign up, and it never changes.
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Card 2 */}
                            <Card className="border-white/10 bg-[#0f172a]/40 hover:bg-[#0f172a]/60 transition-colors">
                                <CardHeader>
                                    <div className="mb-4 h-12 w-12 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                                        <AlertCircle className="h-6 w-6" />
                                    </div>
                                    <CardTitle className="text-xl text-white">Transparent Penalties</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-slate-400 leading-relaxed">
                                        Missed a date? It happens. We charge a flat <span className="font-bold text-slate-200">₹300 late fee</span>. No compounding interest on penalties. Ever.
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Card 3 */}
                            <Card className="border-white/10 bg-[#0f172a]/40 hover:bg-[#0f172a]/60 transition-colors">
                                <CardHeader>
                                    <div className="mb-4 h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                                        <Clock className="h-6 w-6" />
                                    </div>
                                    <CardTitle className="text-xl text-white">Real-time Schedule</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-slate-400 leading-relaxed">
                                        View your exact payment dates 24/7 on your dashboard. Start planning your finances with absolute clarity.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section id="how-it-works" className="py-24 overflow-hidden relative">
                    <div className="container mx-auto px-4 md:px-6 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <h2 className="text-3xl font-bold tracking-tight text-white">Simple steps to get funded</h2>
                                    <p className="text-lg text-slate-400">A streamlined process designed for speed and security.</p>
                                </div>

                                <div className="space-y-8">
                                    {[
                                        { title: "Create Account", desc: "Sign up in seconds using your phone or email. We verify your identity instantly.", icon: User },
                                        { title: "Select Your Slice", desc: "Choose an amount between ₹1,000 and ₹100,000. Pick a tenure that suits you.", icon: Slider },
                                        { title: "Get Funds", desc: "Money is transferred directly to your bank account. Track repayment on the dashboard.", icon: Smartphone }
                                    ].map((step, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.1 }}
                                            className="flex gap-6 group"
                                        >
                                            <div className="flex-shrink-0 h-14 w-14 rounded-full border border-white/10 bg-white/5 flex items-center justify-center font-bold text-emerald-400 group-hover:border-emerald-500/50 group-hover:bg-emerald-500/10 transition-all">
                                                {i + 1}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                                                <p className="text-slate-400 leading-relaxed">{step.desc}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <Link href="/login">
                                    <Button size="lg" className="h-12 px-8 bg-white text-emerald-950 hover:bg-slate-200 border-0 font-semibold mt-4">
                                        Start Your Application
                                    </Button>
                                </Link>
                            </div>

                            {/* Visual Mockup */}
                            <div className="relative h-[600px] w-full bg-white/[0.02] rounded-3xl border border-white/5 flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />

                                {/* Phone Mockup */}
                                <div className="w-[300px] h-[580px] bg-[#020617] border-[8px] border-slate-800 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col z-10 translate-y-12">
                                    <div className="h-7 w-32 bg-slate-800 mx-auto rounded-b-xl absolute top-0 left-1/2 -translate-x-1/2 z-10" />
                                    <div className="p-8 pt-16 space-y-8 bg-gradient-to-b from-slate-900 to-[#020617] flex-1">
                                        <div className="flex items-center justify-between">
                                            <div className="h-8 w-8 bg-emerald-500/20 rounded-lg border border-emerald-500/30" />
                                            <div className="h-8 w-8 rounded-full bg-white/10" />
                                        </div>

                                        <div className="space-y-4">
                                            <div className="h-28 bg-white/5 rounded-xl border border-white/5 p-4 relative overflow-hidden">
                                                <div className="absolute inset-0 bg-emerald-500/5" />
                                                <div className="h-4 w-1/3 bg-white/10 rounded mb-3" />
                                                <div className="h-8 w-2/3 bg-white/20 rounded" />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="h-14 w-full bg-white/5 rounded-lg border border-white/5" />
                                                <div className="h-14 w-full bg-white/5 rounded-lg border border-white/5" />
                                            </div>
                                        </div>

                                        <div className="mt-auto pt-8">
                                            <div className="h-12 bg-emerald-600 rounded-lg w-full shadow-lg shadow-emerald-900/40" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Security Section */}
                <section id="security" className="py-24 bg-[#020617] border-t border-white/5 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

                    <div className="container mx-auto px-4 md:px-6 relative z-10 text-center space-y-10">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold tracking-tight text-white">Bank-grade Security</h2>
                            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                                We use industry-standard encryption to protect your data. Your financial information is strictly isolated and secure.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto pt-4">
                            <div className="bg-white/[0.03] backdrop-blur-sm p-8 rounded-2xl border border-white/5 hover:bg-white/[0.05] transition-colors">
                                <ShieldCheck className="h-10 w-10 mx-auto mb-6 text-emerald-400" />
                                <h3 className="font-bold text-white text-lg mb-2">256-bit Encryption</h3>
                                <p className="text-sm text-slate-400">All data transmitted via SSL with strict protocols.</p>
                            </div>
                            <div className="bg-white/[0.03] backdrop-blur-sm p-8 rounded-2xl border border-white/5 hover:bg-white/[0.05] transition-colors">
                                <Lock className="h-10 w-10 mx-auto mb-6 text-emerald-400" />
                                <h3 className="font-bold text-white text-lg mb-2">Secure Authentication</h3>
                                <p className="text-sm text-slate-400">Powered by enterprise-grade identity systems.</p>
                            </div>
                            <div className="bg-white/[0.03] backdrop-blur-sm p-8 rounded-2xl border border-white/5 hover:bg-white/[0.05] transition-colors">
                                <Smartphone className="h-10 w-10 mx-auto mb-6 text-emerald-400" />
                                <h3 className="font-bold text-white text-lg mb-2">Device Verification</h3>
                                <p className="text-sm text-slate-400">OTP and device binding for every transaction.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-16 border-t border-white/5 bg-[#020617]">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="grid md:grid-cols-4 gap-12 mb-12">
                            <div className="col-span-1 md:col-span-2 space-y-6">
                                <div className="flex items-center gap-2">
                                    <div className="relative h-6 w-6 opacity-90">
                                        <Image src="/logo.png" alt="Mslice Logo" fill className="object-contain" />
                                    </div>
                                    <span className="text-lg font-bold text-white">Mslice</span>
                                </div>
                                <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
                                    The modern standard for personal lending. Precise, transparent, and built for your financial health.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-white mb-6">Product</h4>
                                <ul className="space-y-4 text-sm text-slate-400">
                                    <li><Link href="#rates" className="hover:text-emerald-400 transition-colors">Rates & Fees</Link></li>
                                    <li><Link href="#how-it-works" className="hover:text-emerald-400 transition-colors">How it Works</Link></li>
                                    <li><Link href="/login" className="hover:text-emerald-400 transition-colors">Calculator</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-white mb-6">Company</h4>
                                <ul className="space-y-4 text-sm text-slate-400">
                                    <li><Link href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
                                    <li><Link href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
                                    <li><Link href="#" className="hover:text-emerald-400 transition-colors">Responsible Lending</Link></li>
                                </ul>
                            </div>
                        </div>

                        <div className="border-t border-white/5 pt-8">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                                <p className="text-xs text-slate-500">© {new Date().getFullYear()} Mslice Financial Services. All rights reserved.</p>
                            </div>
                            <p className="text-[10px] text-slate-600 leading-relaxed max-w-3xl">
                                <strong>Disclaimer:</strong> Mslice is a technology platform. All loans are subject to credit approval.
                                The 16% interest rate mentioned is a fixed annual percentage rate (APR).
                                Late fees of ₹300 apply fixedly. Please borrow responsibly.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    )
}
