import { Outlet } from 'react-router-dom'
import { Sidebar } from './sidebar'
import { Header } from './header'
import { useUIStore } from '@/stores/ui.store'
import { cn } from '@/lib/utils'

export function AppLayout() {
  const collapsed = useUIStore((s) => s.sidebarCollapsed)

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div
        className={cn(
          'transition-all duration-300 ease-in-out',
          collapsed ? 'lg:ml-[72px]' : 'lg:ml-[260px]'
        )}
      >
        <Header />
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
