import { useMemo, useState, useRef, useEffect } from 'react'
import { Calendar, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTransactions } from '@/hooks/use-transactions'
import { useFilterStore } from '@/stores/filter.store'

export function MonthPicker() {
  const { transactions } = useTransactions()
  const { selectedMonth, selectedYear, setMonthFilter } = useFilterStore()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Extract unique year-months from transactions
  const availableMonths = useMemo(() => {
    const dates = new Set<string>()
    const now = new Date()
    
    // Always include current month
    dates.add(`${now.getFullYear()}-${now.getMonth()}`)

    transactions.forEach((tx: any) => {
      const d = new Date(tx.transactionDate)
      if (!isNaN(d.getTime())) {
        dates.add(`${d.getFullYear()}-${d.getMonth()}`)
      }
    })

    return Array.from(dates)
      .map(d => {
        const [y, m] = d.split('-')
        return {
          year: parseInt(y),
          month: parseInt(m)
        }
      })
      .sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year
        return b.month - a.month
      })
  }, [transactions])

  // Get display string for current selection
  const currentLabel = useMemo(() => {
    if (selectedMonth === null || selectedYear === null) return 'All Time'
    const date = new Date(selectedYear, selectedMonth)
    return date.toLocaleString('default', { month: 'long', year: 'numeric' })
  }, [selectedMonth, selectedYear])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={dropdownRef} className="relative z-40">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface border border-white/5 hover:bg-white/5 transition-all shadow-sm"
      >
        <Calendar className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold text-foreground whitespace-nowrap min-w-[100px] text-left">
          {currentLabel}
        </span>
        <ChevronDown className={`w-4 h-4 text-foreground-subtle transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 sm:left-0 top-full mt-2 w-48 rounded-xl bg-[#1A1A1A] border border-white/10 shadow-2xl overflow-hidden"
          >
            <div className="max-h-60 overflow-y-auto">
              <button
                onClick={() => {
                  setMonthFilter(null, null)
                  setOpen(false)
                }}
                className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-white/5 ${
                  selectedMonth === null ? 'bg-primary/10 text-primary' : 'text-foreground'
                }`}
              >
                All Time
              </button>
              
              {availableMonths.map((item) => {
                const isSelected = item.month === selectedMonth && item.year === selectedYear
                const date = new Date(item.year, item.month)
                const label = date.toLocaleString('default', { month: 'long', year: 'numeric' })

                return (
                  <button
                    key={`${item.year}-${item.month}`}
                    onClick={() => {
                      setMonthFilter(item.month, item.year)
                      setOpen(false)
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-white/5 ${
                      isSelected ? 'bg-primary/10 text-primary' : 'text-foreground'
                    }`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
