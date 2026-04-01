import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { useNotificationStore } from '@/stores/notification.store'
import { useAuthStore } from '@/stores/auth.store'

export function useProfile() {
  const queryClient = useQueryClient()
  const { addToast } = useNotificationStore()
  const setUser = useAuthStore((state) => state.setUser)
  const user = useAuthStore((state) => state.user)

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await api.get('/profile')
      return data
    },
  })

  const updateProfile = useMutation({
    mutationFn: async (profileData: any) => {
      const { data } = await api.patch('/profile', profileData)
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      addToast({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your settings have been saved successfully.',
      })
      // Sync the auth store with part of the profile data (name, country, currency)
      if (user) {
        setUser({
          ...user,
          fullName: data.fullName,
          country: data.country,
          currency: data.currency,
        })
      }
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Could not update your profile.',
      })
    },
  })

  return {
    profile,
    isLoading,
    updateProfile: updateProfile.mutateAsync,
    isUpdating: updateProfile.isPending,
  }
}
