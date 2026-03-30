import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { useNotificationStore } from '@/stores/notification.store'

export interface Investment {
  id: string
  userId: string
  name: string
  type: 'stocks' | 'etf' | 'mutual_fund' | 'retirement' | 'crypto' | 'other'
  investedAmount: string
  currentValue: string
  startDate: string
  platform: string
  notes?: string
  updatedAt: string
}

export function useInvestments() {
  const queryClient = useQueryClient()
  const { addToast } = useNotificationStore()

  const { data: investments = [], isLoading } = useQuery<Investment[]>({
    queryKey: ['investments'],
    queryFn: async () => {
      const { data } = await api.get('/investments')
      return data
    },
  })

  const addInvestment = useMutation({
    mutationFn: async (newInv: Partial<Investment>) => {
      const { data } = await api.post('/investments', newInv)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investments'] })
      addToast({
        type: 'success',
        title: 'Investment added!',
        message: 'Your portfolio has been growing.',
      })
    },
  })

  const updateValue = useMutation({
    mutationFn: async ({ id, currentValue }: { id: string; currentValue: number }) => {
      const { data } = await api.patch(`/investments/${id}`, { currentValue })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investments'] })
    },
  })

  const deleteInvestment = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/investments/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investments'] })
      addToast({
        type: 'info',
        title: 'Investment removed',
        message: 'Record deleted from your portfolio.',
      })
    },
  })

  return {
    investments,
    isLoading,
    addInvestment: addInvestment.mutateAsync,
    isAdding: addInvestment.isPending,
    updateValue: updateValue.mutateAsync,
    deleteInvestment: deleteInvestment.mutateAsync,
  }
}
