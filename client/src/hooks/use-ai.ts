import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect, useCallback } from 'react'
import api from '@/lib/api'
import { useNotificationStore } from '@/stores/notification.store'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function useAI() {
  const queryClient = useQueryClient()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "👋 Hi! I'm your AI Financial Advisor. I've analyzed your BDT profile and current budget. How can I help you optimize your finances today?",
      timestamp: new Date(),
    },
  ])

  // Fetch history on mount
  const { data: history, isLoading: loadingHistory } = useQuery({
    queryKey: ['ai-history'],
    queryFn: async () => {
      const { data } = await api.get('/ai/history')
      return data
    },
  })

  // Sync history to state
  useEffect(() => {
    if (history && history.length > 0) {
      // Flatten messages from the DB structure
      const flattened = [...history]
        .reverse() // Reverse the conversations (bring oldest to front)
        .flatMap((h: any) => 
          h.messages.map((m: any, i: number) => ({
            id: `${h.id}-${i}`,
            ...m,
            timestamp: new Date(h.createdAt)
          }))
        )
      
      setMessages(flattened)
    }
  }, [history])

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const { data } = await api.post('/ai/chat', { message })
      return data.response
    },
    onSuccess: (response) => {
      const aiMsg: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMsg])
      queryClient.invalidateQueries({ queryKey: ['ai-history'] })
    },
    onError: (error: any) => {
      const { addToast } = useNotificationStore.getState()
      addToast({
        type: 'error',
        title: 'Advisor Error',
        message: error.response?.data?.message || 'Could not reach your AI advisor. Please try again.',
      })
    },
  })

  const sendMessage = useCallback(async (content: string) => {
    const userMsg: Message = {
      id: (Date.now() - 1).toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMsg])
    return chatMutation.mutateAsync(content)
  }, [chatMutation])

  return {
    messages,
    sendMessage,
    isTyping: chatMutation.isPending,
    isLoadingHistory: loadingHistory,
  }
}
