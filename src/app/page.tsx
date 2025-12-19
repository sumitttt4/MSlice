"use client"

export const dynamic = "force-dynamic";

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
    Clock,
    CheckCircle,
    FileText,
    Wallet,
    Shield,
    ArrowRight,
    Menu,
    X
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"

export default function LandingPage() {
    const router = useRouter()
    const [loanAmount, setLoanAmount] = React.useState([15000])
    const [tenure, setTenure] = React.useState([12])
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

    const MONTHLY_RATE = 0.16 // 16% per month
    const monthlyRate = MONTHLY_RATE

    const emi = React.useMemo(() => {
        const p = loanAmount[0]
        const n = tenure[0]
        if (p === 0) return 0
        return (p * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
    }, [loanAmount, tenure, monthlyRate])

    const totalPayment = emi * tenure[0]
    const totalInterest = totalPayment - loanAmount[0]

    const faqs = [
        {
            q: "What documents do I need?",
            a: "Just your PAN card and Aadhaar. We verify everything digitally — no paperwork required."
        },
        {
            q: "How long does approval take?",
            a: "Most applications receive a decision within 60 seconds. Funds are transferred within 24 hours of approval."
        },
        {
            q: "What if I miss a payment?",
            a: "We'll send you reminders before your due date. If you miss a payment, a late fee of ₹300 applies. Contact us early if you're facing difficulties."
        },
        {
            q: "Can I prepay my loan?",
            a: "Yes, you can prepay anytime with zero prepayment charges. Pay off your loan early and save on interest."
        },
        {
            q: "Is my data safe?",
            a: "Absolutely. We use 256-bit encryption and never share your data with third parties without consent."
        }
    ]

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Navigation */}
            <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-[#0a0a0a]/90 backdrop-blur-sm">
                <nav className="container max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">M</span>
                        </div>
                        <span className="font-semibold text-lg text-white">Mslice</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="#features" className="text-sm text-zinc-400 hover:text-white transition-colors">Features</Link>
                        <Link href="#how-it-works" className="text-sm text-zinc-400 hover:text-white transition-colors">How it Works</Link>
                        <Link href="#faq" className="text-sm text-zinc-400 hover:text-white transition-colors">FAQ</Link>
                    </div>

                    <div className="flex items-center gap-3">
                        <a href="#calculator">
                            <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">Apply Now</Button>
                        </a>
                        <button className="md:hidden p-2 text-zinc-400" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </nav>

                {mobileMenuOpen && (
                    <div className="md:hidden bg-zinc-900 border-t border-zinc-800 p-4 space-y-3">
                        <Link href="#features" className="block text-sm text-zinc-300 py-2" onClick={() => setMobileMenuOpen(false)}>Features</Link>
                        <Link href="#how-it-works" className="block text-sm text-zinc-300 py-2" onClick={() => setMobileMenuOpen(false)}>How it Works</Link>
                        <Link href="#faq" className="block text-sm text-zinc-300 py-2" onClick={() => setMobileMenuOpen(false)}>FAQ</Link>
                        <a href="#calculator" className="block text-sm text-emerald-400 py-2 font-medium" onClick={() => setMobileMenuOpen(false)}>Apply Now</a>
                    </div>
                )}
            </header>

            {/* Hero Section */}
            <section id="calculator" className="py-12 sm:py-16 lg:py-24">
                <div className="container max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
                        {/* Left: Content */}
                        <div className="space-y-6 sm:space-y-8">
                            <div className="space-y-4">
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]">
                                    Quick loans up to<br />
                                    <span className="text-emerald-500">₹30,000</span>
                                </h1>
                                <p className="text-base sm:text-lg text-zinc-400 max-w-md">
                                    Fixed 16% APR. No hidden fees. Get approved in 60 seconds.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3 sm:gap-4">
                                <div className="flex items-center gap-2 text-sm text-zinc-400">
                                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                                    <span>No collateral</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-zinc-400">
                                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                                    <span>Instant approval</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-zinc-400">
                                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                                    <span>Zero prepayment fee</span>
                                </div>
                            </div>

                            {/* Trust Badges */}
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                <Badge className="bg-zinc-800 text-zinc-300 border-0 text-xs">
                                    <Shield className="h-3 w-3 mr-1" /> RBI Registered
                                </Badge>
                                <Badge className="bg-zinc-800 text-zinc-300 border-0 text-xs">256-bit Encryption</Badge>
                                <Badge className="bg-zinc-800 text-zinc-300 border-0 text-xs">4.8★ Rating</Badge>
                            </div>
                        </div>

                        {/* Right: Calculator */}
                        <Card className="bg-[#111111] border-zinc-800">
                            <CardContent className="p-5 sm:p-6 lg:p-8 space-y-6">
                                {/* Amount Slider */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-baseline">
                                        <label className="text-sm font-medium text-zinc-300">Loan Amount</label>
                                        <span className="text-xl sm:text-2xl font-bold text-white">₹{loanAmount[0].toLocaleString()}</span>
                                    </div>
                                    <div className="relative py-2">
                                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2 bg-zinc-700 rounded-full" />
                                        <Slider
                                            value={loanAmount}
                                            onValueChange={setLoanAmount}
                                            min={1000}
                                            max={30000}
                                            step={1000}
                                            className="relative [&_[role=slider]]:bg-emerald-500 [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&_[role=slider]]:shadow-lg [&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:cursor-grab"
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs text-zinc-500">
                                        <span>₹1,000</span>
                                        <span>₹30,000</span>
                                    </div>
                                </div>

                                {/* Tenure Slider */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-baseline">
                                        <label className="text-sm font-medium text-zinc-300">Repayment Period</label>
                                        <span className="text-xl sm:text-2xl font-bold text-white">{tenure[0]} <span className="text-sm font-normal text-zinc-500">months</span></span>
                                    </div>
                                    <div className="relative py-2">
                                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2 bg-zinc-700 rounded-full" />
                                        <Slider
                                            value={tenure}
                                            onValueChange={setTenure}
                                            min={3}
                                            max={36}
                                            step={3}
                                            className="relative [&_[role=slider]]:bg-emerald-500 [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&_[role=slider]]:shadow-lg [&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:cursor-grab"
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs text-zinc-500">
                                        <span>3 months</span>
                                        <span>36 months</span>
                                    </div>
                                </div>

                                <Separator className="bg-zinc-800" />

                                {/* EMI Display */}
                                <div className="bg-zinc-900 rounded-xl p-4 sm:p-5 text-center space-y-3">
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-medium">16% Interest Rate</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-zinc-400 mb-1">Monthly EMI</p>
                                        <p className="text-3xl sm:text-4xl font-bold text-white">
                                            ₹{Math.round(emi).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Breakdown */}
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400">Principal</span>
                                        <span className="font-medium text-white">₹{loanAmount[0].toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400">Total Interest</span>
                                        <span className="font-medium text-white">₹{Math.round(totalInterest).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t border-zinc-800">
                                        <span className="text-zinc-300 font-medium">Total Repayment</span>
                                        <span className="font-bold text-white">₹{Math.round(totalPayment).toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* CTA */}
                                <Button
                                    className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-base"
                                    onClick={() => router.push(`/apply?amount=${loanAmount[0]}&tenure=${tenure[0]}`)}
                                >
                                    Check Eligibility <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>

                                <p className="text-xs text-center text-zinc-500">
                                    Soft credit check. Won't affect your score.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-16 sm:py-20 lg:py-24 bg-zinc-900/50 border-y border-zinc-800">
                <div className="container max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-10 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">How it works</h2>
                        <p className="text-zinc-400 max-w-lg mx-auto text-sm sm:text-base">Get funded in three simple steps. No paperwork, no branch visits.</p>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
                        {[
                            { step: "01", icon: FileText, title: "Apply online", desc: "Complete our form in 2 minutes. Just PAN and Aadhaar." },
                            { step: "02", icon: Clock, title: "Get instant decision", desc: "Our AI evaluates your profile in 60 seconds." },
                            { step: "03", icon: Wallet, title: "Receive funds", desc: "Money transferred to your bank within 24 hours." }
                        ].map((item, i) => (
                            <div key={i} className="text-center space-y-3 sm:space-y-4">
                                <div className="inline-flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-emerald-500/10 text-emerald-500">
                                    <item.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                                <div className="space-y-1 sm:space-y-2">
                                    <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Step {item.step}</p>
                                    <h3 className="text-lg sm:text-xl font-semibold text-white">{item.title}</h3>
                                    <p className="text-zinc-400 text-sm">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="py-16 sm:py-20 lg:py-24">
                <div className="container max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-10 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">Why choose Mslice</h2>
                        <p className="text-zinc-400 max-w-lg mx-auto text-sm sm:text-base">Transparent pricing, instant decisions, flexible terms.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                        {[
                            { title: "Fixed 16% APR", desc: "What you see is what you pay. No hidden fees.", highlight: "16%" },
                            { title: "Zero prepayment charges", desc: "Pay off early and save on interest.", highlight: "₹0" },
                            { title: "60-second approval", desc: "AI-powered instant decisions.", highlight: "60s" },
                            { title: "Flexible tenure", desc: "Choose 3 to 36 months repayment.", highlight: "3-36" }
                        ].map((item, i) => (
                            <Card key={i} className="bg-zinc-900/50 border-zinc-800">
                                <CardContent className="p-5 sm:p-6 flex gap-4">
                                    <div className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                        <span className="text-sm sm:text-base font-bold text-emerald-500">{item.highlight}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                                        <p className="text-sm text-zinc-400">{item.desc}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="py-16 sm:py-20 lg:py-24 bg-zinc-900/50 border-y border-zinc-800">
                <div className="container max-w-3xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-8 sm:mb-10">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">FAQ</h2>
                        <p className="text-zinc-400 text-sm sm:text-base">Everything you need to know.</p>
                    </div>

                    <Accordion type="single" collapsible className="space-y-2 sm:space-y-3">
                        {faqs.map((faq, i) => (
                            <AccordionItem
                                key={i}
                                value={`item-${i}`}
                                className="border border-zinc-800 rounded-xl px-4 sm:px-6 bg-zinc-900/30"
                            >
                                <AccordionTrigger className="text-left font-medium text-white hover:no-underline text-sm sm:text-base py-4">
                                    {faq.q}
                                </AccordionTrigger>
                                <AccordionContent className="text-zinc-400 text-sm pb-4">
                                    {faq.a}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 sm:py-20 lg:py-24">
                <div className="container max-w-6xl mx-auto px-4 sm:px-6">
                    <Card className="bg-emerald-500/10 border-emerald-500/20">
                        <CardContent className="p-8 sm:p-12 lg:p-16 text-center space-y-4 sm:space-y-6">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Ready to get started?</h2>
                            <p className="text-zinc-400 max-w-md mx-auto text-sm sm:text-base">Apply in 2 minutes. Get a decision in 60 seconds.</p>
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2">
                                <Link href="/apply?amount=15000&tenure=12">
                                    <Button size="lg" className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-8">
                                        Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                                <Link href="#how-it-works">
                                    <Button size="lg" variant="outline" className="w-full sm:w-auto border-zinc-700 text-white hover:bg-zinc-800 px-8">
                                        Learn More
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-10 sm:py-12 border-t border-zinc-800">
                <div className="container max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                        <div className="sm:col-span-2">
                            <Link href="/" className="flex items-center gap-2 mb-4">
                                <div className="h-8 w-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">M</span>
                                </div>
                                <span className="font-semibold text-lg text-white">Mslice</span>
                            </Link>
                            <p className="text-sm text-zinc-400 max-w-xs mb-4">Simple, transparent personal loans for working professionals.</p>
                            <p className="text-xs text-zinc-500">© {new Date().getFullYear()} Mslice Financial Services.</p>
                        </div>

                        <div>
                            <h4 className="font-medium text-white mb-4">Product</h4>
                            <ul className="space-y-2 text-sm text-zinc-400">
                                <li><Link href="#features" className="hover:text-white">Features</Link></li>
                                <li><Link href="#how-it-works" className="hover:text-white">How it Works</Link></li>
                                <li><Link href="#faq" className="hover:text-white">FAQ</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-medium text-white mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-zinc-400">
                                <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
                                <li><Link href="#" className="hover:text-white">Terms of Service</Link></li>
                            </ul>
                        </div>
                    </div>

                    <Separator className="bg-zinc-800 mb-6" />

                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
                        <p>Powered by authorized NBFC partners registered with RBI</p>
                        <div className="flex items-center gap-4">
                            <span>🔒 256-bit SSL</span>
                            <span>🏛️ RBI Registered</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
