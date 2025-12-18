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

  const calculatedEmi = React.useMemo(() => {
    if (principal === 0) return 0
    const exactEMI = (principal * MONTHLY_RATE * Math.pow(1 + MONTHLY_RATE, n)) / (Math.pow(1 + MONTHLY_RATE, n) - 1)
    return exactEMI
  }, [principal, n])

  const totalRepayment = calculatedEmi * n
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
      const principalComponent = calculatedEmi - interestComponent
      balance -= principalComponent

      let status: "Paid" | "Pending" | "Overdue" = "Pending"
      let penalty = 0

      if (isBefore(dueDate, startOfDay(TODAY))) {
        if (i === simulateMonthsPassed[0]) {
          status = "Overdue"
          status = "Overdue"
          penalty = PENALTY_AMOUNT
        } else {
          status = "Paid"
        }
      } else {
        status = "Pending"
      }

      installments.push({
        installment: i,
        dueDate,
        amount: calculatedEmi,
        status,
        penalty
      })
    }
    return installments
  }, [principal, calculatedEmi, n, simulateMonthsPassed])

  const paidInstallments = schedule.filter(s => s.status === 'Paid').length
  const progressPercent = (paidInstallments / n) * 100
  const outstandingAmount = totalRepayment - (paidInstallments * calculatedEmi)

  return (
    <div className="min-h-screen bg-[#020617] text-[#F8FAFC] font-sans selection:bg-emerald-500/20">
      {/* Institutional Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-[#0F172A] bg-[#020617]/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-[#10B981] rounded-lg flex items-center justify-center p-1.5 shadow-lg shadow-[#10B981]/20 group hover:rotate-6 transition-transform">
              <Image src="/logo.png" alt="Mslice Logo" width={24} height={24} className="invert brightness-0" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[18px] font-bold tracking-tight text-[#F8FAFC]">Mslice</span>
              <Badge className="bg-[#10B981]/20 text-[#10B981] border-0 text-[10px] h-5 font-semibold tracking-wider">VAULT</Badge>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-2 text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4 text-[#10B981]" /> Secure Verification Active
            </div>
            <div className="h-4 w-px bg-[#0F172A] hidden lg:block" />
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#F8FAFC]/5 h-9 w-9 rounded-xl relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-1.5 w-1.5 bg-[#10B981] rounded-full" />
              </Button>
              <div className="h-9 w-9 bg-[#0F172A] rounded-xl flex items-center justify-center border border-[#0F172A] hover:border-[#10B981]/50 cursor-pointer shadow-sm group">
                <User className="h-4 w-4 text-[#64748B] group-hover:text-[#F8FAFC]" />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="h-9 w-9 text-[#64748B] hover:text-[#EF4444] rounded-xl"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 relative z-10 max-w-7xl">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="px-3 py-1 text-[12px] font-semibold tracking-[0.04em] rounded-full border-[#10B981]/20 bg-[#10B981]/10 text-[#10B981] uppercase">
                Silver Tier Member
              </Badge>
              <span className="text-[#64748B] text-[12px] font-semibold uppercase tracking-wider">• Verified Instance</span>
            </div>
            <h1 className="text-[40px] leading-[1.2] font-semibold text-[#F8FAFC]">Dashboard</h1>
            <p className="text-[16px] leading-[1.6] font-normal text-[#94A3B8]">Monitoring active slice MS-82910-X</p>
          </div>

          <div className="flex gap-4">
            <Button className="bg-[#F8FAFC] hover:bg-white text-[#020617] text-[14px] font-semibold h-12 px-8 rounded-xl border-0 shadow-xl transition-all hover:scale-[1.02]">
              <Wallet className="mr-2 h-4 w-4" /> Make a Payment
            </Button>
            <Button variant="ghost" className="h-12 w-12 border border-[#0F172A] text-[#F8FAFC] hover:bg-[#F8FAFC]/5 rounded-xl p-0">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { label: "Principal", val: `₹${principal.toLocaleString()}`, icon: Wallet, color: "text-[#10B981]" },
                { label: "Total Interest", val: `₹${Math.round(totalInterest).toLocaleString()}`, icon: TrendingUp, color: "text-[#10B981]" },
                { label: "Total Repayable", val: `₹${Math.round(totalRepayment).toLocaleString()}`, icon: DollarSign, color: "text-[#94A3B8]" }
              ].map((stat, i) => (
                <Card key={i} className="border-[#0F172A] bg-[#020617] rounded-3xl p-8 space-y-6 hover:bg-[#F8FAFC]/[0.02] transition-colors group">
                  <div className="flex items-center justify-between">
                    <div className={cn("h-10 w-10 rounded-xl bg-[#0F172A] flex items-center justify-center border border-[#0F172A]", stat.color)}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-[#64748B] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[#94A3B8]">{stat.label}</p>
                    <div className="text-[24px] font-semibold text-[#F8FAFC]">{stat.val}</div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Progress Card */}
            <Card className="border-[#0F172A] bg-[#020617] rounded-[2.5rem] p-10 space-y-12">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h3 className="text-[24px] leading-[1.3] font-semibold text-[#F8FAFC]">Active Plan</h3>
                  <p className="text-[14px] leading-[1.6] font-normal text-[#94A3B8]">Liquidation Progress & Real-time Tracking</p>
                </div>
                <Badge className="bg-[#10B981]/10 text-[#10B981] border-0 h-8 px-4 rounded-lg font-bold text-[12px] uppercase tracking-wider">
                  16% Fixed APR
                </Badge>
              </div>

              <div className="space-y-8">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[#94A3B8]">Outstanding</p>
                    <div className="text-[40px] leading-[1.2] font-semibold text-[#F8FAFC]">₹{Math.round(outstandingAmount).toLocaleString()}</div>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[#94A3B8]">Paid to date</p>
                    <div className="text-[20px] font-semibold text-[#10B981]">₹{(paidInstallments * calculatedEmi).toLocaleString()}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="h-2 w-full bg-[#0F172A] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-[#10B981] rounded-full"
                    />
                  </div>
                  <div className="flex justify-between text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
                    <span>{paidInstallments} / {n} Slices</span>
                    <span>{Math.round(progressPercent)}% Fulfilled</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 pt-6 pt-4 border-t border-[#0F172A]">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 text-[#64748B] flex items-center justify-center">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-widest">Next Due Date</p>
                    <p className="text-[18px] font-semibold text-[#F8FAFC]">{format(schedule.find(s => s.status !== 'Paid')?.dueDate || TODAY, "MMM dd, yyyy")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 text-[#64748B] flex items-center justify-center">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-widest">Monthly EMI</p>
                    <p className="text-[18px] font-semibold text-[#F8FAFC]">₹{Math.round(calculatedEmi).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Ledger Table */}
            <div className="space-y-8">
              <div className="flex justify-between items-center px-4">
                <div className="space-y-1">
                  <h3 className="text-[24px] leading-[1.3] font-semibold text-[#F8FAFC]">Ledger</h3>
                  <p className="text-[14px] leading-[1.6] font-normal text-[#94A3B8]">Verification Registry & History</p>
                </div>
                <Button variant="ghost" className="text-[#10B981] text-[14px] font-semibold h-10 hover:bg-[#10B981]/10 px-4 rounded-lg">
                  Audit Log <ArrowDownLeft className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <Card className="border-[#0F172A] bg-[#020617] rounded-3xl overflow-hidden overflow-hidden">
                <Table>
                  <TableHeader className="bg-[#F8FAFC]/[0.02] border-b border-[#0F172A]">
                    <TableRow className="h-14 border-0">
                      <TableHead className="px-8 text-[12px] font-bold text-[#64748B] uppercase tracking-widest">Index</TableHead>
                      <TableHead className="text-[12px] font-bold text-[#64748B] uppercase tracking-widest">Due Date</TableHead>
                      <TableHead className="text-right text-[12px] font-bold text-[#64748B] uppercase tracking-widest">Amount</TableHead>
                      <TableHead className="text-center text-[12px] font-bold text-[#64748B] uppercase tracking-widest">Status</TableHead>
                      <TableHead className="px-8"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schedule.map((row) => (
                      <TableRow key={row.installment} className="h-16 border-[#0F172A] hover:bg-[#F8FAFC]/[0.01] group">
                        <TableCell className="px-8 font-semibold text-[#64748B]">#{String(row.installment).padStart(2, '0')}</TableCell>
                        <TableCell className="font-semibold text-[#F8FAFC]">
                          {format(row.dueDate, "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-[#CBD5E1]">₹{Math.round(row.amount).toLocaleString()}</TableCell>
                        <TableCell className="text-center">
                          <Badge className={cn(
                            "text-[10px] font-bold uppercase tracking-widest px-3 h-6 border-0",
                            row.status === 'Paid' ? "bg-[#10B981]/20 text-[#10B981]" :
                              row.status === 'Overdue' ? "bg-[#EF4444]/20 text-[#EF4444]" :
                                "bg-[#0F172A] text-[#64748B]"
                          )}>
                            {row.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-8 text-right">
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-[#64748B] hover:text-[#F8FAFC] opacity-0 group-hover:opacity-100 transition-all">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-10">
            {/* Account Card */}
            <Card className="border-[#0F172A] bg-[#020617] rounded-[2.5rem] p-8 space-y-8 bg-gradient-to-b from-[#0F172A]/20 to-transparent">
              <div className="flex justify-between items-start">
                <div className="h-14 w-14 rounded-2xl bg-[#10B981]/10 flex items-center justify-center text-[#10B981] border border-[#10B981]/20">
                  <User className="h-7 w-7" />
                </div>
                <Badge className="bg-[#0F172A] text-[#64748B] font-bold text-[10px] uppercase tracking-widest px-3 h-6">PROFILE</Badge>
              </div>

              <div className="space-y-1">
                <h3 className="text-[20px] font-semibold text-[#F8FAFC]">Sumit Kumar</h3>
                <p className="text-[14px] font-normal text-[#94A3B8]">Linked HDFC Key (****4920)</p>
              </div>

              <div className="space-y-4">
                {[
                  { label: "Internal Score", val: "842 / 900", icon: TrendingUp, color: "text-[#10B981]" },
                  { label: "Maturity Date", val: "Dec 2026", icon: Calendar, color: "text-[#94A3B8]" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-[#0F172A]/20 border border-[#0F172A] rounded-2xl">
                    <div className="flex items-center gap-3">
                      <item.icon className={cn("h-4 w-4", item.color)} />
                      <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">{item.label}</span>
                    </div>
                    <span className="text-[14px] font-bold text-[#F8FAFC]">{item.val}</span>
                  </div>
                ))}
              </div>

              <Button variant="ghost" className="w-full h-12 text-[14px] font-semibold text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#F8FAFC]/5 rounded-xl border border-[#0F172A]">
                Verification Records
              </Button>
            </Card>

            {/* Sim Card */}
            <Card className="border-[#0F172A] border-dashed bg-[#020617] rounded-3xl p-8 space-y-8">
              <div className="flex items-center gap-4">
                <Clock className="h-4 w-4 text-[#64748B]" />
                <span className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.2em]">History Simulator</span>
              </div>
              <div className="space-y-8">
                <Slider
                  value={simulateMonthsPassed}
                  onValueChange={setSimulateMonthsPassed}
                  max={n}
                  step={1}
                  className="[&_[role=slider]]:bg-[#10B981] focus:ring-0"
                />
                <div className="flex justify-between items-center bg-[#0F172A]/30 p-4 rounded-2xl border border-[#0F172A]">
                  <span className="text-[12px] font-bold text-[#94A3B8] uppercase">Slice Progression</span>
                  <span className="text-[20px] font-bold text-[#10B981]">{simulateMonthsPassed[0]}</span>
                </div>
              </div>
            </Card>

            {/* Support Support */}
            <Card className="bg-[#10B981] text-[#020617] rounded-[2.5rem] p-10 space-y-6 shadow-2xl shadow-[#10B981]/20">
              <h3 className="text-[24px] leading-[1.3] font-bold">Protocol Concierge</h3>
              <p className="text-[14px] font-semibold leading-[1.6] opacity-80">Direct terminal for institutional financial coordination.</p>
              <Button className="w-full bg-[#020617] text-[#F8FAFC] hover:bg-[#020617]/90 h-14 rounded-2xl font-bold text-[14px] border-0">
                Negotiate Terms
              </Button>
            </Card>

            {/* Security Note */}
            <div className="text-center pt-8 border-t border-[#0F172A]">
              <div className="flex items-center justify-center gap-2 text-[#64748B] font-bold text-[10px] uppercase tracking-widest mb-2">
                <Shield className="h-3 w-3" /> E2E KEY: 92.10.8A.ALPHA
              </div>
              <p className="text-[12px] text-[#64748B] font-normal italic">
                &quot;Registry transmissions are encrypted and logged.&quot;
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Nav Spacer */}
      <div className="h-12 md:hidden" />
    </div>
  )
}
