import { useLocation } from 'react-router-dom'
import { useUIStore } from '@/stores/ui.store'
import { useAuthStore } from '@/stores/auth.store'
import { Menu, Bell, Search, LogOut, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/transactions': 'Transactions',
  '/budget': 'Budget',
  '/investments': 'Investments',
  '/goals': 'Goals',
  '/ai-advisor': 'AI Advisor',
  '/reports': 'Reports',
  '/settings': 'Settings',
}

export function Header() {
  const location = useLocation()
  const setSidebarMobileOpen = useUIStore((s) => s.setSidebarMobileOpen)
  const user = useAuthStore((s) => s.user)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const { logout } = useAuth()

  const pageTitle = pageTitles[location.pathname] || 'FinanceAI'

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center gap-4 px-4 lg:px-6 border-b border-border glass-strong">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarMobileOpen(true)}
        className="lg:hidden p-2 rounded-lg hover:bg-surface-hover text-foreground-muted"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Page title */}
      <h1 className="text-lg font-semibold text-foreground">{pageTitle}</h1>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-surface border border-border text-sm text-foreground-muted w-64 hover:border-border-hover transition-colors cursor-pointer">
        <Search className="w-4 h-4" />
        <span>Search...</span>
        <kbd className="ml-auto text-xs bg-surface-hover px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
      </div>

      {/* Notifications */}
      <button
        className="relative p-2 rounded-lg hover:bg-surface-hover text-foreground-muted hover:text-foreground transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {/* Notification dot */}
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
      </button>

      {/* Profile dropdown */}
      <div ref={profileRef} className="relative">
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-surface-hover transition-colors"
        >
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-sm font-bold text-white">
            {user?.fullName?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <span className="hidden sm:block text-sm font-medium text-foreground max-w-[120px] truncate">
            {user?.fullName || user?.email || 'User'}
          </span>
        </button>

        {/* Dropdown */}
        {profileOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 rounded-xl glass-strong border border-border shadow-lg animate-scale-in overflow-hidden">
            <div className="p-3 border-b border-border">
              <p className="text-sm font-medium text-foreground truncate">
                {user?.fullName || 'User'}
              </p>
              <p className="text-xs text-foreground-muted truncate">
                {user?.email || 'user@example.com'}
              </p>
            </div>
            <div className="p-1.5">
              <button
                onClick={() => { setProfileOpen(false) }}
                className={cn(
                  'flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm',
                  'text-foreground-muted hover:text-foreground hover:bg-surface-hover transition-colors'
                )}
              >
                <User className="w-4 h-4" />
                Profile
              </button>
              <button
                onClick={() => { logout(); setProfileOpen(false) }}
                className={cn(
                  'flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm',
                  'text-destructive hover:bg-destructive-muted transition-colors'
                )}
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
