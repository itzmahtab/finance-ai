import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, TrendingDown, Plus, X, Loader2, BarChart2, Shield, Trash2 } from 'lucide-react'
import { formatCurrency, formatPercentage } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useInvestments } from '@/hooks/use-investments'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const typeColors: Record<string, string> = {
  stocks: 'bg-primary/15 text-primary',
  etf: 'bg-accent/15 text-accent',
  mutual_fund: 'bg-purple/15 text-purple',
  retirement: 'bg-pink/15 text-pink',
  crypto: 'bg-warning/15 text-warning',
  other: 'bg-surface-active text-foreground-muted',
}

export default function InvestmentsPage() {
  const { investments, isLoading, addInvestment, isAdding, deleteInvestment } = useInvestments()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: 'stocks' as const,
    investedAmount: '',
    currentValue: '',
    platform: '',
    startDate: new Date().toISOString().split('T')[0],
  })

  const totalInvested = investments.reduce((s, i) => s + parseFloat(i.investedAmount), 0)
  const totalCurrent = investments.reduce((s, i) => s + parseFloat(i.currentValue), 0)
  const totalReturn = totalCurrent - totalInvested
  const totalPct = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await addInvestment(formData)
    setIsModalOpen(false)
    setFormData({
      name: '',
      type: 'stocks',
      investedAmount: '',
      currentValue: '',
      platform: '',
      startDate: new Date().toISOString().split('T')[0],
    })
  }

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto pb-10">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Investments</h2>
          <p className="text-sm text-foreground-muted mt-0.5">Track your portfolio performance</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 shadow-glow-primary">
          <Plus className="w-4 h-4" />
          Add Investment
        </Button>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Invested', value: totalInvested, color: 'text-foreground' },
          { label: 'Current Value', value: totalCurrent, color: 'text-primary' },
          { label: 'Total Return', value: totalReturn, color: totalReturn >= 0 ? 'text-primary' : 'text-destructive', pct: totalPct },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-5"
          >
            <p className="text-sm text-foreground-muted mb-2">{item.label}</p>
            <p className={cn('text-2xl font-bold', item.color)}>
              {formatCurrency(item.value)}
            </p>
            {'pct' in item && item.pct !== undefined && (
              <div className={cn('flex items-center gap-1 mt-1 text-xs font-semibold', item.color)}>
                {item.pct >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {item.pct >= 0 ? '+' : ''}{formatPercentage(item.pct)}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Investment List */}
      {investments.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl overflow-hidden"
        >
          <div className="hidden sm:grid grid-cols-[1fr_120px_120px_120px_120px_60px] gap-4 px-6 py-3 border-b border-white/5 text-[10px] font-bold text-foreground-subtle uppercase tracking-widest">
            <span>Investment</span>
            <span>Type</span>
            <span className="text-right">Invested</span>
            <span className="text-right">Current</span>
            <span className="text-right">Return</span>
            <span />
          </div>
          <div className="divide-y divide-white/5">
            {investments.map((inv, i) => {
              const invAmount = parseFloat(inv.investedAmount)
              const curAmount = parseFloat(inv.currentValue)
              const ret = curAmount - invAmount
              const isPositive = ret >= 0
              const chg = invAmount > 0 ? (ret / invAmount) * 100 : 0

              return (
                <motion.div
                  key={inv.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + i * 0.04 }}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_120px_120px_120px_120px_60px] gap-2 sm:gap-4 px-6 py-4 hover:bg-white/5 transition-colors group"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{inv.name}</p>
                    <p className="text-[10px] text-foreground-subtle uppercase font-bold tracking-tight">{inv.platform}</p>
                  </div>
                  <div className="flex items-center">
                    <span className={cn('text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md', typeColors[inv.type as keyof typeof typeColors] || typeColors.other)}>
                      {inv.type.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-foreground-muted text-right self-center">{formatCurrency(invAmount)}</p>
                  <p className="text-sm font-bold text-foreground text-right self-center">{formatCurrency(curAmount)}</p>
                  <div className="flex items-center justify-end gap-1.5 self-center">
                    <span className={cn('text-xs font-bold', isPositive ? 'text-primary' : 'text-destructive')}>
                      {isPositive ? '+' : ''}{chg.toFixed(1)}%
                    </span>
                    {isPositive ? <TrendingUp className="w-3.5 h-3.5 text-primary" /> : <TrendingDown className="w-3.5 h-3.5 text-destructive" />}
                  </div>
                  <div className="flex justify-end items-center">
                    <button 
                      onClick={() => deleteInvestment(inv.id)}
                      className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-foreground-subtle hover:text-destructive transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      ) : (
        <div className="glass rounded-3xl p-16 text-center">
          <div className="w-20 h-20 bg-surface-active rounded-3xl flex items-center justify-center mx-auto mb-6">
            <BarChart2 className="w-10 h-10 text-foreground-subtle" />
          </div>
          <h3 className="text-xl font-bold text-foreground">No investments yet</h3>
          <p className="text-foreground-muted max-w-sm mx-auto mt-2">
            Start tracking your stocks, crypto, or savings to see your wealth grow over time.
          </p>
          <Button onClick={() => setIsModalOpen(true)} variant="outline" className="mt-8">
            Add Your First Investment
          </Button>
        </div>
      )}

      {/* Add Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md glass-strong rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
              >
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold">New Investment</h3>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                    <X className="w-5 h-5 text-foreground-muted" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-foreground-muted uppercase tracking-widest mb-1.5 ml-1">Name</label>
                    <Input 
                      required
                      placeholder="e.g. S&P 500 ETF" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-foreground-muted uppercase tracking-widest mb-1.5 ml-1">Type</label>
                      <select 
                        className="w-full h-11 px-4 rounded-xl bg-surface border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-all appearance-none"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      >
                        <option value="stocks">Stocks</option>
                        <option value="etf">ETF</option>
                        <option value="mutual_fund">Mutual Fund</option>
                        <option value="retirement">Retirement</option>
                        <option value="crypto">Crypto</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-foreground-muted uppercase tracking-widest mb-1.5 ml-1">Platform</label>
                      <Input 
                        placeholder="Vanguard/DSE" 
                        value={formData.platform}
                        onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-foreground-muted uppercase tracking-widest mb-1.5 ml-1">Invested (৳)</label>
                      <Input 
                        required
                        type="number"
                        placeholder="0.00" 
                        value={formData.investedAmount}
                        onChange={(e) => setFormData({ ...formData, investedAmount: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-foreground-muted uppercase tracking-widest mb-1.5 ml-1">Current (৳)</label>
                      <Input 
                        required
                        type="number"
                        placeholder="0.00" 
                        value={formData.currentValue}
                        onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button type="submit" disabled={isAdding} className="w-full h-12 gap-2 text-sm font-bold">
                      {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                      Add to Portfolio
                    </Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
