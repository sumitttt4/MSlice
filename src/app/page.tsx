"use client"

export const dynamic = "force-dynamic";

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import {
    ShieldCheck,
    Smartphone,
    CreditCard,
    Clock,
    CheckCircle2,
    Menu,
    X,
    AlertCircle,
    User,
    Lock,
    ChevronRight,
    ArrowUpRight,
    Fingerprint
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
    const { scrollY } = useScroll()
    const headerBg = useTransform(scrollY, [0, 50], ["rgba(2, 6, 23, 0)", "rgba(2, 6, 23, 0.8)"])

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
    }, [loanAmount, tenure, monthlyRate])

    return (
        <div className="min-h-screen w-full bg-[#020617] relative selection:bg-emerald-500/20 text-slate-50 font-sans overflow-x-hidden">
            {/* Mesh Gradient & Grain Background */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] bg-teal-500/10 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-150" />
            </div>

            {/* Emerald Radial Glow Background */}
            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(circle 800px at 50% 400px, rgba(16,185,129,0.15), transparent)`,
                }}
            />

            <div className="relative z-10">
                {/* Navigation - Pill Design */}
                <motion.div
                    style={{ backgroundColor: headerBg }}
                    className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4"
                >
                    <nav className="w-full max-w-5xl bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl h-16 flex items-center justify-between px-6 shadow-2xl transition-all duration-300">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-2 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                                <div className="relative h-full w-full">
                                    <Image src="/logo.png" alt="Mslice Logo" fill className="object-contain invert brightness-0" />
                                </div>
                            </div>
                            <span className="text-xl font-bold tracking-tight text-white hidden sm:block">Mslice</span>
                        </Link>

                        {/* Desktop Nav Links */}
                        <div className="hidden md:flex items-center gap-10">
                            {['How it Works', 'Rates', 'Security'].map((item) => (
                                <Link
                                    key={item}
                                    href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="text-sm font-medium text-slate-400 hover:text-white transition-colors relative group"
                                >
                                    {item}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 group-hover:w-full transition-all duration-300" />
                                </Link>
                            ))}
                        </div>

                        {/* Auth Buttons */}
                        <div className="flex items-center gap-4">
                            <Link href="/login" className="hidden sm:block">
                                <Button variant="ghost" className="text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 h-10 px-4">Log in</Button>
                            </Link>
                            <Link href="/login">
                                <Button className="bg-[#f8fafc] hover:bg-white text-slate-950 font-bold px-6 rounded-xl h-10 border-0 shadow-lg shadow-white/5 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                    Get Started
                                </Button>
                            </Link>

                            <button className="md:hidden p-2 text-slate-300 ml-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </nav>

                    {/* Mobile Nav Overlay */}
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className="absolute top-24 left-4 right-4 bg-[#020617]/98 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 flex flex-col gap-6 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] md:hidden border-t-emerald-500/20"
                        >
                            <Link href="#how-it-works" className="text-xl font-semibold text-slate-300" onClick={() => setIsMenuOpen(false)}>How it Works</Link>
                            <Link href="#rates" className="text-xl font-semibold text-slate-300" onClick={() => setIsMenuOpen(false)}>Rates</Link>
                            <Link href="#security" className="text-xl font-semibold text-slate-300" onClick={() => setIsMenuOpen(false)}>Security</Link>
                            <div className="h-px bg-white/5 w-full my-2" />
                            <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                                <Button variant="outline" className="w-full border-white/10 text-slate-300 h-14 rounded-xl text-lg">Log in</Button>
                            </Link>
                            <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                                <Button className="w-full bg-emerald-500 text-white h-14 rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/20 border-0">Get Started</Button>
                            </Link>
                        </motion.div>
                    )}
                </motion.div>

                {/* Hero Section */}
                <section className="relative pt-40 pb-24 md:pt-48 md:pb-40 overflow-hidden">
                    <div className="container mx-auto px-4 md:px-6 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                            {/* Hero Copy */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="space-y-10 text-center lg:text-left"
                            >
                                <div className="space-y-6">
                                    <Badge variant="outline" className="px-4 py-2 text-xs font-bold rounded-full border-emerald-500/20 bg-emerald-500/5 text-emerald-400 backdrop-blur-sm animate-pulse">
                                        ✨ REDEFINING PERSONAL FINANCE
                                    </Badge>
                                    <h1 className="text-5xl md:text-6xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-white">
                                        Loans Sliced to <br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-300 via-emerald-500 to-teal-200">Perfection.</span>
                                    </h1>
                                    <p className="text-xl text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
                                        Access instant capital with a flat <span className="text-white font-bold bg-emerald-500/10 px-2 py-0.5 rounded">16% APR</span>. No hidden costs. No complexity. Just pure fintech precision.
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-4">
                                    <Link href="/login">
                                        <Button size="lg" className="h-16 px-10 text-lg font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_20px_40px_-12px_rgba(16,185,129,0.3)] border-0 rounded-2xl transition-all hover:translate-y-[-2px]">
                                            Get Your Slice <ChevronRight className="ml-2 h-5 w-5" />
                                        </Button>
                                    </Link>
                                    <Link href="#how-it-works">
                                        <Button size="lg" variant="outline" className="h-16 px-10 text-lg font-bold border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-2xl backdrop-blur-sm">
                                            How it Works
                                        </Button>
                                    </Link>
                                </div>
                                <div className="pt-8 flex flex-wrap items-center justify-center lg:justify-start gap-8 text-sm text-slate-500 divide-x divide-white/10">
                                    <span className="flex items-center gap-3 font-medium text-slate-300"><ShieldCheck className="h-5 w-5 text-emerald-500" /> Bank-grade Security</span>
                                    <span className="flex items-center gap-3 pl-8 font-medium text-slate-300"><CheckCircle2 className="h-5 w-5 text-emerald-500" /> No collateral needed</span>
                                </div>
                            </motion.div>

                            {/* Integrated Calculator Card */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="relative"
                            >
                                {/* Decorative Glow behind card */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-[2.5rem] blur-2xl opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200" />

                                <Card className="relative border-white/[0.08] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.4)] backdrop-blur-2xl bg-white/[0.02] rounded-[2rem] overflow-hidden">
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

                                    <CardHeader className="border-b border-white/[0.05] p-8">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-2xl font-bold text-white mb-1">Calculator</CardTitle>
                                                <CardDescription className="text-slate-500 font-medium">Configure your perfect EMI schedule</CardDescription>
                                            </div>
                                            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                                <CreditCard className="text-emerald-400 h-6 w-6" />
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-10 p-8">
                                        {/* Amount */}
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-end">
                                                <label className="text-sm font-bold uppercase tracking-widest text-slate-500">Loan Principal</label>
                                                <div className="text-3xl font-black text-white">₹{loanAmount[0].toLocaleString()}</div>
                                            </div>
                                            <Slider
                                                value={loanAmount}
                                                onValueChange={setLoanAmount}
                                                min={5000}
                                                max={200000}
                                                step={5000}
                                                className="[&_[role=slider]]:h-6 [&_[role=slider]]:w-6 [&_[role=slider]]:border-4 [&_[role=slider]]:border-[#020617] [&_[role=slider]]:bg-emerald-500"
                                            />
                                            <div className="flex justify-between text-xs font-bold text-slate-600">
                                                <span>LIMIT: ₹5,000</span>
                                                <span>LIMIT: ₹2,00,000</span>
                                            </div>
                                        </div>

                                        {/* Tenure */}
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-end">
                                                <label className="text-sm font-bold uppercase tracking-widest text-slate-500">Duration</label>
                                                <div className="text-2xl font-black text-emerald-400">{tenure[0]} <span className="text-sm text-slate-500">Months</span></div>
                                            </div>
                                            <Slider
                                                value={tenure}
                                                onValueChange={setTenure}
                                                min={3}
                                                max={36}
                                                step={3}
                                                className="[&_[role=slider]]:h-6 [&_[role=slider]]:w-6 [&_[role=slider]]:border-4 [&_[role=slider]]:border-[#020617] [&_[role=slider]]:bg-emerald-400"
                                            />
                                        </div>

                                        {/* Result Grid */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white/[0.03] border border-white/[0.05] p-5 rounded-2xl relative group hover:bg-white/[0.05] transition-colors">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Monthly Cost</p>
                                                <p className="text-2xl font-black text-white">₹{Math.round(emi).toLocaleString()}</p>
                                                <div className="absolute top-3 right-3 opacity-20 group-hover:opacity-100 transition-opacity">
                                                    <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                                                </div>
                                            </div>
                                            <div className="bg-white/[0.03] border border-white/[0.05] p-5 rounded-2xl">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Annual Rate</p>
                                                <p className="text-2xl font-black text-emerald-400">16.0%</p>
                                            </div>
                                        </div>
                                    </CardContent>

                                    <CardFooter className="p-8 pt-0">
                                        <Link href="/login" className="w-full">
                                            <Button className="w-full h-16 text-lg font-black bg-white text-emerald-950 hover:bg-slate-100 border-0 rounded-2xl shadow-xl transition-all hover:scale-[1.01]">
                                                Apply Now
                                            </Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Transparency - Feature Grid */}
                <section id="rates" className="py-32 relative">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
                            <div className="max-w-xl space-y-4">
                                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">Institutional <span className="text-emerald-500 italic">Security.</span><br />Radical Clarity.</h2>
                                <p className="text-slate-400 text-lg">We don&apos;t do complex. We do precise. Every term is explained, every rupee accounted for.</p>
                            </div>
                            <Link href="/login">
                                <Button variant="link" className="text-emerald-400 font-bold p-0 text-lg group">
                                    View Full Rate Schedule <ArrowUpRight className="ml-1 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { title: "Simple Fixed APR", icon: Fingerprint, color: "text-emerald-400", bg: "bg-emerald-500/10", desc: "No dynamic algorithms. You get a flat 16% per year clearly calculated on the reducing balance." },
                                { title: "Capped Penalties", icon: AlertCircle, color: "text-amber-400", bg: "bg-amber-500/10", desc: "Life happens. We charge a one-time ₹300 fee for late payments. No compounding interest on penalties." },
                                { title: "Instant Liquidations", icon: Clock, color: "text-blue-400", bg: "bg-blue-500/10", desc: "Close your loan early at zero cost. We don&apos;t believe in penalizing you for being responsible." }
                            ].map((feature, i) => (
                                <Card key={i} className="border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04] transition-all p-8 rounded-[2rem] group cursor-default">
                                    <div className={cn("mb-8 h-16 w-16 rounded-2xl flex items-center justify-center border border-white/5 transition-transform group-hover:rotate-6", feature.bg, feature.color)}>
                                        <feature.icon className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                                    <p className="text-slate-400 leading-relaxed font-medium">{feature.desc}</p>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works - Immersive UX */}
                <section id="how-it-works" className="py-32 bg-white/[0.01] border-y border-white/[0.05]">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="grid lg:grid-cols-2 gap-24 items-center">
                            <div className="space-y-12">
                                <div className="space-y-4 text-center lg:text-left">
                                    <Badge className="bg-emerald-500/10 text-emerald-400 border-0 mb-2">THE PROCESS</Badge>
                                    <h2 className="text-4xl md:text-5xl font-black text-white">Three steps to your <br /> financial freedom.</h2>
                                </div>

                                <div className="space-y-12 relative">
                                    {/* Visual line connecting steps */}
                                    <div className="absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-emerald-500/50 via-white/5 to-transparent hidden md:block" />

                                    {[
                                        { title: "One-Tap Auth", desc: "Link your bank and verify identity in 60 seconds. No physical documents required.", icon: User },
                                        { title: "Pick Your Slice", desc: "Select any amount from ₹5,000 to ₹2,00,000. Real-time disbursement after approval.", icon: Fingerprint },
                                        { title: "Slice Your EMIs", desc: "Automate repayments and track every rupee through your premium dashboard.", icon: Smartphone }
                                    ].map((step, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.1 }}
                                            className="flex gap-8 group"
                                        >
                                            <div className="flex-shrink-0 h-16 w-16 rounded-3xl border border-white/10 bg-white/5 flex items-center justify-center font-black text-2xl text-emerald-400 group-hover:bg-emerald-500 group-hover:text-[#020617] transition-all relative z-10">
                                                {i + 1}
                                            </div>
                                            <div className="py-2">
                                                <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-3">
                                                    {step.title}
                                                    <span className="h-px w-8 bg-emerald-500/20 group-hover:w-16 transition-all duration-500" />
                                                </h3>
                                                <p className="text-slate-400 leading-relaxed text-lg">{step.desc}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* App Visual Mockup */}
                            <div className="relative h-[700px] w-full bg-gradient-to-br from-emerald-500/10 to-teal-500/5 rounded-[3rem] border border-white/[0.05] flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-0 bg-[url('https://patterncraft.fun/img/grain_gradient.png')] opacity-20" />

                                {/* Phone Container */}
                                <div className="w-[320px] h-[640px] bg-[#020617] border-[12px] border-slate-900 rounded-[3.5rem] shadow-3xl relative overflow-hidden flex flex-col z-10 translate-y-12 ring-2 ring-white/10">
                                    <div className="h-8 w-36 bg-slate-900 mx-auto rounded-b-[1.5rem] absolute top-0 left-1/2 -translate-x-1/2 z-20" />

                                    <div className="p-8 pt-16 space-y-8 bg-slate-950 flex-1 flex flex-col">
                                        <div className="flex items-center justify-between">
                                            <div className="h-10 w-10 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center justify-center">
                                                <div className="h-4 w-4 bg-emerald-500 rounded-full animate-pulse" />
                                            </div>
                                            <div className="h-10 w-10 rounded-full bg-white/5 ring-1 ring-white/10" />
                                        </div>

                                        <div className="space-y-6">
                                            <div className="h-32 bg-white/[0.03] rounded-3xl border border-white/[0.05] p-6 space-y-3">
                                                <div className="h-3 w-1/4 bg-slate-700 rounded-full" />
                                                <div className="h-8 w-2/3 bg-white rounded-xl" />
                                            </div>
                                            <div className="space-y-3">
                                                <div className="h-16 w-full bg-white/[0.03] rounded-2xl border border-white/[0.05]" />
                                                <div className="h-16 w-full bg-white/[0.03] rounded-2xl border border-white/[0.05]" />
                                            </div>
                                        </div>

                                        <div className="mt-auto pb-6">
                                            <div className="h-14 bg-emerald-500 rounded-2xl w-full shadow-lg shadow-emerald-500/20 flex items-center justify-center font-bold text-[#020617]">
                                                Proceed to Pay
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Secure Trust Bar */}
                <section id="security" className="py-24 border-t border-white/[0.05]">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="bg-gradient-to-br from-emerald-500/5 to-transparent rounded-[3rem] border border-white/[0.03] p-12 md:p-20 relative overflow-hidden text-center">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

                            <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
                                <Lock className="h-16 w-16 mx-auto text-emerald-500 mb-4 opacity-80" />
                                <h2 className="text-4xl font-black text-white">Fortified by bank-grade <br /> encryption protocols.</h2>
                                <p className="text-xl text-slate-400 italic">&quot;Security isn&apos;t a feature, it&apos;s our foundation.&quot;</p>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                                    {['AES-256', 'SSL-v3', 'PCI-DSS', 'SOC-2'].map((cert) => (
                                        <div key={cert} className="py-4 px-6 bg-white/5 rounded-2xl border border-white/10 text-white font-black tracking-widest text-xs uppercase opacity-60 hover:opacity-100 transition-opacity">
                                            {cert}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-24 border-t border-white/[0.05] bg-[#020617] relative">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="grid md:grid-cols-12 gap-16 mb-24">
                            <div className="md:col-span-4 space-y-8">
                                <div className="flex items-center gap-3">
                                    <div className="relative h-8 w-8 rounded-xl bg-emerald-500 p-1.5 flex items-center justify-center">
                                        <Image src="/logo.png" alt="Mslice Logo" fill className="object-contain invert brightness-0" />
                                    </div>
                                    <span className="text-2xl font-black text-white px-2">Mslice</span>
                                </div>
                                <p className="text-slate-500 text-lg leading-relaxed max-w-sm">
                                    The new gold standard for consumer credit. Precise, transparent, and absolutely uncompromising.
                                </p>
                            </div>
                            <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-12">
                                <div className="space-y-8 text-center md:text-left">
                                    <h4 className="font-black text-white uppercase tracking-widest text-xs">Product</h4>
                                    <ul className="space-y-5 text-slate-500 font-bold">
                                        <li><Link href="#rates" className="hover:text-emerald-500 transition-colors">Rates & Fees</Link></li>
                                        <li><Link href="#how-it-works" className="hover:text-emerald-500 transition-colors">The Process</Link></li>
                                        <li><Link href="/login" className="hover:text-emerald-500 transition-colors">Calculator</Link></li>
                                    </ul>
                                </div>
                                <div className="space-y-8 text-center md:text-left">
                                    <h4 className="font-black text-white uppercase tracking-widest text-xs">Legal</h4>
                                    <ul className="space-y-5 text-slate-500 font-bold">
                                        <li><Link href="#" className="hover:text-emerald-500 transition-colors">Privacy</Link></li>
                                        <li><Link href="#" className="hover:text-emerald-500 transition-colors">Terms</Link></li>
                                        <li><Link href="#" className="hover:text-emerald-500 transition-colors">Compliance</Link></li>
                                    </ul>
                                </div>
                                <div className="col-span-2 md:col-span-1 space-y-8 text-center md:text-left">
                                    <h4 className="font-black text-white uppercase tracking-widest text-xs">Contact</h4>
                                    <ul className="space-y-5 text-slate-500 font-bold">
                                        <li className="text-white">India, Bangalore</li>
                                        <li className="hover:text-emerald-500 transition-colors">support@mslice.in</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-white/[0.05] pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
                            <p className="text-sm text-slate-600 font-black tracking-widest">© {new Date().getFullYear()} MSLICE FINANCIAL SERVICES INC.</p>
                            <div className="flex gap-8">
                                <Link href="#" className="text-slate-600 hover:text-white transition-colors"><Fingerprint className="h-6 w-6" /></Link>
                                <Link href="#" className="text-slate-600 hover:text-white transition-colors"><ShieldCheck className="h-6 w-6" /></Link>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    )
}
