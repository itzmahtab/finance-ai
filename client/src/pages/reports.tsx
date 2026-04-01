import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Calendar, Sparkles, TrendingUp, BarChart2, Loader2, ArrowRight, BrainCircuit, Wallet } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/format'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useTransactions } from '@/hooks/use-transactions'
import api from '@/lib/api'

export default function ReportsPage() {
  const [report, setReport] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { transactions } = useTransactions()

  // Calculate real historical monthly data from transactions
  const monthlyHistory = useMemo(() => {
    if (transactions.length === 0) return []

    const history: Record<string, { month: string; income: number; expenses: number }> = {}

    transactions.forEach((tx: any) => {
      const date = new Date(tx.transactionDate)
      const key = `${date.getFullYear()}-${date.getMonth()}`
      const monthName = date.toLocaleString('default', { month: 'long', year: 'numeric' })

      if (!history[key]) {
        history[key] = { month: monthName, income: 0, expenses: 0 }
      }

      if (tx.type === 'income') {
        history[key].income += parseFloat(tx.amount)
      } else {
        history[key].expenses += parseFloat(tx.amount)
      }
    })

    return Object.values(history).map(m => {
      const savings = m.income - m.expenses
      const rate = m.income > 0 ? (savings / m.income) * 100 : 0
      return { ...m, savings, rate: parseFloat(rate.toFixed(1)) }
    }).sort((a, b) => {
      // Sort by date descending
      const dateA = new Date(a.month)
      const dateB = new Date(b.month)
      return dateB.getTime() - dateA.getTime()
    })
  }, [transactions])

  const generateAIReport = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const { data } = await api.get('/ai/report')
      setReport(data.report)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate report. Make sure you have a budget set for this month.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportPDF = () => {
    window.print()
  }

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto pb-10 print:max-w-none print:m-0 print:p-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Financial Reports</h2>
          <p className="text-sm text-foreground-muted mt-0.5">Deep insights into your BDT spending & growth</p>
        </div>
        <Button
          onClick={generateAIReport}
          disabled={isLoading}
          className="gap-2 shadow-glow-primary group h-11 rounded-2xl px-6"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />}
          Generate AI Health Report
        </Button>
      </div>

      {/* CSS for print mode */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          nav, aside, button, footer, .print\\:hidden {
            display: none !important;
          }
          body {
            background: white !important;
            color: black !important;
          }
          .glass, .glass-strong, .card {
            border: 1px solid #eee !important;
            box-shadow: none !important;
            background: white !important;
            color: black !important;
          }
          .text-foreground-muted, .text-foreground-subtle {
            color: #666 !important;
          }
          .text-primary, .text-accent {
            color: black !important;
            font-weight: bold !important;
          }
          .prose {
             color: black !important;
             max-width: 100% !important;
          }
        }
      `}} />

      <AnimatePresence>
        {report && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            id="ai-report-content"
          >
            <Card className="p-8 border-primary/20 bg-primary/5 relative overflow-hidden group print:border-black print:bg-white">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity print:hidden">
                <BrainCircuit className="w-32 h-32 text-primary" />
              </div>

              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-primary/20 flex items-center justify-center print:border print:border-black">
                    <Sparkles className="w-5.5 h-5.5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">AI Financial Insights & Health Analysis</h3>
                </div>
                <Button
                  variant="glass"
                  size="sm"
                  className="print:hidden gap-2 h-9 rounded-xl font-bold uppercase tracking-wider text-[10px]"
                  onClick={handleExportPDF}
                >
                  <Download className="w-3.5 h-3.5" /> Export PDF
                </Button>
              </div>

              <div className="prose prose-sm prose-invert max-w-none print:prose-neutral">
                <div className="whitespace-pre-wrap text-foreground-muted leading-relaxed text-sm bg-surface/40 p-10 rounded-3xl border border-white/5 font-medium shadow-inner print:border-none print:p-0">
                  {report}
                </div>
              </div>

              <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-5 print:hidden">
                <div className="glass p-5 rounded-2xl flex items-center gap-4 border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-foreground-subtle">Wealth Tip</p>
                    <p className="text-xs font-semibold">Check Investment strategy</p>
                  </div>
                </div>
                <div className="glass p-5 rounded-2xl flex items-center gap-4 border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <BarChart2 className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-foreground-subtle">Health Score</p>
                    <p className="text-xs font-semibold">Optimized Context</p>
                  </div>
                </div>
                <Button variant="outline" className="h-full rounded-2xl justify-between group border-white/5">
                  Action Detail <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              <div className="hidden print:block mt-20 text-[10px] text-gray-500 text-center border-t border-gray-100 pt-4">
                Generated by FinanceAI Advisor &bull; Confidential Financial Analysis &bull; {new Date().toLocaleDateString()}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-5 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold flex items-center gap-3"
        >
          <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
          {error}
        </motion.div>
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xl font-extrabold text-foreground tracking-tight">Historical Summaries</h3>
          <Badge variant="glass" className="font-mono text-[10px] px-3 py-1">REAL DATA SYNCED</Badge>
        </div>

        {monthlyHistory.length === 0 ? (
          <div className="glass rounded-3xl p-20 text-center border border-dashed border-white/10">
            <div className="w-20 h-20 rounded-full bg-surface-active flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-foreground-subtle" />
            </div>
            <h3 className="text-lg font-bold text-foreground">No historical data available yet</h3>
            <p className="text-sm text-foreground-muted max-w-xs mx-auto mt-2">
              Start recording transactions to see your monthly trends and financial growth.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {monthlyHistory.map((m, i) => (
              <motion.div
                key={m.month}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-3xl p-7 hover:bg-surface-hover/50 transition-all border-white/5 group shadow-sm overflow-hidden relative"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-surface-active flex items-center justify-center group-hover:bg-primary/5 transition-all shadow-sm border border-white/5">
                      <Calendar className="w-7 h-7 text-foreground-muted group-hover:text-primary transition-colors" />
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold text-foreground tracking-tight">{m.month}</h3>
                      <p className="text-[10px] text-foreground-muted font-black uppercase tracking-widest mt-0.5">Monthly Summary</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 flex-1 sm:max-w-xl">
                    <div>
                      <p className="text-[10px] font-bold text-foreground-subtle uppercase tracking-widest mb-1.5">Income</p>
                      <p className="text-base font-black text-primary font-mono">{formatCurrency(m.income)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-foreground-subtle uppercase tracking-widest mb-1.5">Expenses</p>
                      <p className="text-base font-black text-foreground font-mono">{formatCurrency(m.expenses)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-foreground-subtle uppercase tracking-widest mb-1.5">Savings</p>
                      <p className="text-base font-black text-primary font-mono">{formatCurrency(m.savings)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-foreground-subtle uppercase tracking-widest mb-1.5">Savings Rate</p>
                      <Badge variant="glass" className="text-sm font-black text-accent border-accent/20">
                        {m.rate}%
                      </Badge>
                    </div>
                  </div>

                  <button
                    onClick={handleExportPDF}
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-surface-active text-xs font-bold text-foreground-muted hover:text-foreground hover:bg-surface-hover transition-all group/btn print:hidden"
                  >
                    <Download className="w-4 h-4 group-hover/btn:translate-y-0.5 transition-transform" />
                    Export
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
