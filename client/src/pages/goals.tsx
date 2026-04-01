import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Calendar, TrendingUp, X, Target, Loader2, Trash2 } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useGoals } from '@/hooks/use-goals'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const priorityColors = {
  high: 'bg-destructive/15 text-destructive',
  medium: 'bg-warning/15 text-warning',
  low: 'bg-accent/15 text-accent',
}

const statusColors = {
  active: 'bg-primary/15 text-primary',
  completed: 'bg-primary text-white',
  paused: 'bg-surface-active text-foreground-muted',
}

export default function GoalsPage() {
  const { goals, isLoading, createGoal, isCreating, updateGoal, deleteGoal } = useGoals()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<any>(null)
  const [updateAmount, setUpdateAmount] = useState('')
  
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    currentAmount: '',
    monthlyContribution: '',
    targetDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    priority: 'medium' as 'high' | 'medium' | 'low',
  })

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    await createGoal({
      ...formData,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount || '0'),
      monthlyContribution: formData.monthlyContribution ? parseFloat(formData.monthlyContribution) : null,
    })
    setIsModalOpen(false)
    setFormData({
      title: '',
      targetAmount: '',
      currentAmount: '',
      monthlyContribution: '',
      targetDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      priority: 'medium',
    })
  }

  const handleUpdateProgress = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedGoal) return
    const newAmount = parseFloat(selectedGoal.currentAmount) + parseFloat(updateAmount)
    await updateGoal({
      id: selectedGoal.id,
      data: { 
        currentAmount: newAmount,
        status: newAmount >= parseFloat(selectedGoal.targetAmount) ? 'completed' : 'active'
      }
    })
    setIsUpdateModalOpen(false)
    setUpdateAmount('')
    setSelectedGoal(null)
  }

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto pb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Financial Goals</h2>
          <p className="text-sm text-foreground-muted mt-0.5">Track your progress towards financial milestones</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 shadow-glow-primary h-11 rounded-2xl px-6">
          <Plus className="w-4 h-4" />
          New Goal
        </Button>
      </div>

      {goals.length === 0 ? (
        <div className="glass rounded-[2.5rem] p-20 text-center border border-dashed border-white/10">
          <div className="w-20 h-20 rounded-3xl bg-surface-active flex items-center justify-center mx-auto mb-6">
            <Target className="w-10 h-10 text-foreground-subtle" />
          </div>
          <h3 className="text-xl font-bold text-foreground">No financial goals set yet</h3>
          <p className="text-sm text-foreground-muted max-w-xs mx-auto mt-2">
            Define your milestones—like an emergency fund or a new car—and track your progress.
          </p>
          <Button onClick={() => setIsModalOpen(true)} variant="outline" className="mt-8 rounded-2xl px-8">
            Set Your First Goal
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal: any, i: number) => {
            const target = parseFloat(goal.targetAmount)
            const current = parseFloat(goal.currentAmount)
            const pct = Math.min((current / target) * 100, 100)
            const remaining = target - current
            const radius = 45
            const circumference = 2 * Math.PI * radius
            const offset = circumference - (pct / 100) * circumference

            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-[2rem] p-7 hover:bg-surface-hover/50 transition-all group relative overflow-hidden"
              >
                <div className="flex items-start justify-between mb-6 relative z-10">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-foreground tracking-tight">{goal.title}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={cn('text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest', priorityColors[goal.priority as keyof typeof priorityColors])}>
                        {goal.priority}
                      </span>
                      <span className={cn('text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest', statusColors[goal.status as keyof typeof statusColors])}>
                        {goal.status}
                      </span>
                    </div>
                  </div>

                  {/* Progress ring */}
                  <div className="relative w-20 h-20 shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="8" />
                      <motion.circle
                        cx="50" cy="50" r={radius} fill="none"
                        stroke={goal.status === 'completed' ? 'var(--color-primary)' : 'var(--color-accent)'}
                        strokeWidth="8" strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.5, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-black text-foreground">{Math.round(pct)}%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 relative z-10">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm font-bold">
                      <span className="text-foreground-muted uppercase tracking-widest text-[10px]">Progress</span>
                      <span className="text-foreground font-mono">
                        {formatCurrency(current)} <span className="text-foreground-subtle">/ {formatCurrency(target)}</span>
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full bg-surface-active overflow-hidden p-0.5 border border-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                        className="h-full rounded-full shadow-[0_0_12px_-2px_rgba(var(--color-accent-rgb),0.5)]"
                        style={{ background: goal.status === 'completed' ? 'var(--color-primary)' : 'var(--color-accent)' }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-4">
                      <div className="flex flex-col gap-2">
                         <div className="flex items-center gap-1.5 text-xs font-bold text-foreground-subtle">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Expires {formatDate(goal.targetDate)}</span>
                        </div>
                        {parseFloat(goal.monthlyContribution || '0') > 0 && (
                          <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span>{formatCurrency(parseFloat(goal.monthlyContribution))} / month</span>
                          </div>
                        )}
                      </div>
                      {remaining > 0 && (
                        <p className="text-[10px] font-black text-foreground-muted uppercase tracking-widest">
                          {formatCurrency(remaining)} remaining to target
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                       <button
                        onClick={() => deleteGoal(goal.id)}
                        className="p-3 rounded-2xl bg-surface-active text-foreground-subtle hover:text-destructive hover:bg-destructive/10 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                      {goal.status !== 'completed' && (
                        <Button 
                          variant="glass" 
                          size="sm" 
                          className="rounded-xl h-10 px-4 font-bold text-[10px] tracking-widest uppercase"
                          onClick={() => {
                            setSelectedGoal(goal)
                            setIsUpdateModalOpen(true)
                          }}
                        >
                          Add Savings
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* New Goal Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg glass-strong rounded-[2.5rem] p-8 border border-white/10 shadow-3xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-primary/20 flex items-center justify-center">
                    <Target className="w-5.5 h-5.5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">New Financial Goal</h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2.5 rounded-xl hover:bg-white/5 text-foreground-muted hover:text-foreground">
                  <X className="w-5.5 h-5.5" />
                </button>
              </div>

              <form onSubmit={handleCreateGoal} className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-[0.2em] mb-2.5 ml-1 block">Goal Title</label>
                  <Input
                    required
                    placeholder="e.g. New Electric Car"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="h-12 rounded-2xl bg-surface/30 border-white/5 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-[0.2em] mb-2.5 ml-1 block">Target (৳)</label>
                    <Input
                      required
                      type="number"
                      placeholder="0.00"
                      value={formData.targetAmount}
                      onChange={e => setFormData({ ...formData, targetAmount: e.target.value })}
                      className="h-12 rounded-2xl bg-surface/30 border-white/5 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-[0.2em] mb-2.5 ml-1 block">Starting (৳)</label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={formData.currentAmount}
                      onChange={e => setFormData({ ...formData, currentAmount: e.target.value })}
                      className="h-12 rounded-2xl bg-surface/30 border-white/5 font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                   <div>
                    <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-[0.2em] mb-2.5 ml-1 block">Monthly (৳)</label>
                    <Input
                      type="number"
                      placeholder="Optional"
                      value={formData.monthlyContribution}
                      onChange={e => setFormData({ ...formData, monthlyContribution: e.target.value })}
                      className="h-12 rounded-2xl bg-surface/30 border-white/5 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-[0.2em] mb-2.5 ml-1 block">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={e => setFormData({ ...formData, priority: e.target.value as any })}
                      className="w-full h-12 px-4 rounded-2xl bg-surface/30 border border-white/5 text-sm font-bold focus:outline-none focus:border-primary/50 transition-all appearance-none"
                    >
                      <option value="high">High Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="low">Low Priority</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-[0.2em] mb-2.5 ml-1 block">Target Date</label>
                  <Input
                    required
                    type="date"
                    value={formData.targetDate}
                    onChange={e => setFormData({ ...formData, targetDate: e.target.value })}
                    className="h-12 rounded-2xl bg-surface/30 border-white/5 font-medium"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="button" variant="glass" className="flex-1 h-12 rounded-2xl" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button type="submit" className="flex-1 h-12 rounded-2xl font-bold" disabled={isCreating}>
                    {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Goal'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Update Progress Modal */}
      <AnimatePresence>
        {isUpdateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUpdateModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm glass-strong rounded-[2.5rem] p-8 border border-white/10 shadow-3xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold">Add to {selectedGoal?.title}</h3>
                <button onClick={() => setIsUpdateModalOpen(false)} className="p-2.5 rounded-xl hover:bg-white/5 text-foreground-muted">
                  <X className="w-5.5 h-5.5" />
                </button>
              </div>

              <form onSubmit={handleUpdateProgress} className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-[0.2em] mb-2.5 ml-1 block">Amount to Add (৳)</label>
                  <Input
                    required
                    type="number"
                    autoFocus
                    placeholder="0.00"
                    value={updateAmount}
                    onChange={e => setUpdateAmount(e.target.value)}
                    className="h-14 rounded-2xl bg-surface/30 border-white/5 text-xl font-mono font-black text-primary text-center"
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="button" variant="glass" className="flex-1 h-12 rounded-2xl" onClick={() => setIsUpdateModalOpen(false)}>Cancel</Button>
                  <Button type="submit" className="flex-1 h-12 rounded-2xl font-bold">Update Progress</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
