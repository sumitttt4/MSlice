"use client"

export const dynamic = "force-dynamic";

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform, Variants } from "framer-motion"
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
    Fingerprint,
    Zap,
    Shield,
    TrendingUp
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut"
        }
    }
}

export default function LandingPage() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false)
    const { scrollY } = useScroll()
    const headerBg = useTransform(scrollY, [0, 50], ["rgba(2, 6, 23, 0)", "rgba(2, 6, 23, 0.9)"])

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
        <div className="min-h-screen w-full bg-[#020617] relative selection:bg-emerald-500/20 text-[#F8FAFC] font-sans overflow-x-hidden">
            {/* Minimal Background with Texture */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#020617]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] brightness-100 contrast-100 mix-blend-overlay" />
            </div>

            <div className="relative z-10">
                {/* Navigation */}
                <motion.div
                    style={{ backgroundColor: headerBg }}
                    className="fixed top-0 left-0 right-0 z-50 flex justify-center py-4 px-4"
                >
                    <nav className="w-full max-w-7xl backdrop-blur-md border border-[#0F172A] bg-[#020617]/50 rounded-2xl h-16 flex items-center justify-between px-8 transition-all duration-300">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="relative h-6 w-6 rounded bg-[#10B981] p-1 flex items-center justify-center">
                                <Image src="/logo.png" alt="Mslice Logo" fill className="object-contain invert brightness-0" />
                            </div>
                            <span className="text-[18px] font-bold tracking-tight text-[#F8FAFC]">Mslice</span>
                        </Link>

                        {/* Centered Nav Links */}
                        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
                            {['How it Works', 'Rates', 'Security'].map((item) => (
                                <Link
                                    key={item}
                                    href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="text-[14px] font-medium text-[#CBD5E1] hover:text-[#F8FAFC] transition-colors"
                                >
                                    {item}
                                </Link>
                            ))}
                        </div>

                        {/* CTA */}
                        <div className="flex items-center gap-6">
                            <Link href="/login">
                                <Button className="bg-[#10B981] hover:bg-[#059669] text-[#020617] text-[14px] font-semibold px-6 rounded-xl h-10 border-0 transition-all">
                                    Get Started
                                </Button>
                            </Link>

                            <button className="md:hidden p-2 text-[#CBD5E1]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </nav>

                    {/* Mobile Nav Overlay */}
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute top-24 left-4 right-4 bg-[#020617] border border-[#0F172A] rounded-2xl p-8 flex flex-col gap-6 shadow-2xl md:hidden"
                        >
                            <Link href="#how-it-works" className="text-[14px] font-medium text-[#CBD5E1]" onClick={() => setIsMenuOpen(false)}>How it Works</Link>
                            <Link href="#rates" className="text-[14px] font-medium text-[#CBD5E1]" onClick={() => setIsMenuOpen(false)}>Rates</Link>
                            <Link href="#security" className="text-[14px] font-medium text-[#CBD5E1]" onClick={() => setIsMenuOpen(false)}>Security</Link>
                            <div className="h-px bg-[#0F172A] w-full my-2" />
                            <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                                <Button className="w-full bg-[#10B981] text-[#020617] h-12 rounded-xl font-semibold text-[14px] border-0">Get Started</Button>
                            </Link>
                        </motion.div>
                    )}
                </motion.div>

                {/* Hero Section */}
                <section className="relative pt-48 pb-16 md:pt-64 md:pb-32">
                    <div className="container mx-auto px-4 md:px-6 relative z-10">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                            className="max-w-4xl mx-auto text-center space-y-8"
                        >
                            <motion.div variants={itemVariants}>
                                <Badge variant="outline" className="px-3 py-1 text-[12px] font-semibold tracking-[0.04em] rounded-full border-[#10B981]/20 bg-[#10B981]/20 text-[#10B981] uppercase">
                                    Institutional Grade Personal Loans
                                </Badge>
                            </motion.div>

                            <motion.h1 variants={itemVariants} className="text-[72px] leading-[1.05] font-bold tracking-tight text-[#F8FAFC]">
                                Loans built on <br />
                                <span className="text-[#10B981]">Pure Integrity.</span>
                            </motion.h1>

                            <motion.p variants={itemVariants} className="text-[18px] leading-[1.6] font-normal text-[#CBD5E1] max-w-2xl mx-auto">
                                Access instant capital with a flat 16% APR. No hidden fees, no complex algorithms—just transparent credit for the modern professional.
                            </motion.p>

                            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                                <Link href="/login">
                                    <Button className="h-14 px-10 text-[14px] font-semibold bg-[#10B981] hover:bg-[#059669] text-[#020617] rounded-xl border-0 transition-all">
                                        Check Your Rate
                                    </Button>
                                </Link>
                                <Link href="#how-it-works">
                                    <Button variant="ghost" className="h-14 px-10 text-[14px] font-medium text-[#F8FAFC] hover:bg-[#F8FAFC]/5 rounded-xl transition-all">
                                        How it Works
                                    </Button>
                                </Link>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Calculator Section */}
                <section id="calculator" className="py-24 relative bg-transparent">
                    <div className="container mx-auto px-4 md:px-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="max-w-4xl mx-auto"
                        >
                            <Card className="border-[#0F172A] bg-[#020617] rounded-3xl overflow-hidden shadow-2xl">
                                <div className="grid md:grid-cols-2">
                                    {/* Left Side: Inputs */}
                                    <div className="p-10 border-r border-[#0F172A] space-y-10">
                                        <div className="space-y-1">
                                            <h3 className="text-[24px] leading-[1.3] font-semibold text-[#F8FAFC]">Calculator</h3>
                                            <p className="text-[14px] leading-[1.6] font-normal text-[#94A3B8]">Fixed 16% reducing APR</p>
                                        </div>

                                        {/* Amount Slider */}
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-end">
                                                <label className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[#94A3B8]">Amount Required</label>
                                                <div className="text-[24px] font-semibold text-[#F8FAFC]">₹{loanAmount[0].toLocaleString()}</div>
                                            </div>
                                            <Slider
                                                value={loanAmount}
                                                onValueChange={setLoanAmount}
                                                min={5000}
                                                max={200000}
                                                step={5000}
                                                className="[&_[role=slider]]:bg-[#10B981] [&_[role=slider]]:h-5 [&_[role=slider]]:w-5"
                                            />
                                        </div>

                                        {/* Tenure Slider */}
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-end">
                                                <label className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[#94A3B8]">Tenure</label>
                                                <div className="text-[24px] font-semibold text-[#10B981]">{tenure[0]} <span className="text-[14px] text-[#94A3B8]">Months</span></div>
                                            </div>
                                            <Slider
                                                value={tenure}
                                                onValueChange={setTenure}
                                                min={3}
                                                max={36}
                                                step={3}
                                                className="[&_[role=slider]]:bg-[#10B981] [&_[role=slider]]:h-5 [&_[role=slider]]:w-5"
                                            />
                                        </div>
                                    </div>

                                    {/* Right Side: Results */}
                                    <div className="p-10 flex flex-col justify-between bg-[#F8FAFC]/[0.02]">
                                        <div className="space-y-6">
                                            <div className="p-6 bg-[#0F172A]/50 border border-[#0F172A] rounded-2xl space-y-1">
                                                <p className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[#94A3B8]">Monthly EMI</p>
                                                <p className="text-[40px] leading-[1.2] font-semibold text-[#F8FAFC]">₹{Math.round(emi).toLocaleString()}</p>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between py-2 border-b border-[#0F172A]">
                                                    <span className="text-[14px] text-[#94A3B8]">Processing Fee</span>
                                                    <span className="text-[14px] font-semibold text-[#F8FAFC]">₹0</span>
                                                </div>
                                                <div className="flex items-center justify-between py-2 border-b border-[#0F172A]">
                                                    <span className="text-[14px] text-[#94A3B8]">Prepayment Charges</span>
                                                    <span className="text-[14px] font-semibold text-[#10B981]">None</span>
                                                </div>
                                            </div>
                                        </div>

                                        <Link href="/login" className="pt-8">
                                            <Button className="w-full h-14 text-[14px] font-semibold bg-[#10B981] hover:bg-[#059669] text-[#020617] rounded-xl border-0 shadow-lg">
                                                Instant Approval
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    </div>
                </section>

                {/* Features Section - Bento Grid */}
                <section id="rates" className="py-32 relative">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="text-center space-y-4 mb-20 max-w-3xl mx-auto">
                            <h2 className="text-[40px] leading-[1.2] font-semibold text-[#F8FAFC]">The Mslice Protocol.</h2>
                            <p className="text-[16px] leading-[1.6] font-normal text-[#94A3B8]">Engineered for transparency, built for speed.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {/* Feature 1: Large Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                className="md:col-span-2 lg:col-span-3 p-8 border border-[#0F172A] bg-[#020617]/50 rounded-[2.5rem] flex flex-col justify-between group hover:border-[#10B981]/30 transition-all duration-500"
                            >
                                <div className="space-y-6">
                                    <div className="h-12 w-12 rounded-2xl bg-[#10B981]/20 flex items-center justify-center text-[#10B981] group-hover:scale-110 transition-transform">
                                        <Zap className="h-6 w-6" />
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-[24px] font-semibold text-[#F8FAFC]">Zero Processing Latency</h3>
                                        <p className="text-[14px] leading-[1.6] text-[#94A3B8] font-normal">Real-time credit evaluation engine identifies your eligibility in under 60 seconds.</p>
                                    </div>
                                </div>
                                <div className="mt-12 flex items-center gap-2 text-[#10B981] text-[12px] font-bold uppercase tracking-wider">
                                    Institutional Speed <ChevronRight className="h-4 w-4" />
                                </div>
                            </motion.div>

                            {/* Feature 2: Tall Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="md:col-span-2 lg:col-span-3 p-8 border border-[#0F172A] bg-[#020617]/50 rounded-[2.5rem] flex flex-col justify-between group hover:border-[#10B981]/30 transition-all duration-500"
                            >
                                <div className="space-y-6">
                                    <div className="h-12 w-12 rounded-2xl bg-[#10B981]/20 flex items-center justify-center text-[#10B981] group-hover:scale-110 transition-transform">
                                        <Shield className="h-6 w-6" />
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-[24px] font-semibold text-[#F8FAFC]">Sovereign Repayment</h3>
                                        <p className="text-[14px] leading-[1.6] text-[#94A3B8] font-normal">No exit penalties for early closure. Pay back on your own terms with absolute liquidity.</p>
                                    </div>
                                </div>
                                <div className="mt-12 flex items-center gap-2 text-[#10B981] text-[12px] font-bold uppercase tracking-wider">
                                    Zero Exit Friction <ChevronRight className="h-4 w-4" />
                                </div>
                            </motion.div>

                            {/* Feature 3: Full Width Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="md:col-span-4 lg:col-span-6 p-10 border border-[#0F172A] bg-[#020617]/50 rounded-[2.5rem] flex flex-col md:flex-row gap-8 items-center group hover:border-[#10B981]/30 transition-all duration-500"
                            >
                                <div className="flex-1 space-y-6">
                                    <div className="h-12 w-12 rounded-2xl bg-[#10B981]/20 flex items-center justify-center text-[#10B981]">
                                        <TrendingUp className="h-6 w-6" />
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-[32px] font-semibold text-[#F8FAFC] tracking-tight">Fixed 16% APR Protocol.</h3>
                                        <p className="text-[16px] leading-[1.6] text-[#94A3B8] max-w-xl font-normal">Our interest rate is static and clearly explained. No floating rates, no dynamic shifts, just pure predictability for your financial roadmap.</p>
                                    </div>
                                </div>
                                <div className="hidden lg:block w-px h-32 bg-[#0F172A]" />
                                <div className="flex gap-12">
                                    <div className="text-center">
                                        <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-widest mb-1 text-nowrap">Reducing Balance</p>
                                        <p className="text-[24px] font-bold text-[#F8FAFC]">Industry Standard</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-widest mb-1 text-nowrap">Hidden Costs</p>
                                        <p className="text-[24px] font-bold text-[#10B981]">Absolute Zero</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* How It Works - Enhanced Step Flow */}
                <section id="how-it-works" className="py-32 border-t border-[#0F172A]">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="grid lg:grid-cols-2 gap-24 items-center">
                            <div className="space-y-16">
                                <div className="space-y-4">
                                    <h2 className="text-[40px] leading-[1.2] font-semibold text-[#F8FAFC]">The Flow.</h2>
                                    <p className="text-[16px] leading-[1.6] font-normal text-[#94A3B8]">A streamlined capital access engine built for modern professionals.</p>
                                </div>

                                <div className="relative space-y-12">
                                    {/* Line connecting steps */}
                                    <div className="absolute left-6 top-6 bottom-6 w-px bg-gradient-to-b from-[#10B981] via-[#0F172A] to-transparent" />

                                    {[
                                        { title: "Authentication", desc: "Link your bank and verify identity in 60 seconds. No physical documents required.", icon: User },
                                        { title: "Configuration", desc: "Select any amount from ₹5,000 to ₹2,00,000. Real-time disbursement after approval.", icon: Fingerprint },
                                        { title: "Management", desc: "Automate repayments and track every rupee through your concierge dashboard.", icon: Smartphone }
                                    ].map((step, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.1 }}
                                            className="flex gap-8 items-start relative z-10"
                                        >
                                            <div className="flex-shrink-0 h-12 w-12 rounded-2xl bg-[#020617] border border-[#10B981] flex items-center justify-center text-[18px] font-bold text-[#10B981] shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                                                {i + 1}
                                            </div>
                                            <div className="space-y-2 py-1">
                                                <h4 className="text-[20px] font-semibold text-[#F8FAFC]">{step.title}</h4>
                                                <p className="text-[14px] leading-[1.6] font-normal text-[#94A3B8] max-w-sm">{step.desc}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="relative aspect-square bg-[#0F172A]/30 rounded-[3rem] border border-[#0F172A] flex items-center justify-center overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#10B981]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                <div className="p-12 text-center space-y-8 relative z-10">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-[#10B981] blur-2xl opacity-10 animate-pulse" />
                                        <ShieldCheck className="h-24 w-24 mx-auto text-[#10B981] relative z-10" />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[18px] font-semibold text-[#F8FAFC]">Institutional Shield</p>
                                        <p className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[#64748B]">Secured with AES-256 Protocol</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-24 border-t border-[#0F172A] bg-[#020617]">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="grid md:grid-cols-12 gap-16 mb-24">
                            <div className="md:col-span-5 space-y-8">
                                <Link href="/" className="flex items-center gap-2">
                                    <div className="relative h-6 w-6 rounded bg-[#10B981] p-1 flex items-center justify-center">
                                        <Image src="/logo.png" alt="Mslice Logo" fill className="object-contain invert brightness-0" />
                                    </div>
                                    <span className="text-[18px] font-bold text-[#F8FAFC]">Mslice</span>
                                </Link>
                                <p className="text-[16px] leading-[1.6] font-normal text-[#94A3B8] max-w-sm">
                                    Institutional grade personal credit. Precise, transparent, and absolutely uncompromising.
                                </p>
                            </div>
                            <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12 text-[14px]">
                                <div className="space-y-6">
                                    <h4 className="font-semibold text-[#64748B] uppercase tracking-[0.04em]">Product</h4>
                                    <ul className="space-y-4 text-[#CBD5E1]">
                                        <li><Link href="#rates">Rates & Fees</Link></li>
                                        <li><Link href="#how-it-works">Process</Link></li>
                                        <li><Link href="/login">Apply</Link></li>
                                    </ul>
                                </div>
                                <div className="space-y-6">
                                    <h4 className="font-semibold text-[#64748B] uppercase tracking-[0.04em]">Company</h4>
                                    <ul className="space-y-4 text-[#CBD5E1]">
                                        <li><Link href="#">Privacy</Link></li>
                                        <li><Link href="#">Terms</Link></li>
                                        <li><Link href="#">Security</Link></li>
                                    </ul>
                                </div>
                                <div className="space-y-6">
                                    <h4 className="font-semibold text-[#64748B] uppercase tracking-[0.04em]">Support</h4>
                                    <ul className="space-y-4 text-[#CBD5E1]">
                                        <li><Link href="#">Help Center</Link></li>
                                        <li className="text-[#F8FAFC]">support@mslice.in</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="pt-12 border-t border-[#0F172A] flex flex-col md:flex-row justify-between items-center gap-6">
                            <p className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[#64748B]">© {new Date().getFullYear()} MSLICE FINANCIAL SERVICES INC.</p>
                            <div className="flex gap-4 items-center opacity-40 grayscale invert">
                                <Image src="/logo.png" alt="Trusted Partner" width={20} height={20} />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#64748B]">Regulated NBFC Partner</span>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    )
}
