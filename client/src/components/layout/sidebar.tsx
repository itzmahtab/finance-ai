import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/ui.store'
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  TrendingUp,
  Target,
  Bot,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Banknote,
  X,
} from 'lucide-react'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { path: '/budget', label: 'Budget', icon: Wallet },
  { path: '/investments', label: 'Investments', icon: TrendingUp },
  { path: '/goals', label: 'Goals', icon: Target },
  { path: '/ai-advisor', label: 'AI Advisor', icon: Bot },
  { path: '/reports', label: 'Reports', icon: FileText },
  { path: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const collapsed = useUIStore((s) => s.sidebarCollapsed)
  const mobileOpen = useUIStore((s) => s.sidebarMobileOpen)
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)
  const setSidebarMobileOpen = useUIStore((s) => s.setSidebarMobileOpen)
  const location = useLocation()

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full flex flex-col',
          'glass-strong transition-all duration-300 ease-in-out',
          'border-r border-border',
          collapsed ? 'w-[72px]' : 'w-[260px]',
          'max-lg:translate-x-[-100%] lg:translate-x-0',
          mobileOpen && 'max-lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-border shrink-0">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl gradient-primary shrink-0">
            <Banknote className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="text-lg font-bold gradient-text-primary whitespace-nowrap overflow-hidden"
              >
                FinanceAI
              </motion.span>
            )}
          </AnimatePresence>

          {/* Mobile close button */}
          <button
            onClick={() => setSidebarMobileOpen(false)}
            className="ml-auto lg:hidden p-1 rounded-lg hover:bg-surface-hover text-foreground-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl',
                  'transition-all duration-200 group relative',
                  'text-sm font-medium',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground-muted hover:text-foreground hover:bg-surface-hover'
                )}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}

                <item.icon
                  className={cn(
                    'w-5 h-5 shrink-0 transition-colors',
                    isActive ? 'text-primary' : 'text-foreground-subtle group-hover:text-foreground-muted'
                  )}
                />

                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Tooltip when collapsed */}
                {collapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-surface-active text-foreground text-xs font-medium opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                    {item.label}
                  </div>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Collapse toggle (desktop only) */}
        <div className="hidden lg:flex items-center justify-center py-3 border-t border-border">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-surface-hover text-foreground-muted hover:text-foreground transition-colors"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
      </aside>
    </>
  )
}
