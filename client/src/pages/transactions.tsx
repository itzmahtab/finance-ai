import React, { useState, useRef, useEffect } from 'react'

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
  ShoppingCart,
  ChevronDown,
  MoreHorizontal,
  Trash2,
  Loader2
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
  Other: MoreHorizontal,
}

export default function TransactionsPage() {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false)
  const { transactions, categories, isLoading, createTransaction, isSubmitting, deleteTransaction, importTransactions, isImporting } = useTransactions()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form state
  const [form, setForm] = useState({
    description: '',
    amount: '',
    categoryId: '',
    type: 'expense',
    transactionDate: new Date().toISOString().split('T')[0],
  })

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string
        const lines = text.split('\n').filter(line => line.trim())
        
        // Basic parser assuming columns: Date, Description, Amount, Category, Type
        const parsedData = lines.slice(1).map(line => {
          const [date, description, amount, category, type] = line.split(',')
          
          // Try to find matching category, otherwise use "Other"
          const cat = categories.find((c: any) => c.name.toLowerCase() === category?.trim().toLowerCase()) 
            || categories.find((c: any) => c.name === 'Other')

          return {
            transactionDate: date?.trim() || new Date().toISOString().split('T')[0],
            description: description?.trim() || 'Imported Transaction',
            amount: Math.abs(parseFloat(amount?.trim() || '0')).toString(),
            categoryId: cat?.id || 1,
            type: type?.trim().toLowerCase() === 'income' ? 'income' : 'expense'
          }
        })

        if (parsedData.length > 0) {
          await importTransactions(parsedData)
        }
      } catch (err) {
        console.error("Failed to parse CSV", err)
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    }
    reader.readAsText(file)
  }

  const selectedCategory = categories.find((c: any) => c.id.toString() === form.categoryId)


  return (
    <div className="space-y-6 max-w-[1200px] mx-auto pb-10">
      {/* Action bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Transactions</h2>
          <p className="text-sm text-foreground-muted mt-0.5">Track all your income and expenses</p>
        </div>
        <div className="flex items-center gap-2">
          <input 
            type="file" 
            accept=".csv" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleImportCSV} 
          />
          <Button 
            variant="glass" 
            size="sm" 
            className="hidden sm:flex gap-2 text-foreground-muted hover:text-foreground"
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
          >
            {isImporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {isImporting ? 'Importing...' : 'Import CSV'}
          </Button>
          <Button

            onClick={() => setIsModalOpen(true)}
            className="gap-2 shadow-glow-primary hover:scale-[1.02] transition-transform"
          >
            <Plus className="w-4 h-4" /> Add Transaction
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-foreground-subtle" />
          <Input
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 h-11 rounded-2xl bg-surface/50 border-white/5 focus:border-primary/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-surface border border-white/5 shadow-sm">
          {(['all', 'income', 'expense'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-5 py-1.5 rounded-xl text-sm font-semibold transition-all capitalize',
                filter === f
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-foreground-muted hover:text-foreground hover:bg-white/5'
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction list */}
      <div className="glass rounded-3xl overflow-hidden border border-white/5 shadow-xl">
        <div className="hidden sm:grid grid-cols-[1fr_160px_120px_110px_40px] gap-4 px-8 py-4 border-b border-white/5 text-[10px] font-bold text-foreground-subtle uppercase tracking-widest">
          <span>Transaction Detail</span>
          <span>Category</span>
          <span className="text-right">Amount</span>
          <span className="text-right">Date</span>
          <span />
        </div>

        <div className="divide-y divide-white/5">

          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="px-8 py-5 animate-pulse flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-surface-active" />
                  <div className="space-y-2">
                    <div className="h-4 w-40 bg-surface-active rounded" />
                    <div className="h-3 w-20 bg-surface-active rounded opacity-50" />
                  </div>
                </div>
                <div className="h-5 w-24 bg-surface-active rounded" />
              </div>
            ))
          ) : filtered.length > 0 ? (
            filtered.map((tx: any, i: number) => {
              const Icon = categoryIcons[tx.category?.name] || ArrowLeftRight
              return (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.015 }}
                  className="flex flex-col sm:grid sm:grid-cols-[1fr_160px_120px_110px_40px] gap-4 px-5 sm:px-8 py-4 hover:bg-white/5 transition-all group"
                >
                  {/* Mobile Row Headers + Details */}
                  <div className="flex items-center justify-between sm:contents">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-surface-active flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-primary/5 transition-all shadow-sm">
                        <Icon className="w-5.5 h-5.5 text-foreground-muted group-hover:text-primary transition-colors" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">{tx.description}</p>
                        <p className="text-[10px] text-foreground-subtle font-bold uppercase tracking-tight sm:hidden mt-0.5">{tx.category?.name}</p>
                      </div>
                    </div>

                    {/* Mobile Details Area */}
                    <div className="flex sm:hidden items-center gap-3 shrink-0">
                      <div className="flex flex-col items-end gap-1">
                        <span className={cn('text-sm font-bold tracking-tight leading-none', tx.type === 'income' ? 'text-primary' : 'text-foreground')}>
                          {tx.type === 'income' ? '৳' : '-৳'}{parseFloat(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-[10px] font-bold text-foreground-subtle uppercase tracking-tighter leading-none">{formatDate(tx.transactionDate)}</span>
                      </div>
                      <button 
                        onClick={() => deleteTransaction(tx.id)}
                        className="p-2 -mr-2 rounded-xl text-foreground-subtle hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </div>

                  {/* Desktop Only Columns */}
                  <div className="hidden sm:flex items-center">
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-surface-active border border-white/5">
                      <Icon className="w-3.5 h-3.5 text-foreground-muted" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted">
                        {tx.category?.name}
                      </span>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center justify-end">
                    <span className={cn('text-sm font-bold tracking-tight', tx.type === 'income' ? 'text-primary' : 'text-foreground')}>
                      {tx.type === 'income' ? '৳' : '-৳'}{parseFloat(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="hidden sm:flex items-center justify-end">
                    <span className="text-[10px] font-bold text-foreground-subtle uppercase tracking-tighter">{formatDate(tx.transactionDate)}</span>
                  </div>
                  <div className="hidden sm:flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => deleteTransaction(tx.id)}
                      className="p-2 rounded-xl text-foreground-subtle hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )
            })

          ) : (
            <div className="text-center py-24">
              <div className="w-20 h-20 rounded-3xl bg-surface-active flex items-center justify-center mx-auto mb-6 shadow-sm border border-white/5">
                <Search className="w-10 h-10 text-foreground-subtle" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">No transactions matching your search</h3>
              <p className="text-sm text-foreground-muted max-w-xs mx-auto">
                Try adjusting your filters or search terms to find what you're looking for.
              </p>
              <Button
                variant="outline"
                onClick={() => { setFilter('all'); setSearchQuery('') }}
                className="mt-8 h-10 rounded-xl px-8"
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Add Transaction Modal */}
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
                    <Plus className="w-5.5 h-5.5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Record Transaction</h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2.5 rounded-xl hover:bg-white/5 text-foreground-muted hover:text-foreground transition-all"
                >
                  <X className="w-5.5 h-5.5" />
                </button>
              </div>

              <form onSubmit={handleAddTransaction} className="space-y-6">
                <div className="grid grid-cols-2 gap-4 p-1.5 rounded-2xl bg-surface/50 border border-white/5 shadow-inner">
                  {(['income', 'expense'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, type }))}
                      className={cn(
                        'py-2.5 rounded-xl text-sm font-bold transition-all capitalize',
                        form.type === type
                          ? 'bg-primary text-white shadow-xl shadow-primary/30'
                          : 'text-foreground-muted hover:text-foreground hover:bg-white/5'
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-[0.2em] mb-2.5 ml-1 block">
                      Description
                    </label>
                    <Input
                      placeholder="What was this for?"
                      value={form.description}
                      onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      required
                      className="h-12 rounded-2xl bg-surface/30 border-white/5 focus:border-primary/50 transition-all text-sm font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-[0.2em] mb-2.5 ml-1 block">
                        Amount (৳)
                      </label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={form.amount}
                        onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                        required
                        className="h-12 rounded-2xl bg-surface/30 border-white/5 focus:border-primary/50 transition-all font-mono font-bold"
                      />
                    </div>
                    <div className="relative" ref={dropdownRef}>
                      <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-[0.2em] mb-2.5 ml-1 block">
                        Category
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                        className={cn(
                          "w-full h-12 flex items-center justify-between px-4 rounded-2xl bg-surface/30 border border-white/5 text-sm font-medium transition-all hover:bg-white/5 group",
                          !form.categoryId && "text-foreground-subtle",
                          isCategoryDropdownOpen && "border-primary/50 ring-2 ring-primary/10"
                        )}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {selectedCategory ? (
                            <>
                              <span className="shrink-0">{categoryIcons[selectedCategory.name] ? React.createElement(categoryIcons[selectedCategory.name], { className: "w-4 h-4 text-primary" }) : <ArrowLeftRight className="w-4 h-4" />}</span>
                              <span className="truncate">{selectedCategory.name}</span>
                            </>
                          ) : (
                            "Select Category"
                          )}
                        </div>
                        <ChevronDown className={cn("w-4 h-4 text-foreground-subtle transition-transform duration-300", isCategoryDropdownOpen && "rotate-180")} />
                      </button>

                      <AnimatePresence>
                        {isCategoryDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute z-50 left-0 right-0 mt-2 p-2 glass-strong rounded-[1.5rem] border border-white/10 shadow-3xl max-h-[220px] overflow-y-auto custom-scrollbar translate-y-2 pointer-events-auto"
                          >
                            <div className="grid grid-cols-1 gap-1">
                              {categories.map((cat: any) => {
                                const Icon = categoryIcons[cat.name] || ArrowLeftRight
                                return (
                                  <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => {
                                      setForm(f => ({ ...f, categoryId: cat.id.toString() }))
                                      setIsCategoryDropdownOpen(false)
                                    }}
                                    className={cn(
                                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all hover:bg-white/10 text-left",
                                      form.categoryId === cat.id.toString() ? "bg-primary/20 text-primary" : "text-foreground-muted"
                                    )}
                                  >
                                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", form.categoryId === cat.id.toString() ? "bg-primary/20" : "bg-white/5")}>
                                      <Icon className="w-4 h-4" />
                                    </div>
                                    <span className="flex-1">{cat.name}</span>
                                  </button>
                                )
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-[0.2em] mb-2.5 ml-1 block">
                      Transaction Date
                    </label>
                    <Input
                      type="date"
                      value={form.transactionDate}
                      onChange={e => setForm(f => ({ ...f, transactionDate: e.target.value }))}
                      required
                      className="h-12 rounded-2xl bg-surface/30 border-white/5 focus:border-primary/50 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="glass"
                    className="flex-1 h-12 rounded-2xl font-bold border-white/5 hover:bg-white/5 transition-all text-foreground-muted"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-12 rounded-2xl font-bold shadow-glow-primary hover:scale-[1.02] transition-all"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Record'}
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

// Helper to use React within the component context without needing top-level import for createElement

