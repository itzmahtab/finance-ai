import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'
import { useNotificationStore } from '@/stores/notification.store'
import api from '@/lib/api'

export function useAuth() {
  const navigate = useNavigate()
  
  // Use selectors to prevent unnecessary re-renders when other parts of the store change
  const setUser = useAuthStore((state) => state.setUser)
  const storeLogout = useAuthStore((state) => state.logout)
  const setLoading = useAuthStore((state) => state.setLoading)
  
  const addToast = useNotificationStore((state) => state.addToast)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const login = useCallback(async (email: string, password: string) => {
    setIsSubmitting(true)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem('accessToken', data.accessToken)
      setUser(data.user)
      addToast({
        type: 'success',
        title: 'Welcome back!',
        message: `Logged in as ${data.user.email}`,
      })
      navigate('/dashboard')
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Login failed',
        message: error.response?.data?.message || 'Invalid email or password',
      })
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }, [setUser, addToast, navigate])

  const register = useCallback(async (name: string, email: string, password: string) => {
    setIsSubmitting(true)
    try {
      const { data } = await api.post('/auth/register', { fullName: name, email, password })
      localStorage.setItem('accessToken', data.accessToken)
      setUser(data.user)
      addToast({
        type: 'success',
        title: 'Account created!',
        message: 'Welcome to FinanceAI.',
      })
      navigate('/dashboard')
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Registration failed',
        message: error.response?.data?.message || 'Something went wrong',
      })
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }, [setUser, addToast, navigate])

  const logout = useCallback(() => {
    storeLogout()
    addToast({
      type: 'info',
      title: 'Logged out',
      message: 'You have been safely signed out.',
    })
    navigate('/')
  }, [storeLogout, addToast, navigate])

  const checkSession = useCallback(async () => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const { data } = await api.get('/auth/me')
      setUser(data.user)
    } catch {
      storeLogout()
    } finally {
      setLoading(false)
    }
  }, [setUser, setLoading, storeLogout])

  return {
    login,
    register,
    logout,
    checkSession,
    isSubmitting,
  }
}
