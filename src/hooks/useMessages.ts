import { useCallback, useEffect, useState } from 'react'
import { getMessagesByThread } from '../db/messagesRepo'
import type { Message } from '../types/thread'

export function useMessages(threadId: string | null) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!threadId) {
      setMessages([])
      return
    }
    setLoading(true)
    const list = await getMessagesByThread(threadId)
    setMessages(list)
    setLoading(false)
  }, [threadId])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { messages, setMessages, loading, refresh }
}
