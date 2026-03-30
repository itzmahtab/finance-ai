import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Calendar, Sparkles, TrendingUp, BarChart2, Loader2, ArrowRight, BrainCircuit } from 'lucide-react'
import { formatCurrency } from '@/lib/format'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import api from '@/lib/api'

export default function ReportsPage() {
  const [report, setReport] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const months = [
    { month: 'March 2026', income: 8500, expenses: 4320, savings: 4180, rate: 49.2 },
    { month: 'February 2026', income: 8500, expenses: 5100, savings: 3400, rate: 40.0 },
    { month: 'January 2026', income: 8200, expenses: 4800, savings: 3400, rate: 41.5 },
  ]

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

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto pb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Financial Reports</h2>
          <p className="text-sm text-foreground-muted mt-0.5">Deep insights into your BDT spending & growth</p>
        </div>
        <Button 
          onClick={generateAIReport} 
          disabled={isLoading}
          className="gap-2 shadow-glow-primary group"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />}
          Generate AI Health Report
        </Button>
      </div>

      <AnimatePresence>
        {report && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-8 border-primary/20 bg-primary/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <BrainCircuit className="w-32 h-32 text-primary" />
              </div>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">AI Financial Insights</h3>
              </div>

              <div className="prose prose-sm prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-foreground-muted leading-relaxed text-sm bg-surface/40 p-6 rounded-2xl border border-white/5 font-medium">
                  {report}
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="glass p-4 rounded-xl flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-foreground-subtle">Wealth Tip</p>
                    <p className="text-xs font-semibold">Check Investment tab</p>
                  </div>
                </div>
                <div className="glass p-4 rounded-xl flex items-center gap-3">
                  <BarChart2 className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-foreground-subtle">Burn Rate</p>
                    <p className="text-xs font-semibold">Optimized for March</p>
                  </div>
                </div>
                <Button variant="ghost" className="h-full rounded-xl justify-between group">
                  Learn More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium"
        >
          {error}
        </motion.div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground px-1">Historical Summaries</h3>
        {months.map((m, i) => (
          <motion.div
            key={m.month}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-6 hover:bg-surface-hover transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-active flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-foreground-muted" />
                </div>
                <h3 className="text-base font-semibold text-foreground">{m.month}</h3>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-hover text-xs font-medium text-foreground-muted hover:text-foreground transition-colors group">
                <Download className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
                Export PDF
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-foreground-subtle mb-1">Income</p>
                <p className="text-lg font-bold text-primary">{formatCurrency(m.income)}</p>
              </div>
              <div>
                <p className="text-xs text-foreground-subtle mb-1">Expenses</p>
                <p className="text-lg font-bold text-foreground">{formatCurrency(m.expenses)}</p>
              </div>
              <div>
                <p className="text-xs text-foreground-subtle mb-1">Savings</p>
                <p className="text-lg font-bold text-primary">{formatCurrency(m.savings)}</p>
              </div>
              <div>
                <p className="text-xs text-foreground-subtle mb-1">Savings Rate</p>
                <p className="text-lg font-bold text-accent">{m.rate}%</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
