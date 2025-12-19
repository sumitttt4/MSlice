"use client"

export const dynamic = "force-dynamic";

import * as React from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { addMonths, format, isBefore, startOfDay } from "date-fns"
import {
  User,
  CreditCard,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronRight,
  Wallet,
  Settings,
  Bell,
  ArrowRight,
  Calculator,
  X,
  Home
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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
const MONTHLY_RATE = 0.16 // 16% per month
const PENALTY_AMOUNT = 300

function DashboardContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // State
  const [loanAmount, setLoanAmount] = React.useState<number | null>(null)
  const [tenure, setTenure] = React.useState<number | null>(null)
  const [loanStartDate, setLoanStartDate] = React.useState<Date | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [hasLoan, setHasLoan] = React.useState(false)
  const [showPayModal, setShowPayModal] = React.useState(false)
  const [showStatementModal, setShowStatementModal] = React.useState(false)
  const [paidEmis, setPaidEmis] = React.useState<number[]>([])

  React.useEffect(() => {
    async function initializeDashboard() {
      try {
        const urlAmount = searchParams.get('amount')
        const urlTenure = searchParams.get('tenure')

        if (urlAmount && urlTenure) {
          // User came with loan parameters - loan starts TODAY
          setLoanAmount(Number(urlAmount))
          setTenure(Number(urlTenure))
          setLoanStartDate(new Date())
          setHasLoan(true)

          // Save to localStorage
          localStorage.setItem('mslice_loan', JSON.stringify({
            amount: Number(urlAmount),
            tenure: Number(urlTenure),
            startDate: new Date().toISOString(),
            paidEmis: []
          }))

          toast.success("Loan approved!", { description: `₹${Number(urlAmount).toLocaleString()} disbursed to your account.` })
        } else {
          // Check localStorage for existing loan
          const savedLoan = localStorage.getItem('mslice_loan')
          if (savedLoan) {
            const loan = JSON.parse(savedLoan)
            setLoanAmount(loan.amount)
            setTenure(loan.tenure)
            setLoanStartDate(new Date(loan.startDate))
            setPaidEmis(loan.paidEmis || [])
            setHasLoan(true)
          } else {
            setHasLoan(false)
          }
        }
      } finally {
        setIsLoading(false)
      }
    }
    initializeDashboard()
  }, [searchParams])

  // Save loan to localStorage when paid EMIs change
  React.useEffect(() => {
    if (hasLoan && loanAmount && tenure && loanStartDate) {
      localStorage.setItem('mslice_loan', JSON.stringify({
        amount: loanAmount,
        tenure: tenure,
        startDate: loanStartDate.toISOString(),
        paidEmis: paidEmis
      }))
    }
  }, [paidEmis, hasLoan, loanAmount, tenure, loanStartDate])

  // EMI Calculation
  const emi = React.useMemo(() => {
    if (!loanAmount || loanAmount === 0 || !tenure) return 0
    return (loanAmount * MONTHLY_RATE * Math.pow(1 + MONTHLY_RATE, tenure)) / (Math.pow(1 + MONTHLY_RATE, tenure) - 1)
  }, [loanAmount, tenure])

  const totalPayment = emi * (tenure || 0)
  const totalInterest = totalPayment - (loanAmount || 0)

  // Generate Schedule based on loan start date
  const schedule = React.useMemo(() => {
    if (!loanAmount || !tenure || !loanStartDate) return []

    const installments = []
    let balance = loanAmount
    const today = startOfDay(new Date())

    for (let i = 1; i <= tenure; i++) {
      const dueDate = addMonths(loanStartDate, i)
      const interestComponent = balance * MONTHLY_RATE
      const principalComponent = emi - interestComponent
      balance -= principalComponent

      let status: "Paid" | "Pending" | "Overdue" = "Pending"

      if (paidEmis.includes(i)) {
        status = "Paid"
      } else if (isBefore(dueDate, today)) {
        status = "Overdue"
      }

      installments.push({
        installment: i,
        dueDate,
        amount: emi,
        principal: principalComponent,
        interest: interestComponent,
        status
      })
    }
    return installments
  }, [loanAmount, emi, tenure, loanStartDate, paidEmis])

  const paidCount = schedule.filter(s => s.status === 'Paid').length
  const overdueCount = schedule.filter(s => s.status === 'Overdue').length
  const nextDue = schedule.find(s => s.status === 'Pending' || s.status === 'Overdue')
  const progressPercent = tenure ? (paidCount / tenure) * 100 : 0
  const amountPaid = paidCount * emi
  const remainingAmount = totalPayment - amountPaid

  // Pay EMI Handler
  function handlePayEmi(installmentNum: number) {
    if (!paidEmis.includes(installmentNum)) {
      const newPaidEmis = [...paidEmis, installmentNum]
      setPaidEmis(newPaidEmis)
      toast.success("Payment successful!", { description: `EMI #${installmentNum} paid successfully.` })
      setShowPayModal(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-pulse text-white">Loading...</div>
      </div>
    )
  }

  // No Loan State
  if (!hasLoan) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <header className="sticky top-0 z-50 bg-[#111111] border-b border-zinc-800">
          <div className="container max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="font-semibold text-lg text-white">Mslice</span>
            </Link>
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </header>

        <main className="container max-w-2xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <Card className="bg-[#111111] border-zinc-800">
            <CardContent className="p-8 sm:p-12 text-center space-y-6">
              <div className="h-16 w-16 sm:h-20 sm:w-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto">
                <Calculator className="h-8 w-8 sm:h-10 sm:w-10 text-zinc-500" />
              </div>

              <div className="space-y-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white">No Active Loan</h1>
                <p className="text-zinc-400 max-w-sm mx-auto text-sm sm:text-base">
                  You don't have an active loan. Apply now and get instant approval.
                </p>
              </div>

              <div className="space-y-4 pt-4">
                <Link href="/" className="block">
                  <Button className="w-full sm:w-auto px-8 h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-medium">
                    Apply for a Loan <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>

                <div className="flex flex-wrap justify-center gap-4 text-xs text-zinc-500">
                  <span>✓ ₹1,000 - ₹30,000</span>
                  <span>✓ 60s approval</span>
                  <span>✓ 16% APR</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  // Has Loan - Dashboard
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Pay EMI Modal */}
      {showPayModal && nextDue && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <Card className="bg-[#111111] border-zinc-800 w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Pay EMI</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowPayModal(false)}>
                <X className="h-4 w-4 text-zinc-400" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-4 bg-zinc-900 rounded-xl">
                <p className="text-sm text-zinc-400 mb-1">Amount Due</p>
                <p className="text-3xl font-bold text-white">₹{Math.round(emi).toLocaleString()}</p>
                <p className="text-xs text-zinc-500 mt-1">EMI #{nextDue.installment} • Due {format(nextDue.dueDate, "MMM dd, yyyy")}</p>
              </div>

              {nextDue.status === 'Overdue' && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <span className="text-sm text-red-400">Overdue! Late fee of ₹{PENALTY_AMOUNT} applies.</span>
                </div>
              )}

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Principal</span>
                  <span className="text-white">₹{Math.round(nextDue.principal).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Interest</span>
                  <span className="text-white">₹{Math.round(nextDue.interest).toLocaleString()}</span>
                </div>
                {nextDue.status === 'Overdue' && (
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Late Fee</span>
                    <span className="text-red-400">₹{PENALTY_AMOUNT}</span>
                  </div>
                )}
              </div>

              <Button
                className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white"
                onClick={() => handlePayEmi(nextDue.installment)}
              >
                Pay ₹{Math.round(nextDue.status === 'Overdue' ? emi + PENALTY_AMOUNT : emi).toLocaleString()}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Statement Modal */}
      {showStatementModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <Card className="bg-[#111111] border-zinc-800 w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Loan Statement</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowStatementModal(false)}>
                <X className="h-4 w-4 text-zinc-400" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-zinc-900 rounded-lg">
                  <p className="text-zinc-500">Loan Amount</p>
                  <p className="font-bold text-white">₹{(loanAmount || 0).toLocaleString()}</p>
                </div>
                <div className="p-3 bg-zinc-900 rounded-lg">
                  <p className="text-zinc-500">Tenure</p>
                  <p className="font-bold text-white">{tenure} months</p>
                </div>
                <div className="p-3 bg-zinc-900 rounded-lg">
                  <p className="text-zinc-500">Interest Rate</p>
                  <p className="font-bold text-white">16% p.a.</p>
                </div>
                <div className="p-3 bg-zinc-900 rounded-lg">
                  <p className="text-zinc-500">Monthly EMI</p>
                  <p className="font-bold text-emerald-400">₹{Math.round(emi).toLocaleString()}</p>
                </div>
              </div>

              <Separator className="bg-zinc-800" />

              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800">
                    <TableHead className="text-zinc-400">#</TableHead>
                    <TableHead className="text-zinc-400">Due Date</TableHead>
                    <TableHead className="text-right text-zinc-400">Principal</TableHead>
                    <TableHead className="text-right text-zinc-400">Interest</TableHead>
                    <TableHead className="text-right text-zinc-400">EMI</TableHead>
                    <TableHead className="text-center text-zinc-400">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedule.map((row) => (
                    <TableRow key={row.installment} className="border-zinc-800">
                      <TableCell className="text-white">{row.installment}</TableCell>
                      <TableCell className="text-zinc-300">{format(row.dueDate, "MMM dd, yyyy")}</TableCell>
                      <TableCell className="text-right text-white">₹{Math.round(row.principal).toLocaleString()}</TableCell>
                      <TableCell className="text-right text-white">₹{Math.round(row.interest).toLocaleString()}</TableCell>
                      <TableCell className="text-right text-white">₹{Math.round(row.amount).toLocaleString()}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={cn(
                          "text-xs border-0",
                          row.status === 'Paid' && "bg-emerald-500/20 text-emerald-400",
                          row.status === 'Pending' && "bg-zinc-700 text-zinc-300",
                          row.status === 'Overdue' && "bg-red-500/20 text-red-400"
                        )}>
                          {row.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#111111] border-b border-zinc-800">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-semibold text-lg text-white">Mslice</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="ghost" size="icon" className="relative text-zinc-400 hover:text-white">
              <Bell className="h-5 w-5" />
              {overdueCount > 0 && <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />}
            </Button>
            <div className="h-8 w-8 bg-zinc-800 rounded-full hidden sm:flex items-center justify-center">
              <User className="h-4 w-4 text-zinc-400" />
            </div>
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-zinc-400">Loan started {loanStartDate && format(loanStartDate, "MMM dd, yyyy")}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Loan Overview */}
            <Card className="bg-[#111111] border-zinc-800">
              <CardHeader className="pb-4 px-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base sm:text-lg text-white">Active Loan</CardTitle>
                    <CardDescription className="text-zinc-400 text-sm">Personal Loan • 16% APR</CardDescription>
                  </div>
                  <Badge className={cn(
                    "border-0",
                    overdueCount > 0 ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"
                  )}>
                    {overdueCount > 0 ? "Overdue" : "Active"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  <div className="text-center p-3 sm:p-4 bg-zinc-900 rounded-xl border border-zinc-800">
                    <p className="text-[10px] sm:text-xs text-zinc-500 mb-1">Principal</p>
                    <p className="text-base sm:text-xl font-bold text-white">₹{(loanAmount || 0).toLocaleString()}</p>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-zinc-900 rounded-xl border border-zinc-800">
                    <p className="text-[10px] sm:text-xs text-zinc-500 mb-1">Interest</p>
                    <p className="text-base sm:text-xl font-bold text-white">₹{Math.round(totalInterest).toLocaleString()}</p>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <p className="text-[10px] sm:text-xs text-zinc-400 mb-1">EMI</p>
                    <p className="text-base sm:text-xl font-bold text-emerald-400">₹{Math.round(emi).toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Repayment Progress</span>
                    <span className="font-medium text-white">{paidCount} of {tenure} EMIs</span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>

                {nextDue && (
                  <div className={cn(
                    "flex items-center justify-between p-3 sm:p-4 rounded-xl border",
                    nextDue.status === 'Overdue'
                      ? "bg-red-500/10 border-red-500/20"
                      : "bg-amber-500/10 border-amber-500/20"
                  )}>
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-8 w-8 sm:h-10 sm:w-10 rounded-lg flex items-center justify-center",
                        nextDue.status === 'Overdue' ? "bg-red-500/20" : "bg-amber-500/20"
                      )}>
                        <Calendar className={cn(
                          "h-4 w-4 sm:h-5 sm:w-5",
                          nextDue.status === 'Overdue' ? "text-red-400" : "text-amber-400"
                        )} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {nextDue.status === 'Overdue' ? "EMI Overdue!" : "Next EMI Due"}
                        </p>
                        <p className="text-xs text-zinc-400">{format(nextDue.dueDate, "MMM dd, yyyy")}</p>
                      </div>
                    </div>
                    <p className="text-base sm:text-lg font-bold text-white">₹{Math.round(emi).toLocaleString()}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Late Fee Warning */}
            <Card className="bg-amber-500/10 border-amber-500/20">
              <CardContent className="py-3 sm:py-4 px-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-white">Late Payment Fee: ₹{PENALTY_AMOUNT}</p>
                    <p className="text-xs text-zinc-400">Charged if EMI is not paid by due date.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Schedule Preview */}
            <Card className="bg-[#111111] border-zinc-800">
              <CardHeader className="px-4 sm:px-6">
                <CardTitle className="text-base sm:text-lg text-white">Upcoming Payments</CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <div className="space-y-3">
                  {schedule.filter(s => s.status !== 'Paid').slice(0, 4).map((row) => (
                    <div key={row.installment} className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-medium text-zinc-400">#{row.installment}</div>
                        <div>
                          <p className="text-sm text-white">{format(row.dueDate, "MMM dd, yyyy")}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-white">₹{Math.round(row.amount).toLocaleString()}</span>
                        <Badge className={cn(
                          "text-xs border-0",
                          row.status === 'Overdue' && "bg-red-500/20 text-red-400",
                          row.status === 'Pending' && "bg-zinc-700 text-zinc-300"
                        )}>
                          {row.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Quick Actions */}
            <Card className="bg-[#111111] border-zinc-800">
              <CardHeader className="px-4 sm:px-6">
                <CardTitle className="text-base sm:text-lg text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 px-4 sm:px-6">
                <Button
                  className="w-full justify-start bg-emerald-500 hover:bg-emerald-600 text-white"
                  onClick={() => setShowPayModal(true)}
                  disabled={!nextDue}
                >
                  <Wallet className="h-4 w-4 mr-2" /> Pay EMI Now
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-zinc-700 bg-transparent text-white hover:bg-zinc-800"
                  onClick={() => setShowStatementModal(true)}
                >
                  <CreditCard className="h-4 w-4 mr-2" /> View Statement
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-zinc-700 bg-transparent text-white hover:bg-zinc-800"
                  onClick={() => toast.info("Autopay", { description: "Autopay setup coming soon!" })}
                >
                  <Settings className="h-4 w-4 mr-2" /> Manage Autopay
                </Button>
              </CardContent>
            </Card>

            {/* Loan Summary */}
            <Card className="bg-[#111111] border-zinc-800">
              <CardHeader className="px-4 sm:px-6">
                <CardTitle className="text-base sm:text-lg text-white">Loan Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Loan Amount</span>
                  <span className="font-medium text-white">₹{(loanAmount || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Tenure</span>
                  <span className="font-medium text-white">{tenure} months</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Interest Rate</span>
                  <span className="font-medium text-white">16% p.a.</span>
                </div>
                <Separator className="bg-zinc-800" />
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Total Payable</span>
                  <span className="font-medium text-white">₹{Math.round(totalPayment).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Amount Paid</span>
                  <span className="font-medium text-emerald-400">₹{Math.round(amountPaid).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-300 font-medium">Outstanding</span>
                  <span className="font-bold text-white">₹{Math.round(remainingAmount).toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Help */}
            <Card className="bg-emerald-500/10 border-emerald-500/20">
              <CardContent className="py-5 sm:py-6 px-4 sm:px-6 text-center space-y-3">
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                  <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm sm:text-base">Need help?</h4>
                  <p className="text-xs text-zinc-400 mt-1">Support available 24/7</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                  onClick={() => toast.info("Support", { description: "Contact support@mslice.com" })}
                >
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function Dashboard() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-pulse text-white">Loading...</div>
      </div>
    }>
      <DashboardContent />
    </React.Suspense>
  )
}
