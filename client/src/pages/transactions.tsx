import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeftRight,
  Plus,
  Search,
  Upload,
  ShoppingBag,
  Home,
  DollarSign,
  Coffee,
  Zap,
  Car,
  Utensils,
  Briefcase,
  Heart,
  GraduationCap,
  X,
  Shield,
  LineChart,
  Coins,
  Lock,
  Play,
  Plane,
  ShoppingCart
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrency, formatDate } from '@/lib/format'
import { useTransactions } from '@/hooks/use-transactions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const categoryIcons: Record<string, any> = {
  Shopping: ShoppingBag,
  Housing: Home,
  Income: DollarSign,
  'Food & Drink': Coffee,
  'Food & Groceries': ShoppingCart,
  Utilities: Zap,
  Transportation: Car,
  Dining: Utensils,
  'Dining & Cafe': Utensils,
  Work: Briefcase,
  Health: Heart,
  Education: GraduationCap,
  'Emergency Fund': Shield,
  Stocks: LineChart,
  Crypto: Coins,
  'Fixed Deposit': Lock,
  Entertainment: Play,
  Travel: Plane,
}

export default function TransactionsPage() {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { transactions, categories, isLoading, createTransaction, isSubmitting } = useTransactions()

  // Form state
  const [form, setForm] = useState({
    description: '',
    amount: '',
    categoryId: '',
    type: 'expense',
    transactionDate: new Date().toISOString().split('T')[0],
  })

  const filtered = transactions.filter((t: any) => {
    if (filter !== 'all' && t.type !== filter) return false
    if (searchQuery && !t.description?.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.categoryId || !form.amount) return
    
    try {
      await createTransaction({
        ...form,
        amount: parseFloat(form.amount),
        categoryId: parseInt(form.categoryId),
      })
      setIsModalOpen(false)
      setForm({
        description: '',
        amount: '',
        categoryId: '',
        type: 'expense',
        transactionDate: new Date().toISOString().split('T')[0],
      })
    } catch (err) {
      // Handled by hook
    }
  }

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      {/* Action bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Transactions</h2>
          <p className="text-sm text-foreground-muted mt-0.5">Track all your income and expenses</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="glass" size="sm" className="hidden sm:flex gap-2">
            <Upload className="w-4 h-4" /> Import CSV
          </Button>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="gap-2"
          >
            <Plus className="w-4 h-4" /> Add Transaction
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-subtle" />
          <Input
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-1 p-1 rounded-xl bg-surface border border-border">
          {(['all', 'income', 'expense'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize',
                filter === f
                  ? 'bg-primary/15 text-primary'
                  : 'text-foreground-muted hover:text-foreground'
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction list */}
      <Card className="p-0 overflow-hidden">
        {/* Table header */}
        <div className="hidden sm:grid grid-cols-[1fr_140px_120px_100px] gap-4 px-6 py-3 border-b border-border text-[10px] font-bold text-foreground-subtle uppercase tracking-widest">
          <span>Transaction</span>
          <span>Category</span>
          <span className="text-right">Amount</span>
          <span className="text-right">Date</span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-border">
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="px-6 py-4 animate-pulse flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-active" />
                  <div className="h-4 w-32 bg-surface-active rounded" />
                </div>
                <div className="h-4 w-20 bg-surface-active rounded" />
              </div>
            ))
          ) : filtered.map((tx: any, i: number) => {
            const Icon = categoryIcons[tx.category?.name] || ArrowLeftRight
            return (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                className="grid grid-cols-1 sm:grid-cols-[1fr_140px_120px_100px] gap-2 sm:gap-4 px-6 py-4 hover:bg-surface-hover transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-active flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5 text-foreground-muted" />
                  </div>
                  <span className="text-sm font-medium text-foreground truncate">{tx.description}</span>
                </div>
                <div className="flex items-center">
                  <Badge variant="glass" className="text-[10px] py-0.5 px-2">
                    {tx.category?.name}
                  </Badge>
                </div>
                <div className="flex items-center justify-end font-mono">
                  <span
                    className={cn(
                      'text-sm font-bold',
                      tx.type === 'income' ? 'text-primary' : 'text-foreground'
                    )}
                  >
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(parseFloat(tx.amount))}
                  </span>
                </div>
                <div className="flex items-center justify-end">
                  <span className="text-xs text-foreground-subtle">{formatDate(tx.transactionDate)}</span>
                </div>
              </motion.div>
            )
          })}
        </div>

        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-20 bg-surface/30">
            <div className="w-16 h-16 rounded-full bg-surface-active flex items-center justify-center mx-auto mb-4">
              <ArrowLeftRight className="w-8 h-8 text-foreground-subtle" />
            </div>
            <p className="text-sm text-foreground-muted">No transactions found</p>
            <Button
              variant="link"
              onClick={() => { setFilter('all'); setSearchQuery('') }}
              className="mt-2 text-primary"
            >
              Clear filters
            </Button>
          </div>
        )}
      </Card>

      {/* Add Transaction Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg glass-strong rounded-3xl p-8 border border-border shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-foreground">Add Transaction</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl hover:bg-surface-hover text-foreground-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddTransaction} className="space-y-6">
                <div className="grid grid-cols-2 gap-4 p-1 rounded-xl bg-surface border border-border">
                  {(['income', 'expense'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, type }))}
                      className={cn(
                        'py-2 rounded-lg text-sm font-semibold transition-all capitalize',
                        form.type === type
                          ? 'bg-primary text-white shadow-lg shadow-primary/20'
                          : 'text-foreground-muted hover:text-foreground'
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-foreground-muted uppercase tracking-wider mb-2 block">
                      Description
                    </label>
                    <Input
                      placeholder="e.g., Monthly Rent"
                      value={form.description}
                      onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-foreground-muted uppercase tracking-wider mb-2 block">
                        Amount (BDT)
                      </label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={form.amount}
                        onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-foreground-muted uppercase tracking-wider mb-2 block">
                        Category
                      </label>
                      <select
                        value={form.categoryId}
                        onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-all appearance-none"
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat: any) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-foreground-muted uppercase tracking-wider mb-2 block">
                      Transaction Date
                    </label>
                    <Input
                      type="date"
                      value={form.transactionDate}
                      onChange={e => setForm(f => ({ ...f, transactionDate: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="glass"
                    className="flex-1"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Transaction'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
