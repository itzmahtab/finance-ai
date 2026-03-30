import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, TrendingUp, AlertTriangle, PieChart, Sparkles, Target, ArrowRight } from 'lucide-react'
import { formatCurrency, formatPercentage } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useBudget } from '@/hooks/use-budget'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

const typeConfig = {
  need: { label: 'Needs (50%)', color: '#6366f1', bg: 'bg-indigo-500/10', text: 'text-indigo-500', target: 50 },
  want: { label: 'Wants (30%)', color: '#f59e0b', bg: 'bg-warning/10', text: 'text-warning', target: 30 },
  saving: { label: 'Savings (20%)', color: '#10b981', bg: 'bg-emerald-500/10', text: 'text-emerald-500', target: 20 },
  investment: { label: 'Investments', color: '#10b981', bg: 'bg-emerald-500/10', text: 'text-emerald-500', target: 20 },
}

export default function BudgetPage() {
  const { budget, isLoading, initBudget, isInitializing } = useBudget()
  const [isInitModalOpen, setIsInitModalOpen] = useState(false)
  const [monthlyIncome, setMonthlyIncome] = useState('')

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-[1200px] mx-auto animate-pulse">
        <div className="h-8 w-48 bg-surface-active rounded mb-2" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="h-32 rounded-2xl bg-surface-active" />)}
        </div>
      </div>
    )
  }

  // Handle Empty State
  if (!budget) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto">
        <div className="w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center mb-8 shadow-2xl shadow-primary/20">
          <PieChart className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-4">Plan Your Financial Freedom</h2>
        <p className="text-foreground-muted mb-10 text-lg leading-relaxed">
          It looks like you haven't set up a budget for this month. 
          Use our <span className="text-primary font-semibold">50/30/20 strategy</span> to automatically balance your needs, wants, and future savings.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 w-full text-left">
          {[
            { title: '50% Needs', desc: 'Rent, groceries, utilities, and essentials.', icon: Target },
            { title: '30% Wants', desc: 'Entertainment, dining out, and hobbies.', icon: Sparkles },
            { title: '20% Savings', desc: 'Investments, emergency fund, and debt.', icon: TrendingUp },
          ].map((item, i) => (
            <div key={i} className="glass p-5 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-bold text-foreground mb-1">{item.title}</h4>
              <p className="text-xs text-foreground-muted leading-tight">{item.desc}</p>
            </div>
          ))}
        </div>

        <Button 
          size="lg" 
          onClick={() => setIsInitModalOpen(true)}
          className="px-10 h-14 text-base font-bold shadow-xl shadow-primary/25 group"
        >
          Initialize March Budget <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>

        {/* Init Modal */}
        <AnimatePresence>
          {isInitModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsInitModalOpen(false)} className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md glass-strong rounded-3xl p-8 border border-border shadow-2xl">
                <h3 className="text-xl font-bold text-foreground mb-2 text-center">Set Your Monthly Income</h3>
                <p className="text-sm text-foreground-muted text-center mb-8">We'll magically split this into categories for you.</p>
                <div className="space-y-6">
                  <Input 
                    type="number" 
                    placeholder="Enter amount (e.g. 50000)" 
                    value={monthlyIncome}
                    onChange={e => setMonthlyIncome(e.target.value)}
                    className="text-center text-2xl h-16 font-bold"
                  />
                  <Button 
                    className="w-full h-14 font-bold text-lg" 
                    disabled={isInitializing || !monthlyIncome}
                    onClick={async () => {
                      await initBudget({ totalAmount: parseFloat(monthlyIncome), strategy: '50_30_20' })
                      setIsInitModalOpen(false)
                    }}
                  >
                    {isInitializing ? 'Generating...' : 'Start Planning'}
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  const totalBudget = parseFloat(budget.totalAmount)
  const budgetItems = budget.items || []
  const totalSpent = budgetItems.reduce((sum: number, c: any) => sum + parseFloat(c.spentAmount), 0)

  // Group by type for the 50/30/20 visual
  const groups = {
    need: budgetItems.filter((c: any) => c.category?.type === 'need'),
    want: budgetItems.filter((c: any) => c.category?.type === 'want'),
    saving: budgetItems.filter((c: any) => c.category?.type === 'saving' || c.category?.type === 'investment'),
  }

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Monthly Budget</h2>
          <p className="text-sm text-foreground-muted mt-0.5">March 2026 — Optimized via 50/30/20 Strategy</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsInitModalOpen(true)}>Reset Budget</Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Planned Income', value: totalBudget, icon: TrendingUp, color: 'text-primary' },
          { label: 'Actual Spent', value: totalSpent, icon: Wallet, color: 'text-foreground' },
          { label: 'Unallocated', value: totalBudget - totalSpent, icon: Wallet, color: totalBudget - totalSpent > 0 ? 'text-primary' : 'text-destructive' },
        ].map((item, i) => (
          <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass rounded-2xl p-5 border-l-4 border-l-primary/30">
            <div className="flex items-center gap-2 mb-2">
              <item.icon className={cn('w-4 h-4', item.color)} />
              <span className="text-sm text-foreground-muted">{item.label}</span>
            </div>
            <p className="text-2xl font-bold font-mono">{formatCurrency(item.value)}</p>
          </motion.div>
        ))}
      </div>

      {/* 50/30/20 Visual Bar */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">50/30/20 Distribution</h3>
        <div className="flex h-10 rounded-2xl overflow-hidden p-1 bg-surface-active/50 gap-1.5">
          {(['need', 'want', 'saving'] as const).map((type) => {
            const config = (typeConfig as any)[type]
            const groupBudget = groups[type].reduce((s: number, c: any) => s + parseFloat(c.allocatedAmount), 0)
            const pct = (groupBudget / totalBudget) * 100
            return (
              <motion.div
                key={type}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                className="h-full rounded-xl flex items-center justify-center text-[10px] font-bold text-white shadow-inner"
                style={{ background: config.color }}
              >
                {pct > 5 && formatPercentage(pct, 0)}
              </motion.div>
            )
          })}
        </div>
        <div className="flex flex-wrap gap-6 mt-4">
          {(['need', 'want', 'saving'] as const).map((type) => {
            const config = (typeConfig as any)[type]
            return (
              <div key={type} className="flex items-center gap-2.5">
                <div className="w-3.5 h-3.5 rounded-full" style={{ background: config.color }} />
                <span className="text-xs font-medium text-foreground">{config.label}</span>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Category Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(['need', 'want', 'saving'] as const).map((type, gi) => {
          const config = (typeConfig as any)[type]
          const groupSpent = groups[type].reduce((s: number, c: any) => s + parseFloat(c.spentAmount), 0)
          const groupAllocated = groups[type].reduce((s: number, c: any) => s + parseFloat(c.allocatedAmount), 0)
          
          return (
            <motion.div key={type} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: gi * 0.1 }} className="glass rounded-3xl p-6 border-t-2" style={{ borderColor: `${config.color}20` }}>
              <div className="flex items-center justify-between mb-8">
                <div className={cn('px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider', config.bg, config.text)}>
                  {config.label}
                </div>
                <div className="text-right">
                  <p className="text-xs text-foreground-muted font-medium mb-1">Spent vs Allocated</p>
                  <p className="text-sm font-bold font-mono">{formatCurrency(groupSpent)} / {formatCurrency(groupAllocated)}</p>
                </div>
              </div>

              <div className="space-y-6">
                {groups[type].map((cat: any) => {
                  const spent = parseFloat(cat.spentAmount)
                  const allocated = parseFloat(cat.allocatedAmount)
                  const pct = Math.min((spent / allocated) * 100, 100)
                  const isOver = spent > allocated
                  
                  return (
                    <div key={cat.id} className="group">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-foreground-muted font-medium flex items-center gap-2">
                          {cat.category?.name}
                          {isOver && <div className="p-1 rounded-full bg-destructive/10 text-destructive"><AlertTriangle className="w-3 h-3" /></div>}
                        </span>
                        <div className="text-right">
                          <span className={cn('font-bold font-mono', isOver ? 'text-destructive' : 'text-foreground')}>
                            {formatCurrency(spent)}
                          </span>
                          <span className="text-foreground-subtle text-xs"> / {formatCurrency(allocated)}</span>
                        </div>
                      </div>
                      <div className="h-2.5 rounded-full bg-surface-active overflow-hidden relative">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          className={cn('h-full rounded-full transition-colors', isOver ? 'gradient-destructive' : '')}
                          style={!isOver ? { background: config.color } : undefined}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
