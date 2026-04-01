import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { useNotificationStore } from '@/stores/notification.store'

export function useGoals() {
  const queryClient = useQueryClient()
  const { addToast } = useNotificationStore()

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const { data } = await api.get('/goals')
      return data
    },
  })

  const createGoal = useMutation({
    mutationFn: async (goalData: any) => {
      const { data } = await api.post('/goals', goalData)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      addToast({
        type: 'success',
        title: 'Goal Created!',
        message: 'Your new financial goal has been saved.',
      })
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Could not create goal. Please try again.',
      })
    },
  })

  const updateGoal = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      const { data: updatedData } = await api.patch(`/goals/${id}`, data)
      return updatedData
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    },
  })

  const deleteGoal = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/goals/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      addToast({
        type: 'success',
        title: 'Goal Deleted',
        message: 'The goal has been removed from your list.',
      })
    },
  })

  return {
    goals,
    isLoading,
    createGoal: createGoal.mutateAsync,
    isCreating: createGoal.isPending,
    updateGoal: updateGoal.mutateAsync,
    deleteGoal: deleteGoal.mutateAsync,
  }
}
