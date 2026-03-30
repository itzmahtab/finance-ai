import { useLocation } from 'react-router-dom'
import { useUIStore } from '@/stores/ui.store'
import { useAuthStore } from '@/stores/auth.store'
import { Menu, Bell, Search, LogOut, User, Check, Trash2, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useNotifications } from '@/hooks/use-notifications'
import { formatDistanceToNow } from 'date-fns'

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
  const [notifOpen, setNotifOpen] = useState(false)
  
  const profileRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  
  const { logout } = useAuth()
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()

  const pageTitle = pageTitles[location.pathname] || 'FinanceAI'

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false)
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
      <div ref={notifRef} className="relative">
        <button
          onClick={() => setNotifOpen(!notifOpen)}
          className={cn(
            "relative p-2 rounded-lg transition-colors",
            notifOpen ? "bg-surface-active text-foreground" : "hover:bg-surface-hover text-foreground-muted"
          )}
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary text-[10px] font-bold text-white flex items-center justify-center rounded-full border-2 border-background">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Notif Dropdown */}
        {notifOpen && (
          <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl glass-strong border border-border shadow-2xl animate-scale-in overflow-hidden">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="font-bold text-foreground">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={() => markAllAsRead()}
                  className="text-[10px] uppercase tracking-wider font-bold text-primary hover:opacity-80 transition-opacity"
                >
                  Mark all as read
                </button>
              )}
            </div>
            <div className="max-height-[400px] overflow-y-auto divide-y divide-white/5">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div 
                    key={n.id} 
                    className={cn(
                      "p-4 flex gap-4 hover:bg-white/5 transition-colors group",
                      !n.isRead && "bg-primary/5"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 shrink-0 rounded-xl flex items-center justify-center",
                      n.type === 'budget_alert' ? "bg-destructive/20 text-destructive" : "bg-accent/20 text-accent"
                    )}>
                      {n.type === 'budget_alert' ? <Bell className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={cn("text-sm font-semibold truncate", !n.isRead ? "text-foreground" : "text-foreground-muted")}>
                          {n.title}
                        </p>
                        {!n.isRead && (
                          <button 
                            onClick={() => markAsRead(n.id)}
                            className="p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-surface-active text-primary transition-all"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-foreground-subtle line-clamp-2 mt-0.5">
                        {n.message}
                      </p>
                      <p className="text-[10px] text-foreground-subtle mt-2 flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-border" />
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 bg-surface-active rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Check className="w-6 h-6 text-foreground-subtle" />
                  </div>
                  <p className="text-sm font-medium text-foreground-muted">All caught up!</p>
                  <p className="text-xs text-foreground-subtle mt-1">No new alerts to show</p>
                </div>
              )}
            </div>
            {notifications.length > 0 && (
              <div className="p-3 bg-surface/50 border-t border-white/5 text-center">
                <button className="text-xs font-semibold text-foreground-subtle hover:text-foreground transition-colors flex items-center justify-center gap-1.5 w-full">
                  <Trash2 className="w-3 h-3" /> Clear History
                </button>
              </div>
            )}
          </div>
        )}
      </div>

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
