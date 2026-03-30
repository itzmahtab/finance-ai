import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Plus } from 'lucide-react'
import { formatCurrency, formatPercentage } from '@/lib/format'
import { cn } from '@/lib/utils'

const investments = [
  { id: '1', name: 'S&P 500 ETF (VOO)', type: 'ETF', invested: 5000, current: 5850, platform: 'Vanguard', change: 17.0 },
  { id: '2', name: 'Apple Inc (AAPL)', type: 'Stocks', invested: 3000, current: 3420, platform: 'Robinhood', change: 14.0 },
  { id: '3', name: 'Bitcoin (BTC)', type: 'Crypto', invested: 2000, current: 2680, platform: 'Coinbase', change: 34.0 },
  { id: '4', name: 'Total Bond Market (BND)', type: 'ETF', invested: 4000, current: 3920, platform: 'Vanguard', change: -2.0 },
  { id: '5', name: '401(k) Retirement', type: 'Retirement', invested: 12000, current: 14200, platform: 'Fidelity', change: 18.3 },
  { id: '6', name: 'Tesla Inc (TSLA)', type: 'Stocks', invested: 1500, current: 1320, platform: 'Robinhood', change: -12.0 },
]

const typeColors: Record<string, string> = {
  ETF: 'bg-accent/15 text-accent',
  Stocks: 'bg-primary/15 text-primary',
  Crypto: 'bg-warning/15 text-warning',
  Retirement: 'bg-purple/15 text-purple',
}

export default function InvestmentsPage() {
  const totalInvested = investments.reduce((s, i) => s + i.invested, 0)
  const totalCurrent = investments.reduce((s, i) => s + i.current, 0)
  const totalReturn = totalCurrent - totalInvested
  const totalPct = (totalReturn / totalInvested) * 100

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Investments</h2>
          <p className="text-sm text-foreground-muted mt-0.5">Track your portfolio performance</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" />
          Add Investment
        </button>
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-2xl overflow-hidden"
      >
        <div className="hidden sm:grid grid-cols-[1fr_100px_120px_120px_100px] gap-4 px-6 py-3 border-b border-border text-xs font-semibold text-foreground-subtle uppercase tracking-wide">
          <span>Investment</span>
          <span>Type</span>
          <span className="text-right">Invested</span>
          <span className="text-right">Current</span>
          <span className="text-right">Return</span>
        </div>
        <div className="divide-y divide-border">
          {investments.map((inv, i) => {
            const ret = inv.current - inv.invested
            const isPositive = ret >= 0
            return (
              <motion.div
                key={inv.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.04 }}
                className="grid grid-cols-1 sm:grid-cols-[1fr_100px_120px_120px_100px] gap-2 sm:gap-4 px-6 py-4 hover:bg-surface-hover transition-colors cursor-pointer"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{inv.name}</p>
                  <p className="text-xs text-foreground-subtle">{inv.platform}</p>
                </div>
                <div className="flex items-center">
                  <span className={cn('text-xs font-medium px-2.5 py-1 rounded-lg', typeColors[inv.type] || 'bg-surface-active text-foreground-muted')}>
                    {inv.type}
                  </span>
                </div>
                <p className="text-sm text-foreground text-right self-center">{formatCurrency(inv.invested)}</p>
                <p className="text-sm font-medium text-foreground text-right self-center">{formatCurrency(inv.current)}</p>
                <div className="flex items-center justify-end gap-1">
                  <span className={cn('text-sm font-semibold', isPositive ? 'text-primary' : 'text-destructive')}>
                    {isPositive ? '+' : ''}{formatPercentage(inv.change)}
                  </span>
                  {isPositive ? <TrendingUp className="w-3.5 h-3.5 text-primary" /> : <TrendingDown className="w-3.5 h-3.5 text-destructive" />}
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
