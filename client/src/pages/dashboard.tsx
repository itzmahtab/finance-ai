import { motion } from 'framer-motion'
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  MoreHorizontal,
  Target,
  ArrowRight
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useTransactions } from '@/hooks/use-transactions'
import { useBudget } from '@/hooks/use-budget'
import { formatCurrency, formatPercentage, formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function DashboardPage() {
  const { transactions, isLoading: txLoading } = useTransactions()
  const { budget, isLoading: budgetLoading } = useBudget()

  const totalSpent = (budget?.items || []).reduce((sum: number, i: any) => sum + parseFloat(i.spentAmount), 0)
  const totalIncome = parseFloat(budget?.totalAmount || '0')
  const remaining = totalIncome - totalSpent
  const spentPct = totalIncome > 0 ? (totalSpent / totalIncome) * 100 : 0

  const latestTransactions = transactions.slice(0, 5)

  // Chart data (mocking the time series for now, but using real current totals)
  const chartData = [
    { name: 'Week 1', spent: 1200 },
    { name: 'Week 2', spent: 2100 },
    { name: 'Week 3', spent: 1800 },
    { name: 'Week 4', spent: totalSpent },
  ]

  const stats = [
    {
      label: 'Monthly Income',
      value: totalIncome,
      change: '+12%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-primary'
    },
    {
      label: 'Total Expenses',
      value: totalSpent,
      change: '-5%',
      trend: 'down',
      icon: TrendingDown,
      color: 'text-foreground'
    },
    {
      label: 'Available Savings',
      value: remaining,
      change: '+8%',
      trend: 'up',
      icon: Wallet,
      color: remaining > 0 ? 'text-primary' : 'text-destructive'
    },
  ]

  if (txLoading || budgetLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="h-32 rounded-2xl bg-surface-active" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-[400px] rounded-2xl bg-surface-active" />
          <div className="h-[400px] rounded-2xl bg-surface-active" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Welcome back, User!</h2>
          <p className="text-sm text-foreground-muted mt-0.5">Here's what's happening with your BDT finances today.</p>
        </div>
        <Link to="/transactions">
          <Button className="gap-2 shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4" /> Add Transaction
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-5 group hover:bg-surface-hover transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-surface-active flex items-center justify-center">
                <stat.icon className={cn('w-5 h-5', stat.color)} />
              </div>
              <Badge variant="glass" className={cn(
                'text-[10px] font-bold',
                stat.trend === 'up' ? 'text-primary' : 'text-foreground-muted'
              )}>
                {stat.change}
              </Badge>
            </div>
            <p className="text-sm font-medium text-foreground-muted">{stat.label}</p>
            <h3 className="text-2xl font-bold font-mono mt-1">{formatCurrency(stat.value)}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Insights Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-3xl p-6 flex flex-col border-none"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-foreground">Expense Analytics</h3>
            <div className="p-2 rounded-xl bg-surface-active cursor-pointer">
              <MoreHorizontal className="w-4 h-4 text-foreground-muted" />
            </div>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                  dy={10} 
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="spent" 
                  stroke="var(--color-primary)" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorSpent)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Budget Progress (Real Live Data) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-3xl p-6 flex flex-col border-none"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-foreground">Budget Utilization</h3>
            <Link to="/budget" className="text-xs text-primary font-bold hover:underline">View All</Link>
          </div>
          
          <div className="flex-1 space-y-6">
            {!budget ? (
               <div className="flex flex-col items-center justify-center h-full text-center py-10">
                <Target className="w-12 h-12 text-foreground-subtle mb-4" />
                <p className="text-sm text-foreground-muted mb-4 uppercase tracking-widest font-bold">No Active Budget</p>
                <Link to="/budget">
                  <Button variant="glass" size="sm">Set Budget Now</Button>
                </Link>
               </div>
            ) : (
              <>
                <div className="relative h-40 flex items-center justify-center">
                  {/* Big progress ring placeholder or target visual */}
                  <div className="text-center">
                    <p className="text-4xl font-black font-mono">{formatPercentage(spentPct, 0)}</p>
                    <p className="text-[10px] text-foreground-muted uppercase tracking-widest font-bold mt-1">Total Limit Spent</p>
                  </div>
                  {/* SVG Ring */}
                  <svg className="absolute w-40 h-40 transform -rotate-90">
                    <circle cx="80" cy="80" r="70" stroke="rgba(255,255,255,0.05)" strokeWidth="12" fill="transparent" />
                    <circle 
                      cx="80" cy="80" r="70" 
                      stroke="var(--color-primary)" 
                      strokeWidth="12" 
                      fill="transparent" 
                      strokeDasharray={440} 
                      strokeDashoffset={440 - (440 * spentPct) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <div className="space-y-4">
                  {(budget?.items || []).slice(0, 3).map((item: any) => {
                    const pct = Math.min((parseFloat(item.spentAmount) / parseFloat(item.allocatedAmount)) * 100, 100)
                    return (
                      <div key={item.id} className="space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-foreground-muted">{item.category?.name}</span>
                          <span className="text-foreground">{formatPercentage(pct, 0)}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-surface-active overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${pct}%` }} 
                            className="h-full bg-primary rounded-full shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.5)]" 
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass rounded-3xl overflow-hidden border-none"
      >
        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">Recent Activity</h3>
          <Link to="/transactions" className="p-2 rounded-xl hover:bg-surface-active transition-colors">
            <ArrowRight className="w-5 h-5 text-foreground-muted" />
          </Link>
        </div>
        <div className="divide-y divide-white/5">
          {txLoading ? (
            <div className="p-20 text-center text-foreground-muted">Loading history...</div>
          ) : latestTransactions.length === 0 ? (
            <div className="p-20 text-center text-foreground-muted">No transactions recorded yet.</div>
          ) : latestTransactions.map((tx: any) => (
            <div key={tx.id} className="px-6 py-4 flex items-center justify-between hover:bg-surface-hover/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-active flex items-center justify-center font-bold text-xs">
                  {tx.category?.name?.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{tx.description}</p>
                  <p className="text-[10px] text-foreground-muted uppercase tracking-wider">{tx.category?.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={cn("text-sm font-black font-mono", tx.type === 'income' ? 'text-primary' : 'text-foreground')}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(parseFloat(tx.amount))}
                </p>
                <p className="text-[10px] text-foreground-subtle font-medium">{formatDate(tx.transactionDate)}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
