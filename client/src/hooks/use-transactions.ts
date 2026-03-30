import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { useNotificationStore } from '@/stores/notification.store'

export function useTransactions() {
  const queryClient = useQueryClient()
  const { addToast } = useNotificationStore()

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data } = await api.get('/transactions')
      return data
    },
  })

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('/transactions/categories')
      return data
    },
  })

  const createTransaction = useMutation({
    mutationFn: async (txData: any) => {
      const { data } = await api.post('/transactions', txData)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['budget'] }) // Invalidate budget as it's linked
      addToast({
        type: 'success',
        title: 'Transaction added!',
        message: 'Your finances have been updated.',
      })
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Could not save transaction.',
      })
    },
  })

  return {
    transactions,
    categories,
    isLoading,
    createTransaction: createTransaction.mutateAsync,
    isSubmitting: createTransaction.isPending,
  }
}
