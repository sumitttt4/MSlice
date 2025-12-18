"use client"

import * as React from "react"
import { addMonths, format, isAfter, isBefore, isSameDay, setDate, startOfDay } from "date-fns"
import Image from "next/image"
import { Bell, CreditCard, DollarSign, LayoutDashboard, User, LogOut } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
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
  const [loanAmount, setLoanAmount] = React.useState([50000]) // Default 50k
  const [tenure, setTenure] = React.useState([12]) // Default 12 months
  const [simulateMonthsPassed, setSimulateMonthsPassed] = React.useState([0]) // For demoing overdue/paid status

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
    // EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
    const exactEMI = (principal * MONTHLY_RATE * Math.pow(1 + MONTHLY_RATE, n)) / (Math.pow(1 + MONTHLY_RATE, n) - 1)
    return exactEMI
  }, [principal, n])

  const totalRepayment = emi * n
  const totalInterest = totalRepayment - principal

  // Generate Schedule
  const schedule = React.useMemo(() => {
    const installments = []
    let balance = principal

    // Shift Start Date back by simulateMonthsPassed
    const effectiveStartDate = addMonths(TODAY, -simulateMonthsPassed[0])

    for (let i = 1; i <= n; i++) {
      // Due date: 18th of subsequent month relative to effectiveStartDate
      let dueDate = addMonths(effectiveStartDate, i)
      dueDate = setDate(dueDate, 18)

      // Calculate Interest for this month
      const interestComponent = balance * MONTHLY_RATE
      const principalComponent = emi - interestComponent
      balance -= principalComponent

      // Determine Status
      let status: "Paid" | "Pending" | "Overdue" = "Pending"
      let penalty = 0

      // Logic:
      // If dueDate is before TODAY (and assuming we simulate real life where past due = overdue/paid):
      // We'll mark the LAST past due payment as 'Overdue' for demo, and others as 'Paid'.
      if (isBefore(dueDate, startOfDay(TODAY))) {
        // For demo: make the most recent past due payment 'Overdue' to show the badge
        // and older ones 'Paid'.
        if (i === simulateMonthsPassed[0]) {
          status = "Overdue"
          penalty = PENALTY_AMOUNT
        } else {
          status = "Paid"
        }
      } else if (isSameDay(dueDate, startOfDay(TODAY))) {
        status = "Pending" // Due today
      } else {
        status = "Pending"
      }

      // Edge case: If simulateMonthsPassed is 0, all future -> all Pending.

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

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-8">
              <Image src="/logo.png" alt="Mslice Logo" fill className="object-contain" />
            </div>
            <span className="text-xl font-bold tracking-tight">Mslice</span>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background"></span>
            </Button>
            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center border hover:border-primary transition-colors cursor-pointer text-muted-foreground hover:text-foreground">
              <User className="h-4 w-4" />
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-destructive transition-colors">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8 space-y-8">

        {/* Welcome / Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your loans and repayment schedules.</p>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{Math.round(totalRepayment).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+2.1% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Payment Due</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {/* Next payment is the first 'Pending' or 'Overdue' one */}
                {format(schedule.find(s => s.status !== 'Paid')?.dueDate || addMonths(TODAY, 1), "MMM dd, yyyy")}
              </div>
              <p className="text-xs text-muted-foreground">Don&apos;t miss the date</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
              <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Current active schedule</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">

          {/* Calculator Section */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-primary/10 shadow-lg shadow-primary/5">
              <CardHeader>
                <CardTitle className="text-xl">Loan Calculator</CardTitle>
                <CardDescription>Select amount & tenure.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Amount Slider */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium leading-none">Loan Amount</label>
                    <span className="text-sm font-bold text-primary">₹{loanAmount[0].toLocaleString()}</span>
                  </div>
                  <Slider
                    value={loanAmount}
                    onValueChange={setLoanAmount}
                    min={1000}
                    max={100000}
                    step={1000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>₹1k</span>
                    <span>₹100k</span>
                  </div>
                </div>

                {/* Tenure Slider */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium leading-none">Tenure (Months)</label>
                    <span className="text-sm font-bold text-primary">{tenure[0]} Months</span>
                  </div>
                  <Slider
                    value={tenure}
                    onValueChange={setTenure}
                    min={1}
                    max={24}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1 Mo</span>
                    <span>24 Mo</span>
                  </div>
                </div>

                {/* Simulation Toggle */}
                <div className="pt-4 border-t border-border/50">
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Demo: Simulate Past Loan</label>
                    <span className="text-xs font-bold">{simulateMonthsPassed[0]} Months</span>
                  </div>
                  <Slider
                    value={simulateMonthsPassed}
                    onValueChange={setSimulateMonthsPassed}
                    min={0}
                    max={tenure[0] > 1 ? tenure[0] - 1 : 0}
                    step={1}
                    className="w-full opacity-75 hover:opacity-100 transition-opacity"
                  />
                  <p className="text-[10px] text-muted-foreground mt-2">Adjust to shift start date back and see overdue logic.</p>
                </div>

              </CardContent>
            </Card>

            {/* Real-time Stats Card */}
            <Card className="bg-primary text-primary-foreground border-none">
              <CardHeader>
                <CardTitle>Repayment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-primary-foreground/80 text-sm">Monthly EMI</span>
                  <span className="text-2xl font-bold">₹{Math.round(emi).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-primary-foreground/80">Total Interest</span>
                  <span className="font-semibold">₹{Math.round(totalInterest).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-primary-foreground/80">Total Repayment</span>
                  <span className="font-semibold">₹{Math.round(totalRepayment).toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Schedule Table */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>Payment Schedule</CardTitle>
                <CardDescription>
                  Your monthly repayment timeline. Penalties apply for overdue payments.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">#</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Penalty</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schedule.map((item) => (
                      <TableRow key={item.installment}>
                        <TableCell className="font-medium text-muted-foreground">{item.installment}</TableCell>
                        <TableCell>{format(item.dueDate, "MMM dd, yyyy")}</TableCell>
                        <TableCell>₹{Math.round(item.amount).toLocaleString()}</TableCell>
                        <TableCell>
                          {item.status === 'Overdue' ? (
                            <span className="text-destructive font-bold text-xs">+ ₹{PENALTY_AMOUNT}</span>
                          ) : (
                            <span className="text-muted-foreground text-xs">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant={
                              item.status === 'Paid' ? 'success' :
                                item.status === 'Overdue' ? 'destructive' :
                                  'secondary'
                            }
                            className={cn(
                              "uppercase tracking-wider text-[10px] w-20 justify-center",
                              item.status === 'Paid' && "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25 border-emerald-200 dark:border-emerald-900 border",
                              item.status === 'Overdue' && "bg-red-500/15 text-red-600 dark:text-red-400 hover:bg-red-500/25 border-red-200 dark:border-red-900 border"
                            )}
                          >
                            {item.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
  )
}
