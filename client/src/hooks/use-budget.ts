import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { useNotificationStore } from '@/stores/notification.store'

export function useBudget() {
  const queryClient = useQueryClient()
  const { addToast } = useNotificationStore()

  const { data: budget, isLoading } = useQuery({
    queryKey: ['budget'],
    queryFn: async () => {
      const { data } = await api.get('/budgets/current')
      return data
    },
  })

  const initBudget = useMutation({
    mutationFn: async ({ totalAmount, strategy }: { totalAmount: number; strategy: string }) => {
      const { data } = await api.post('/budgets/init', { totalAmount, strategy })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget'] })
      addToast({
        type: 'success',
        title: 'Budget initialized!',
        message: 'Your month is planned with the 50/30/20 rule.',
      })
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Could not initialize budget.',
      })
    },
  })

  return {
    budget,
    isLoading,
    initBudget: initBudget.mutateAsync,
    isInitializing: initBudget.isPending,
  }
}
