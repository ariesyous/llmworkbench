import { useCallback, useRef, useState } from 'react'
import { addMessage, updateMessage } from '../db/messagesRepo'
import { streamChatCompletion } from '../lib/openrouterClient'
import type { ChatMessageInput } from '../types/openrouter'
import type { Message, Thread } from '../types/thread'

interface UseChatArgs {
  thread: Thread | null
  apiKey: string | null
  messages: Message[]
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  onAutoTitle?: (title: string) => void
}

const AUTO_TITLE_MAX_LENGTH = 48

function deriveTitle(text: string): string {
  const singleLine = text.trim().replace(/\s+/g, ' ')
  if (singleLine.length <= AUTO_TITLE_MAX_LENGTH) return singleLine
  return `${singleLine.slice(0, AUTO_TITLE_MAX_LENGTH - 1)}…`
}

export function useChat({ thread, apiKey, messages, setMessages, onAutoTitle }: UseChatArgs) {
  const [isStreaming, setIsStreaming] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const stopGenerating = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  const sendMessage = useCallback(
    async (text: string) => {
      if (!thread || !apiKey || !text.trim() || isStreaming) return

      if (messages.length === 0 && thread.title === 'New chat') {
        onAutoTitle?.(deriveTitle(text))
      }

      const userMessage = await addMessage({
        threadId: thread.id,
        role: 'user',
        content: text,
      })
      setMessages((prev) => [...prev, userMessage])

      const history: ChatMessageInput[] = [
        { role: 'system', content: thread.systemPrompt },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: 'user', content: text },
      ]

      const assistantMessage = await addMessage({
        threadId: thread.id,
        role: 'assistant',
        content: '',
        model: thread.model,
      })
      setMessages((prev) => [...prev, assistantMessage])

      const controller = new AbortController()
      abortRef.current = controller
      setIsStreaming(true)

      let accumulated = ''
      let actualModel = thread.model
      const applyToken = (token: string) => {
        accumulated += token
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantMessage.id ? { ...m, content: accumulated } : m)),
        )
      }
      const applyModel = (model: string) => {
        actualModel = model
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantMessage.id ? { ...m, model } : m)),
        )
      }

      try {
        await streamChatCompletion({
          apiKey,
          model: thread.model,
          messages: history,
          signal: controller.signal,
          onToken: applyToken,
          onModel: applyModel,
        })
        await updateMessage(assistantMessage.id, { content: accumulated, model: actualModel })
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Something went wrong'
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantMessage.id ? { ...m, error: message } : m)),
        )
        await updateMessage(assistantMessage.id, {
          content: accumulated,
          model: actualModel,
          error: message,
        })
      } finally {
        setIsStreaming(false)
        abortRef.current = null
      }
    },
    [apiKey, isStreaming, messages, onAutoTitle, setMessages, thread],
  )

  return { isStreaming, sendMessage, stopGenerating }
}
