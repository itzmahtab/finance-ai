import { motion } from 'framer-motion'
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  Target,
  ArrowRight,
  TrendingUp as TrendingUpIcon
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
import { useAuthStore } from '@/stores/auth.store'
import { formatCurrency, formatPercentage, formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useFilterStore } from '@/stores/filter.store'
import { MonthPicker } from '@/components/MonthPicker'

export default function DashboardPage() {
  const { transactions, isLoading: txLoading } = useTransactions()
  const { budget, isLoading: budgetLoading } = useBudget()
  const user = useAuthStore(state => state.user)

  const { selectedMonth, selectedYear } = useFilterStore()
  
  // Filter transactions globally based on selected month/year
  const monthlyTransactions = transactions.filter((tx: any) => {
    if (selectedMonth === null || selectedYear === null) return true;
    const date = new Date(tx.transactionDate);
    return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
  });

  // Calculate stats from actual transactions instead of just budget
  const totalIncome = monthlyTransactions
    .filter((t: any) => t.type === 'income')
    .reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0)
    
  const totalSpent = monthlyTransactions
    .filter((t: any) => t.type === 'expense')
    .reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0)
    
  const remaining = totalIncome - totalSpent
  const spentPct = totalIncome > 0 ? (totalSpent / totalIncome) * 100 : 0

  const latestTransactions = monthlyTransactions.slice(0, 5)

  // Calculate dynamic weekly chart data from real transactions
  const getChartData = () => {
    if (monthlyTransactions.length === 0) {
       return [
        { name: 'Week 1', spent: 0 },
        { name: 'Week 2', spent: 0 },
        { name: 'Week 3', spent: 0 },
        { name: 'Week 4', spent: 0 },
      ]
    }

    const weeks = [0, 0, 0, 0] // 4 weeks
    
    // If a month is selected, plot by 4 fixed weeks in that month
    if (selectedMonth !== null && selectedYear !== null) {
      monthlyTransactions.forEach((tx: any) => {
        const txDate = new Date(tx.transactionDate)
        const day = txDate.getDate()
        let week = Math.floor((day - 1) / 7)
        if (week > 3) week = 3 // Group 22+ days into Week 4
        
        if (tx.type === 'expense') {
          weeks[week] += parseFloat(tx.amount)
        }
      })
      
      return [
        { name: 'Week 1', spent: weeks[0] },
        { name: 'Week 2', spent: weeks[1] },
        { name: 'Week 3', spent: weeks[2] },
        { name: 'Week 4', spent: weeks[3] },
      ]
    } else {
      // If "All Time", plot a rolling chronological 4 weeks from today
      const now = new Date()
      monthlyTransactions.forEach((tx: any) => {
        const txDate = new Date(tx.transactionDate)
        const diffDays = Math.floor((now.getTime() - txDate.getTime()) / (1000 * 60 * 60 * 24))
        const weekIdx = Math.floor(diffDays / 7)
        
        if (weekIdx >= 0 && weekIdx < 4 && tx.type === 'expense') {
          weeks[3 - weekIdx] += parseFloat(tx.amount) // Reverse to show chronological
        }
      })

      return [
        { name: 'Week 1', spent: weeks[0] },
        { name: 'Week 2', spent: weeks[1] },
        { name: 'Week 3', spent: weeks[2] },
        { name: 'Week 4', spent: weeks[3] },
      ]
    }
  }

  const chartData = getChartData()

  const stats = [
    {
      label: 'Monthly Income',
      value: totalIncome,
      subValue: 'Total Budgeted',
      icon: TrendingUp,
      color: 'text-primary'
    },
    {
      label: 'Total Expenses',
      value: totalSpent,
      subValue: 'Current Month',
      icon: TrendingDown,
      color: 'text-foreground'
    },
    {
      label: 'Available Savings',
      value: remaining,
      subValue: 'Remaining Cash',
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
          <h2 className="text-2xl font-bold text-foreground capitalize">Welcome back, {user?.fullName?.split(' ')[0] || 'Member'}!</h2>
          <p className="text-sm text-foreground-muted mt-0.5">Here's what's happening with your BDT finances today.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto overflow-visible">
          <MonthPicker />
          <Link to="/transactions" className="hidden sm:block">
            <Button className="gap-2 shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4" /> Add Transaction
            </Button>
          </Link>
        </div>
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
              <Badge variant="glass" className="text-[10px] font-bold text-foreground-muted">
                LIVE DATA
              </Badge>
            </div>
            <p className="text-sm font-medium text-foreground-muted">{stat.label}</p>
            <h3 className="text-2xl font-bold font-mono mt-1">{formatCurrency(stat.value)}</h3>
            <p className="text-[10px] text-foreground-subtle font-bold uppercase tracking-wider mt-2">{stat.subValue}</p>
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
            <div>
               <h3 className="text-lg font-bold text-foreground">Spending Analytics</h3>
               <p className="text-xs text-foreground-muted">
                 {selectedMonth !== null ? 'Weekly breakdown for month' : 'Last 4 weeks trend'}
               </p>
            </div>
            <div className="p-2 rounded-xl bg-surface-active cursor-pointer">
              <TrendingUpIcon className="w-4 h-4 text-primary" />
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
                  formatter={(value: any) => [`৳${value}`, 'Spending']}
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
                <div className="w-16 h-16 rounded-3xl bg-surface-active flex items-center justify-center mb-4">
                  <Target className="w-8 h-8 text-foreground-subtle" />
                </div>
                <p className="text-sm text-foreground-muted mb-4 uppercase tracking-widest font-bold">No Active Budget</p>
                <Link to="/budget">
                  <Button variant="glass" size="sm" className="rounded-xl px-6">Set Budget Now</Button>
                </Link>
               </div>
            ) : (
              <>
                <div className="relative h-44 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-5xl font-black font-mono tracking-tighter">{formatPercentage(spentPct, 0)}</p>
                    <p className="text-[10px] text-foreground-muted uppercase tracking-[0.2em] font-bold mt-2">Overall Limit Spent</p>
                  </div>
                  <svg className="absolute w-44 h-44 transform -rotate-90">
                    <circle cx="88" cy="88" r="78" stroke="rgba(255,255,255,0.03)" strokeWidth="12" fill="transparent" />
                    <circle 
                      cx="88" cy="88" r="78" 
                      stroke="var(--color-primary)" 
                      strokeWidth="12" 
                      fill="transparent" 
                      strokeDasharray={490} 
                      strokeDashoffset={490 - (490 * Math.min(spentPct, 100)) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <div className="space-y-5 px-4">
                  {(budget?.items || []).slice(0, 3).map((item: any) => {
                    const pct = Math.min((parseFloat(item.spentAmount) / parseFloat(item.allocatedAmount)) * 100, 100)
                    return (
                      <div key={item.id} className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                          <span className="text-foreground-muted">{item.category?.name}</span>
                          <span className="text-foreground">{formatPercentage(pct, 0)}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-surface-active overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${pct}%` }} 
                            className="h-full bg-primary rounded-full shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.3)]" 
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
        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">Recent Activity</h3>
          <Link to="/transactions" className="p-2.5 rounded-xl bg-surface-active hover:bg-surface-hover transition-colors">
            <ArrowRight className="w-5 h-5 text-foreground-muted" />
          </Link>
        </div>
        <div className="divide-y divide-white/5">
          {txLoading ? (
            <div className="p-20 text-center text-foreground-muted text-sm font-medium">Synchronizing transactions...</div>
          ) : latestTransactions.length === 0 ? (
            <div className="p-24 text-center">
              <div className="w-16 h-16 rounded-full bg-surface-active flex items-center justify-center mx-auto mb-4 border border-white/5">
                <Wallet className="w-8 h-8 text-foreground-subtle" />
              </div>
              <p className="text-sm text-foreground-muted font-medium">No transactions recorded yet.</p>
              <Link to="/transactions" className="text-xs text-primary font-bold hover:underline mt-2 inline-block uppercase tracking-widest">Start recording now</Link>
            </div>
          ) : latestTransactions.map((tx: any) => (
            <div key={tx.id} className="px-8 py-5 flex items-center justify-between hover:bg-white/5 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-surface-active border border-white/5 flex items-center justify-center font-bold text-xs group-hover:scale-110 transition-transform">
                  {tx.category?.name?.charAt(0) || '?'}
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{tx.description}</p>
                  <p className="text-[10px] text-foreground-muted font-bold uppercase tracking-widest mt-0.5">{tx.category?.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={cn("text-sm font-black font-mono tracking-tight", tx.type === 'income' ? 'text-primary' : 'text-foreground')}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(parseFloat(tx.amount))}
                </p>
                <p className="text-[10px] text-foreground-subtle font-bold uppercase tracking-tighter mt-1">{formatDate(tx.transactionDate)}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
