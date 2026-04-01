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

  const deleteTransaction = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/transactions/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['budget'] })
      addToast({
        type: 'success',
        title: 'Transaction Deleted',
        message: 'The transaction has been removed.',
      })
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Could not delete transaction.',
      })
    },
  })

  const importTransactions = useMutation({
    mutationFn: async (transactionsData: any) => {
      const { data } = await api.post('/transactions/bulk', { transactions: transactionsData })
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['budget'] })
      addToast({
        type: 'success',
        title: 'Transactions Imported',
        message: `Successfully imported ${data.length} transactions.`,
      })
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Import Failed',
        message: 'There was an error importing your CSV.',
      })
    },
  })

  return {
    transactions,
    categories,
    isLoading,
    createTransaction: createTransaction.mutateAsync,
    isSubmitting: createTransaction.isPending,
    deleteTransaction: deleteTransaction.mutateAsync,
    importTransactions: importTransactions.mutateAsync,
    isImporting: importTransactions.isPending,
  }
}
