"use client"

export const dynamic = "force-dynamic";

import * as React from "react"
import { addMonths, format, isBefore, isSameDay, setDate, startOfDay } from "date-fns"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  Bell,
  CreditCard,
  DollarSign,
  User,
  LogOut,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  ArrowUpRight,
  Clock,
  Calendar,
  Wallet,
  ArrowDownLeft,
  Settings,
  Shield
} from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardTitle,
} from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

// Constants
const INTEREST_RATE = 0.16 // 16% per annum
const PENALTY_AMOUNT = 300
const MONTHLY_RATE = INTEREST_RATE / 12
const TODAY = new Date(2025, 11, 18) // Dec 18, 2025

export default function Dashboard() {
  const [loanAmount] = React.useState([50000]) // Default 50k
  const [tenure] = React.useState([12]) // Default 12 months
  const [simulateMonthsPassed, setSimulateMonthsPassed] = React.useState([0])

  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/login")
  }

  const n = tenure[0]
  const principal = loanAmount[0]

  const emi = React.useMemo(() => {
    if (principal === 0) return 0
    const exactEMI = (principal * MONTHLY_RATE * Math.pow(1 + MONTHLY_RATE, n)) / (Math.pow(1 + MONTHLY_RATE, n) - 1)
    return exactEMI
  }, [principal, n])

  const totalRepayment = emi * n
  const totalInterest = totalRepayment - principal

  // Generate Schedule
  const schedule = React.useMemo(() => {
    const installments = []
    let balance = principal
    const effectiveStartDate = addMonths(TODAY, -simulateMonthsPassed[0])

    for (let i = 1; i <= n; i++) {
      let dueDate = addMonths(effectiveStartDate, i)
      dueDate = setDate(dueDate, 18)
      const interestComponent = balance * MONTHLY_RATE
      const principalComponent = emi - interestComponent
      balance -= principalComponent

      let status: "Paid" | "Pending" | "Overdue" = "Pending"
      let penalty = 0

      if (isBefore(dueDate, startOfDay(TODAY))) {
        if (i === simulateMonthsPassed[0]) {
          status = "Overdue"
          penalty = PENALTY_AMOUNT
        } else {
          status = "Paid"
        }
      } else if (isSameDay(dueDate, startOfDay(TODAY))) {
        status = "Pending"
      } else {
        status = "Pending"
      }

      installments.push({
        installment: i,
        dueDate,
        amount: emi,
        status,
        penalty
      })
    }
    return installments
  }, [principal, emi, n, simulateMonthsPassed])

  const paidInstallments = schedule.filter(s => s.status === 'Paid').length
  const progressPercent = (paidInstallments / n) * 100
  const outstandingAmount = totalRepayment - (paidInstallments * emi)

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 font-sans selection:bg-emerald-500/20">
      {/* Mesh Background Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[150px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.05] bg-[#020617]/70 backdrop-blur-2xl">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group hover:rotate-6 transition-transform">
              <div className="relative h-6 w-6">
                <Image src="/logo.png" alt="Mslice Logo" fill className="object-contain invert brightness-0" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight uppercase">Mslice</span>
              <Badge className="bg-white/5 text-slate-500 border-white/10 font-black text-[9px] h-5">VAULT</Badge>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-1.5 text-[10px] font-black text-slate-600 uppercase tracking-widest">
              <Shield className="h-3 w-3 text-emerald-500" /> Secure Encryption Active
            </div>
            <div className="h-4 w-px bg-white/10 hidden lg:block" />
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/5 relative h-10 w-10 rounded-xl">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-emerald-500 rounded-full ring-2 ring-[#020617]" />
              </Button>
              <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:border-emerald-500/50 transition-colors cursor-pointer group">
                <User className="h-5 w-5 text-slate-500 group-hover:text-white" />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="h-10 w-10 rounded-xl text-slate-600 hover:text-red-400 hover:bg-white/5"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 relative z-10 max-w-7xl">
        {/* User Hero */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-emerald-400 border-emerald-500/20 bg-emerald-500/10 px-3 h-6 font-black text-[9px] uppercase tracking-tighter">
                Silver Tier Member
              </Badge>
              <span className="text-slate-700 text-xs font-bold">• Account Verified</span>
            </div>
            <h2 className="text-5xl font-black tracking-tight leading-none">Dashboard</h2>
            <p className="text-slate-500 text-lg font-medium">Monitoring your slice MS-82910-X</p>
          </div>

          <div className="flex gap-4">
            <Button className="bg-[#f8fafc] hover:bg-white text-slate-950 font-black h-14 px-8 rounded-2xl shadow-xl transition-all hover:scale-[1.02] border-0">
              <Wallet className="mr-3 h-5 w-5" /> Make a Payment
            </Button>
            <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold h-14 w-14 rounded-2xl p-0">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Primary Content */}
          <div className="lg:col-span-8 space-y-10">

            {/* Financial Summary Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { label: "Principal", val: `₹${principal.toLocaleString()}`, icon: Wallet, color: "text-emerald-400" },
                { label: "Total Interest", val: `₹${Math.round(totalInterest).toLocaleString()}`, icon: TrendingUp, color: "text-blue-400" },
                { label: "Total Repayable", val: `₹${Math.round(totalRepayment).toLocaleString()}`, icon: DollarSign, color: "text-slate-400" }
              ].map((stat, i) => (
                <Card key={i} className="bg-white/[0.02] border-white/[0.05] rounded-[2rem] hover:bg-white/[0.04] transition-all group border-t-emerald-500/10">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className={cn("h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center", stat.color)}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                      <div className="h-10 w-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowUpRight className="h-5 w-5 text-slate-700" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">{stat.label}</p>
                      <div className="text-3xl font-black text-white">{stat.val}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Progress Detail */}
            <Card className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border-white/[0.06] rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border-t-emerald-500/20">
              <CardContent className="p-10 space-y-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black uppercase tracking-tight">Active Plan</h3>
                    <p className="text-slate-500 font-bold">Progress Tracking & Liquidation</p>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-0 h-10 px-6 rounded-xl font-black text-xs uppercase tracking-widest">
                    16% Fixed APR
                  </Badge>
                </div>

                <div className="space-y-8">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Outstanding</p>
                      <div className="text-5xl font-black text-white">₹{Math.round(outstandingAmount).toLocaleString()}</div>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Paid so far</p>
                      <div className="text-2xl font-black text-emerald-400">₹{(paidInstallments * emi).toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="h-6 w-full bg-white/[0.03] rounded-2xl overflow-hidden p-1.5 border border-white/5 shadow-inner">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-teal-400 rounded-full relative"
                      >
                        <div className="absolute top-0 right-0 h-full w-24 bg-white/20 blur-md pointer-events-none" />
                      </motion.div>
                    </div>
                    <div className="flex justify-between text-[11px] font-black tracking-widest uppercase text-slate-500">
                      <span>Start Date: {format(addMonths(TODAY, -simulateMonthsPassed[0]), "MMM 2025")}</span>
                      <span className="text-emerald-500">{paidInstallments} / {n} Instalments</span>
                      <span>Maturity: {format(addMonths(TODAY, n - simulateMonthsPassed[0]), "MMM 2026")}</span>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 pt-4">
                  <div className="p-8 bg-white/[0.04] border border-white/[0.05] rounded-[2rem] flex items-center justify-between group">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Next Due</p>
                          <p className="text-xl font-black text-white">{format(schedule.find(s => s.status !== 'Paid')?.dueDate || TODAY, "MMM dd, yyyy")}</p>
                        </div>
                      </div>
                      <p className="text-[10px] font-bold text-slate-500 italic">&quot;Keep paying on time to grow your MSCORE.&quot;</p>
                    </div>
                  </div>
                  <div className="p-8 bg-white/[0.04] border border-white/[0.05] rounded-[2rem] flex items-center justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Monthly EMI</p>
                          <p className="text-xl font-black text-white">₹{Math.round(emi).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge className="bg-blue-500/10 text-blue-400 border-0 text-[10px] font-black">AUTO-DEBIT</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transaction Ledger */}
            <div className="space-y-8">
              <div className="flex justify-between items-center px-4">
                <div className="space-y-1">
                  <h3 className="text-3xl font-black tracking-tight">Ledger</h3>
                  <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Verification Logs & History</p>
                </div>
                <Button variant="ghost" className="text-emerald-400 font-black h-12 hover:bg-emerald-500/10 px-6 rounded-xl">
                  Audit Log <ArrowDownLeft className="ml-2 h-5 w-5" />
                </Button>
              </div>

              <Card className="bg-white/[0.02] border-white/[0.06] rounded-[2.5rem] overflow-hidden">
                <Table>
                  <TableHeader className="bg-white/[0.03] border-b border-white/[0.04]">
                    <TableRow className="border-0 h-16 pointer-events-none">
                      <TableHead className="px-10 font-black text-slate-600 uppercase text-[10px] tracking-widest">Index</TableHead>
                      <TableHead className="font-black text-slate-600 uppercase text-[10px] tracking-widest">Due Date</TableHead>
                      <TableHead className="font-black text-slate-600 uppercase text-[10px] tracking-widest text-right">Amount</TableHead>
                      <TableHead className="font-black text-slate-600 uppercase text-[10px] tracking-widest text-center">Verification</TableHead>
                      <TableHead className="px-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schedule.map((row) => (
                      <TableRow key={row.installment} className="h-20 border-white/[0.03] hover:bg-white/[0.03] transition-colors group">
                        <TableCell className="px-10 font-black text-slate-500">#{String(row.installment).padStart(2, '0')}</TableCell>
                        <TableCell className="font-black text-white">
                          {format(row.dueDate, "MMM dd, yyyy")}
                          {isSameDay(row.dueDate, TODAY) && <Badge className="ml-3 bg-blue-500/20 text-blue-400 border-0 h-5 px-3 text-[9px] font-black">ACTIVE</Badge>}
                        </TableCell>
                        <TableCell className="text-right font-black text-slate-100">₹{Math.round(row.amount).toLocaleString()}</TableCell>
                        <TableCell className="text-center">
                          <Badge className={cn(
                            "font-black uppercase text-[9px] tracking-widest px-4 h-7 border-0",
                            row.status === 'Paid' ? "bg-emerald-500/10 text-emerald-400" :
                              row.status === 'Overdue' ? "bg-red-500/10 text-red-500" :
                                "bg-white/5 text-slate-600"
                          )}>
                            {row.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-10 text-right">
                          <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer hover:bg-emerald-500 hover:text-[#020617] ml-auto">
                            <ChevronRight className="h-5 w-5" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          </div>

          {/* Sidebar Modules */}
          <div className="lg:col-span-4 space-y-10">
            {/* Profile Card */}
            <Card className="bg-white/[0.03] border-white/[0.06] rounded-[2.5rem] p-10 space-y-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-[40px] -mr-16 -mt-16" />

              <div className="flex justify-between items-start relative z-10">
                <div className="h-16 w-16 rounded-[1.5rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
                  <User className="h-8 w-8" />
                </div>
                <Badge className="bg-white/10 text-slate-400 font-black px-4 rounded-xl border-0 h-8">PROFILE</Badge>
              </div>

              <div className="space-y-2 relative z-10">
                <h3 className="text-2xl font-black">Sumit Kumar</h3>
                <p className="text-slate-500 font-bold text-sm">Linked HDFC Account (****4920)</p>
              </div>

              <div className="space-y-4">
                {[
                  { label: "Credit Shield", val: "ACTIVE", icon: ShieldCheck, color: "text-emerald-500" },
                  { label: "Internal Score", val: "842 / 900", icon: TrendingUp, color: "text-blue-500" },
                  { label: "Maturity Date", val: "Dec 2026", icon: Calendar, color: "text-slate-500" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-[1.5rem] group hover:bg-white/[0.04] transition-all">
                    <div className="flex items-center gap-3">
                      <item.icon className={cn("h-4 w-4 opacity-70", item.color)} />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.label}</span>
                    </div>
                    <span className="text-xs font-black text-white">{item.val}</span>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full h-14 border-white/10 bg-white/5 hover:bg-white/10 font-black rounded-2xl text-slate-400">
                View Digital Contract
              </Button>
            </Card>

            {/* Simulation Card (Demo Purpose) */}
            <Card className="bg-white/[0.01] border-white/[0.04] border-dashed rounded-[2rem] p-8 space-y-6">
              <div className="flex items-center gap-4">
                <Clock className="h-6 w-6 text-slate-600" />
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">History Simulator</span>
              </div>
              <div className="space-y-6">
                <Slider
                  value={simulateMonthsPassed}
                  onValueChange={setSimulateMonthsPassed}
                  max={n}
                  step={1}
                  className="[&_[role=slider]]:bg-emerald-500"
                />
                <div className="flex justify-between items-center bg-[#020617] p-4 rounded-2xl border border-white/5">
                  <span className="text-xs font-black text-slate-500">Months Passed</span>
                  <span className="text-xl font-black text-emerald-400">{simulateMonthsPassed[0]}</span>
                </div>
              </div>
            </Card>

            {/* Support Module */}
            <Card className="bg-emerald-600 rounded-[2.5rem] p-10 space-y-6 relative overflow-hidden shadow-2xl shadow-emerald-900/40 group">
              <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-white/10 rounded-full -mr-20 -mt-20 blur-[50px] group-hover:scale-110 transition-transform duration-700" />
              <div className="relative z-10 space-y-6">
                <div className="space-y-3">
                  <h3 className="text-2xl font-black text-white leading-tight">Elite Concierge Support</h3>
                  <p className="text-emerald-100/70 text-sm font-bold leading-relaxed">Tailored assistance for your financial architecture.</p>
                </div>
                <Button className="w-full bg-[#020617] text-white hover:bg-slate-900 h-16 rounded-2xl font-black border-0 shadow-lg">
                  Connect with Agent
                </Button>
              </div>
            </Card>

            {/* Version/Security Info */}
            <div className="text-center space-y-4 pt-4 pb-12">
              <div className="flex items-center justify-center gap-2 text-slate-700 font-black text-[9px] uppercase tracking-widest">
                <Shield className="h-3 w-3" /> E2E INSTANCE: 92.10.8A
              </div>
              <p className="text-[10px] text-slate-800 font-bold max-w-[200px] mx-auto italic">
                &quot;All communications within Mslice Vault are monitored for your security.&quot;
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Spacer for Mobile Nav if needed */}
      <div className="h-24 md:hidden" />
    </div>
  )
}
