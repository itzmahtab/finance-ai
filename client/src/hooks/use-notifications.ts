import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'budget_alert' | 'goal_milestone' | 'insight' | 'reminder' | 'system'
  isRead: boolean
  metadata: any
  createdAt: string
}

export function useNotifications() {
  const queryClient = useQueryClient()

  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data } = await api.get('/notifications')
      return data
    },
    refetchInterval: 30000, // Polling for new alerts every 30s
  })

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch(`/notifications/${id}/read`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  const markAllAsRead = useMutation({
    mutationFn: async () => {
      const { data } = await api.patch('/notifications/read-all')
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  const unreadCount = notifications.filter(n => !n.isRead).length

  return {
    notifications,
    isLoading,
    unreadCount,
    markAsRead: markAsRead.mutate,
    markAllAsRead: markAllAsRead.mutate,
  }
}
