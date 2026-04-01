import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppLayout } from '@/components/layout/app-layout'
import { useAuth } from '@/hooks/use-auth'

// Pages
import LandingPage from '@/pages/landing'
import LoginPage from '@/pages/login'
import RegisterPage from '@/pages/register'
import DashboardPage from '@/pages/dashboard'
import TransactionsPage from '@/pages/transactions'
import BudgetPage from '@/pages/budget'
import InvestmentsPage from '@/pages/investments'
import GoalsPage from '@/pages/goals'
import AIAdvisorPage from '@/pages/ai-advisor'
import ReportsPage from '@/pages/reports'
import SettingsPage from '@/pages/settings'
import NotFoundPage from '@/pages/not-found'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
})

function AppContent() {
  const { checkSession } = useAuth()

  useEffect(() => {
    checkSession()
  }, [checkSession])

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* App routes (with sidebar layout) */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/budget" element={<BudgetPage />} />
        <Route path="/investments" element={<InvestmentsPage />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/ai-advisor" element={<AIAdvisorPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

import { Toaster } from 'sonner'

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
        <Toaster position="top-right" richColors closeButton />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
