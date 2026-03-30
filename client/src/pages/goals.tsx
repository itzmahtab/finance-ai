import { motion } from 'framer-motion'
import { Plus, Calendar, TrendingUp } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'

const goals = [
  { id: '1', title: 'Emergency Fund', target: 15000, current: 8500, monthly: 500, date: '2026-12-31', priority: 'high' as const, status: 'active' as const },
  { id: '2', title: 'Vacation to Japan', target: 5000, current: 3200, monthly: 300, date: '2026-09-01', priority: 'medium' as const, status: 'active' as const },
  { id: '3', title: 'New Laptop', target: 2000, current: 2000, monthly: 0, date: '2026-03-15', priority: 'low' as const, status: 'completed' as const },
  { id: '4', title: 'Home Down Payment', target: 50000, current: 12000, monthly: 1000, date: '2028-06-01', priority: 'high' as const, status: 'active' as const },
]

const priorityColors = {
  high: 'bg-destructive/15 text-destructive',
  medium: 'bg-warning/15 text-warning',
  low: 'bg-chart-1/15 text-chart-1',
}

const statusColors = {
  active: 'bg-primary/15 text-primary',
  completed: 'bg-primary text-white',
  paused: 'bg-surface-active text-foreground-muted',
}

export default function GoalsPage() {
  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Financial Goals</h2>
          <p className="text-sm text-foreground-muted mt-0.5">Track your progress towards financial milestones</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" />
          New Goal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {goals.map((goal, i) => {
          const pct = Math.min((goal.current / goal.target) * 100, 100)
          const remaining = goal.target - goal.current
          const radius = 45
          const circumference = 2 * Math.PI * radius
          const offset = circumference - (pct / 100) * circumference

          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 hover:shadow-card-hover transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-base font-semibold text-foreground">{goal.title}</h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase', priorityColors[goal.priority])}>
                      {goal.priority}
                    </span>
                    <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase', statusColors[goal.status])}>
                      {goal.status}
                    </span>
                  </div>
                </div>

                {/* Progress ring */}
                <div className="relative w-[80px] h-[80px] shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r={radius} fill="none" stroke="hsl(222 30% 16%)" strokeWidth="7" />
                    <motion.circle
                      cx="50" cy="50" r={radius} fill="none"
                      stroke={goal.status === 'completed' ? 'var(--color-primary)' : 'var(--color-accent)'}
                      strokeWidth="7" strokeLinecap="round"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset: offset }}
                      transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-foreground">{Math.round(pct)}%</span>
                  </div>
                </div>
              </div>

              {/* Amount progress */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground-muted">Progress</span>
                  <span className="font-medium text-foreground">
                    {formatCurrency(goal.current)} / {formatCurrency(goal.target)}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-surface-active overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
                    className="h-full rounded-full"
                    style={{ background: goal.status === 'completed' ? 'var(--color-primary)' : 'var(--color-accent)' }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-foreground-subtle">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Target: {formatDate(goal.date)}
                  </div>
                  {goal.monthly > 0 && (
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {formatCurrency(goal.monthly)}/mo
                    </div>
                  )}
                </div>

                {remaining > 0 && (
                  <p className="text-xs text-foreground-subtle">
                    {formatCurrency(remaining)} remaining
                  </p>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
